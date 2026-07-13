import type { AdminEntityKind } from "./attention";

export type AdminPrimaryTab =
  | "hoy"
  | "pedidos"
  | "citas"
  | "cotizaciones"
  | "mas";

const ADMIN_ROUTE_TITLES: Record<string, string> = {
  "/admin/hoy": "Hoy",
  "/admin/pedidos": "Pedidos",
  "/admin/citas": "Citas",
  "/admin/cotizaciones": "Cotizaciones",
  "/admin/catalogo": "Catálogo",
  "/admin/sedes": "Sedes",
  "/admin/mas": "Más",
};

const ENTITY_LABELS: Record<AdminEntityKind, string> = {
  pedido: "Pedido",
  cita: "Cita",
  cotizacion: "Cotización",
};

const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

export function getAdminRouteTitle(pathname: string): string {
  return ADMIN_ROUTE_TITLES[pathname] ?? "Administración";
}

export function getAdminPrimaryTab(pathname: string): AdminPrimaryTab | null {
  if (pathname === "/admin/hoy") return "hoy";
  if (pathname === "/admin/pedidos") return "pedidos";
  if (pathname === "/admin/citas") return "citas";
  if (pathname === "/admin/cotizaciones") return "cotizaciones";
  if (
    pathname === "/admin/mas" ||
    pathname === "/admin/catalogo" ||
    pathname === "/admin/sedes"
  )
    return "mas";
  return null;
}

export function formatAdminEntityKind(kind: AdminEntityKind): string {
  return ENTITY_LABELS[kind];
}

export function formatRecordCount(
  filtered: number,
  total: number,
  filteredView: boolean,
): string {
  if (filteredView) return `${filtered} de ${total} registros`;
  return `${total} ${total === 1 ? "registro" : "registros"}`;
}

export function formatAdminDate(value: string, time?: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return time ? `${value} · ${time}` : value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return time ? `${value} · ${time}` : value;
  const formatted = `${day} ${MONTHS[month - 1]} ${year}`;
  return time ? `${formatted} · ${time}` : formatted;
}

export function formatAdminAmount(value: number): string {
  const formatted = new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  return `$${formatted}`;
}
