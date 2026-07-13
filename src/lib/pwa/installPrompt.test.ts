// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installLocalStorageStub } from "../../testUtils/localStorageStub";
import { dismissInstallBanner, isIOS, isInstallBannerDismissed, isStandalone } from "./installPrompt";

describe("isIOS", () => {
  const originalUserAgent = navigator.userAgent;
  const originalPlatform = navigator.platform;
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", { configurable: true, value: originalUserAgent });
    Object.defineProperty(navigator, "platform", { configurable: true, value: originalPlatform });
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: originalMaxTouchPoints });
  });

  it("returns true for an iPhone user agent", () => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    });
    expect(isIOS()).toBe(true);
  });

  it("returns false for an Android user agent", () => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (Linux; Android 14)",
    });
    expect(isIOS()).toBe(false);
  });

  it("detecta iPadOS cuando Safari usa user agent de Macintosh", () => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
    });
    Object.defineProperty(navigator, "platform", { configurable: true, value: "MacIntel" });
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: 5 });
    expect(isIOS()).toBe(true);
  });
});

describe("isStandalone", () => {
  it("returns false when neither display-mode nor navigator.standalone indicate standalone", () => {
    expect(isStandalone()).toBe(false);
  });
});

describe("install banner dismissal", () => {
  beforeEach(() => {
    installLocalStorageStub();
  });

  it("is not dismissed by default", () => {
    expect(isInstallBannerDismissed()).toBe(false);
  });

  it("persists dismissal across calls", () => {
    dismissInstallBanner();
    expect(isInstallBannerDismissed()).toBe(true);
  });
});
