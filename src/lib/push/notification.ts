export type AdminNotificationType = "pedido" | "cita" | "cotizacion";

export interface AdminForegroundNotification {
  title: string;
  body: string;
  tipo?: AdminNotificationType;
  id?: string;
}

interface NotificationPayloadLike {
  notification?: { title?: string; body?: string };
  data?: Record<string, string>;
}

const ROUTES: Record<AdminNotificationType, string> = {
  pedido: "/admin/pedidos",
  cita: "/admin/citas",
  cotizacion: "/admin/cotizaciones",
};

function isAdminNotificationType(value: string | undefined): value is AdminNotificationType {
  return value === "pedido" || value === "cita" || value === "cotizacion";
}

export function parseAdminNotification(
  payload: NotificationPayloadLike,
): AdminForegroundNotification | null {
  const title = payload.notification?.title;
  if (!title) return null;
  const base = { title, body: payload.notification?.body ?? "" };
  const tipo = payload.data?.tipo;
  const id = payload.data?.id;
  return isAdminNotificationType(tipo) && id ? { ...base, tipo, id } : base;
}

export function getAdminNotificationRoute(tipo: AdminNotificationType): string {
  return ROUTES[tipo];
}
