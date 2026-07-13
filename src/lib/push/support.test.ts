// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { detectarSoportePush } from "./support";

function setUserAgent(value: string) {
  Object.defineProperty(window.navigator, "userAgent", { configurable: true, value });
}

function setStandalone(value: boolean) {
  Object.defineProperty(window.navigator, "standalone", { configurable: true, value });
}

function stubPushApis(present: boolean) {
  if (present) {
    (window as unknown as { Notification: unknown }).Notification = class {};
    (window as unknown as { PushManager: unknown }).PushManager = class {};
    Object.defineProperty(window.navigator, "serviceWorker", { configurable: true, value: {} });
  } else {
    delete (window as unknown as { Notification?: unknown }).Notification;
    delete (window as unknown as { PushManager?: unknown }).PushManager;
    Object.defineProperty(window.navigator, "serviceWorker", { configurable: true, value: undefined });
  }
}

describe("detectarSoportePush", () => {
  const originalUserAgent = window.navigator.userAgent;

  beforeEach(() => {
    setStandalone(false);
  });

  afterEach(() => {
    setUserAgent(originalUserAgent);
    setStandalone(false);
  });

  it("devuelve 'soportado' cuando el navegador expone las APIs de push (Android/desktop)", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 14) Chrome/120");
    stubPushApis(true);
    expect(detectarSoportePush()).toBe("soportado");
  });

  it("devuelve 'no-soportado' cuando faltan las APIs y no es iOS", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 14) Chrome/120");
    stubPushApis(false);
    expect(detectarSoportePush()).toBe("no-soportado");
  });

  it("devuelve 'requiere-instalacion' en iOS sin instalar, aunque falten las APIs", () => {
    setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
    stubPushApis(false);
    setStandalone(false);
    expect(detectarSoportePush()).toBe("requiere-instalacion");
  });

  it("devuelve 'requiere-instalacion' en iOS aunque las APIs existan, si no está instalada", () => {
    setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
    stubPushApis(true);
    setStandalone(false);
    expect(detectarSoportePush()).toBe("requiere-instalacion");
  });

  it("devuelve 'soportado' en iOS instalada (standalone) con las APIs presentes", () => {
    setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
    stubPushApis(true);
    setStandalone(true);
    expect(detectarSoportePush()).toBe("soportado");
  });
});
