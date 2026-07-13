import { registerSW } from "virtual:pwa-register";

interface PwaCallbacks {
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
}

// Cada cuánto se revisa si hay una versión nueva del SW mientras la pestaña
// sigue abierta. Sin esto, en una SPA (donde tras la carga inicial nunca
// hay otra navegación "de verdad") el navegador prácticamente nunca vuelve
// a chequear el SW por su cuenta — el aviso de actualización no aparecía
// nunca en el uso normal, aunque el deploy ya estuviera en el servidor
// (confirmado 2026-07-13). No se puede pedirle a cada usuario que borre el
// caché del sitio manualmente en cada deploy.
const UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Registra el service worker único de la app en modo "prompt": nunca
 * reemplaza una versión activa sin que el usuario confirme (ver
 * UpdateToast), para evitar que se pierda estado a mitad de una acción.
 */
export function initServiceWorker(callbacks: PwaCallbacks = {}): (reloadPage?: boolean) => Promise<void> {
  return registerSW({
    immediate: true,
    onNeedRefresh: callbacks.onNeedRefresh,
    onOfflineReady: callbacks.onOfflineReady,
    onRegisteredSW(_swScriptUrl, registration) {
      if (!registration) return;

      const checkForUpdate = () => void registration.update();

      setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          checkForUpdate();
        }
      });
    },
  });
}
