import { notificacionesApi } from "../api/notificaciones";
import { eliminarTokenPush, obtenerTokenPush } from "./fcm";

const TOKEN_KEY = "optiblue-push-token";

export function readAdminPushToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeAdminPushToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminPushToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function deactivateAdminPush(): Promise<void> {
  const token = readAdminPushToken();
  const tasks: Promise<unknown>[] = [];
  if (token) tasks.push(notificacionesApi.desregistrarToken({ token }));
  tasks.push(eliminarTokenPush());
  await Promise.allSettled(tasks);
  clearAdminPushToken();
}

export async function reconcileAdminPushToken(): Promise<void> {
  const token = readAdminPushToken();
  if (
    !token ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    Notification.permission !== "granted"
  )
    return;
  const registration = await navigator.serviceWorker.ready;
  const currentToken = await obtenerTokenPush(registration);
  if (currentToken !== token) {
    await notificacionesApi.desregistrarToken({ token });
    storeAdminPushToken(currentToken);
  }
  await notificacionesApi.registrarToken({
    token: currentToken,
    userAgent: navigator.userAgent,
  });
}
