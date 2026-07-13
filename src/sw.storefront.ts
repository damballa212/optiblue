/// <reference lib="webworker" />
import { setupCoreServiceWorker } from "./sw/core";

// Service worker del storefront público: solo app-shell + navegación
// offline. Deliberadamente SIN el SDK de Firebase Messaging — el storefront
// no usa push (eso es exclusivo del panel admin, ver sw.panel.ts). Importar
// el SDK de messaging tiene efectos secundarios en el módulo (registra sus
// propios listeners de push) con solo importarlo, así que la única forma
// confiable de excluirlo es que este archivo nunca lo importe — un `if`
// en runtime no alcanza (probado: el import queda igual en el bundle).
setupCoreServiceWorker();
