/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

// Compartido entre el SW del storefront y el del panel: precache del
// app-shell + fallback de navegación de la SPA. Vive en su propio módulo
// porque el precache de Workbox debe ser un único __WB_MANIFEST por SW
// (no se puede duplicar entre dos strategies), y ambos entry points lo
// necesitan igual.
export function setupCoreServiceWorker(): void {
  precacheAndRoute(self.__WB_MANIFEST);
  cleanupOutdatedCaches();

  // Fallback de navegación para el SPA: cualquier ruta de la app sirve
  // index.html desde caché. Denylist explícita para NO interceptar:
  // - /__/... : helpers de Firebase Hosting (auth handler, reservedUrls)
  // - assets con extensión (los sirve el precache/red directamente)
  const navigationRoute = new NavigationRoute(createHandlerBoundToURL("/index.html"), {
    denylist: [/^\/__\//, /\.[a-zA-Z0-9]+$/],
  });
  registerRoute(navigationRoute);

  // Nunca registrar rutas que matcheen las Cloud Functions (*.run.app /
  // *.cloudfunctions.net) ni Firestore (firestore.googleapis.com,
  // WebChannel): deben ir siempre a red, tal cual, sin pasar por el SW.

  // NUNCA self.skipWaiting() incondicional acá: con registerType "prompt",
  // el SW nuevo debe quedarse en estado "waiting" hasta que el usuario
  // confirme la actualización (UpdateToast) — recién ahí el cliente manda
  // el mensaje SKIP_WAITING que dispara el activate de abajo. Llamar
  // skipWaiting() sin esperar ese mensaje hacía que el SW nuevo se
  // autoactivara casi al instante, sin quedar "waiting" el tiempo
  // suficiente para que el navegador lo detecte y muestre el aviso —
  // por eso las actualizaciones nunca se notaban (confirmado 2026-07-13).
  self.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
  });
}
