const DISMISS_KEY = "optiblue-install-banner-dismissed";

export function isStandalone(): boolean {
  // jsdom (entorno de test) no implementa matchMedia; en un navegador real
  // siempre existe, pero igual se guarda por si corre en un contexto sin CSSOM.
  const isDisplayModeStandalone =
    typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
  const isIosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
  return isDisplayModeStandalone || isIosStandalone;
}

export function isIOS(): boolean {
  const classicIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const desktopClassIPad =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return classicIOS || desktopClassIPad;
}

export function isInstallBannerDismissed(): boolean {
  return window.localStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissInstallBanner(): void {
  window.localStorage.setItem(DISMISS_KEY, "1");
}
