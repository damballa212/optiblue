import { deleteToken, getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import { firebaseApp } from "../firebase";
import {
  parseAdminNotification,
  type AdminForegroundNotification,
} from "./notification";

let messagingInstance: Messaging | null = null;

function getMessagingInstance(): Messaging {
  if (!messagingInstance) {
    messagingInstance = getMessaging(firebaseApp);
  }
  return messagingInstance;
}

// Pide permiso y, si se concede, obtiene el token FCM del dispositivo
// reutilizando el registro del service worker único (src/sw.ts) — nunca
// registra uno nuevo. Devuelve null si el permiso fue denegado.
export async function solicitarPermisoYToken(swRegistration: ServiceWorkerRegistration): Promise<string | null> {
  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") {
    return null;
  }

  return obtenerTokenPush(swRegistration);
}

export async function obtenerTokenPush(swRegistration: ServiceWorkerRegistration): Promise<string> {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    throw new Error("Falta configurar VITE_FIREBASE_VAPID_KEY.");
  }

  return getToken(getMessagingInstance(), { vapidKey, serviceWorkerRegistration: swRegistration });
}

// Con la app en primer plano, FCM no dispara el service worker — hay que
// escuchar acá y mostrar un toast propio (ver AdminPushToast).
export function escucharForeground(onNotificacion: (payload: AdminForegroundNotification) => void): () => void {
  return onMessage(getMessagingInstance(), (payload) => {
    const notification = parseAdminNotification(payload);
    if (notification) onNotificacion(notification);
  });
}

export async function eliminarTokenPush(): Promise<void> {
  await deleteToken(getMessagingInstance());
}
