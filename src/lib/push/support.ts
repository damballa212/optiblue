import { isIOS, isStandalone } from "../pwa/installPrompt";

export type PushSupportStatus = "no-soportado" | "requiere-instalacion" | "soportado";

// En iOS/iPadOS, Notification/PushManager solo existen cuando la PWA está
// instalada en pantalla de inicio (iOS 16.4+) — Safari en pestaña normal no
// las expone en absoluto. Se distingue de "no soportado real" para poder
// guiar al usuario en vez de decirle que su dispositivo no sirve.
export function detectarSoportePush(): PushSupportStatus {
  const tieneApisDePush = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

  if (!tieneApisDePush) {
    return isIOS() && !isStandalone() ? "requiere-instalacion" : "no-soportado";
  }

  if (isIOS() && !isStandalone()) {
    return "requiere-instalacion";
  }

  return "soportado";
}
