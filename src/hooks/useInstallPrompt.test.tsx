// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { installLocalStorageStub } from "../testUtils/localStorageStub";
import { useInstallPrompt } from "./useInstallPrompt";

describe("useInstallPrompt", () => {
  beforeEach(() => {
    installLocalStorageStub();
  });

  it("has no install prompt available until beforeinstallprompt fires", () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canInstall).toBe(false);
  });

  it("captures the deferred prompt and exposes it via canInstall", () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      window.dispatchEvent(event);
    });

    expect(result.current.canInstall).toBe(true);
  });

  it("calls prompt() and userChoice on promptInstall", async () => {
    const { result } = renderHook(() => useInstallPrompt());
    const prompt = vi.fn().mockResolvedValue(undefined);
    const userChoice = Promise.resolve({ outcome: "accepted" as const });

    act(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true }) as Event & {
        prompt: typeof prompt;
        userChoice: typeof userChoice;
      };
      event.prompt = prompt;
      event.userChoice = userChoice;
      window.dispatchEvent(event);
    });

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(prompt).toHaveBeenCalledOnce();
    expect(result.current.canInstall).toBe(false);
  });

  it("persists dismissal in localStorage", () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.dismissed).toBe(false);

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.dismissed).toBe(true);
    expect(window.localStorage.getItem("optiblue-install-banner-dismissed")).toBe("1");
  });
});
