/// <reference lib="webworker" />
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { setupCoreServiceWorker } from "./sw/core";

setupCoreServiceWorker();

// FCM en el service worker del panel admin (nunca un firebase-messaging-sw.js
// aparte: dos SW registrados en el mismo scope se pisan entre sí). Este
// archivo es el único entry point que importa el SDK de Messaging — el
// storefront usa sw.storefront.ts, que nunca lo toca.
const firebaseApp = initializeApp({
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "demo-optiblue",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "demo-api-key",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "0",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "demo-app-id",
});
// Inicializar Messaging registra el handler de push de FCM. El backend envia
// un payload `notification` con `webpush.fcmOptions.link`, por lo que FCM se
// encarga de mostrar un unico aviso en background y abrir la ruta correcta.
// No llamar showNotification() aca: duplicaria el aviso automatico.
getMessaging(firebaseApp);
