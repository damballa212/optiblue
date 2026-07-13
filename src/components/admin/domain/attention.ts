import type { Cita, Cotizacion, Pedido, Producto, Sede } from "../../../types";
import { formatAdminDate } from "./presentation";

export type AdminEntityKind = "pedido" | "cita" | "cotizacion";

export type AttentionEntity =
  | { kind: "pedido"; entity: Pedido }
  | { kind: "cita"; entity: Cita }
  | { kind: "cotizacion"; entity: Cotizacion };

export interface AttentionItem {
  kind: AdminEntityKind;
  id: string;
  clientName: string;
  phone: string;
  locationLabel: string;
  contextLabel: string;
  dateLabel: string | null;
  nextActionLabel: string;
  entity: Pedido | Cita | Cotizacion;
  sortGroup: number;
  sortValue: number;
}

interface AttentionInput {
  pedidos: Pedido[];
  citas: Cita[];
  cotizaciones: Cotizacion[];
  productos: Producto[];
  sedes: Sede[];
}

function parseDateParts(
  value: string,
): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? { year, month, day }
    : null;
}

export function parseAdminDate(value: string, time?: string): number | null {
  const parts = parseDateParts(value);
  if (!parts) return null;
  let hour = 0;
  let minute = 0;
  if (time !== undefined) {
    const match = /^(\d{2}):(\d{2})$/.exec(time);
    if (!match) return null;
    hour = Number(match[1]);
    minute = Number(match[2]);
    if (hour > 23 || minute > 59) return null;
  }
  return new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    hour,
    minute,
  ).getTime();
}

export function buildAttentionItems({
  pedidos,
  citas,
  cotizaciones,
  productos,
  sedes,
}: AttentionInput): AttentionItem[] {
  const productNames = new Map(
    productos.map((producto) => [producto.id, producto.nombre]),
  );
  const locationNames = new Map(sedes.map((sede) => [sede.id, sede.ciudad]));
  const locationLabel = (sedeId: string) =>
    locationNames.get(sedeId) ?? "Sede no disponible";
  const productLabel = (productoId: string) =>
    productNames.get(productoId) ?? "Producto no disponible";

  const appointmentItems = citas
    .filter((item) => item.estado === "pendiente")
    .map<AttentionItem>((item) => {
      const timestamp = parseAdminDate(item.fecha, item.hora);
      return {
        kind: "cita",
        id: item.id,
        clientName: item.nombre,
        phone: item.telefono,
        locationLabel: locationLabel(item.sedeId),
        contextLabel: item.motivo || "Motivo no indicado",
        dateLabel: timestamp === null ? null : formatAdminDate(item.fecha, item.hora),
        nextActionLabel: "Confirmar cita",
        entity: item,
        sortGroup: timestamp === null ? 1 : 0,
        sortValue: timestamp ?? Number.POSITIVE_INFINITY,
      };
    });

  const operationItems: AttentionItem[] = [
    ...pedidos
      .filter((item) => item.estado === "pendiente")
      .map((item): AttentionItem => {
        const timestamp = parseAdminDate(item.fecha);
        return {
          kind: "pedido",
          id: item.id,
          clientName: item.nombre,
          phone: item.telefono,
          locationLabel: locationLabel(item.sedeId),
          contextLabel: productLabel(item.productoId),
          dateLabel: timestamp === null ? null : formatAdminDate(item.fecha),
          nextActionLabel: "Resolver pago",
          entity: item,
          sortGroup: timestamp === null ? 3 : 2,
          sortValue: timestamp === null ? Number.POSITIVE_INFINITY : -timestamp,
        };
      }),
    ...cotizaciones
      .filter((item) => item.estado === "pendiente")
      .map((item): AttentionItem => {
        const timestamp = parseAdminDate(item.fecha);
        return {
          kind: "cotizacion",
          id: item.id,
          clientName: item.nombre,
          phone: item.telefono,
          locationLabel: locationLabel(item.sedeId),
          contextLabel: productLabel(item.productoId),
          dateLabel: timestamp === null ? null : formatAdminDate(item.fecha),
          nextActionLabel: "Contactar",
          entity: item,
          sortGroup: timestamp === null ? 3 : 2,
          sortValue: timestamp === null ? Number.POSITIVE_INFINITY : -timestamp,
        };
      }),
  ];

  return [...appointmentItems, ...operationItems].sort(
    (a, b) =>
      a.sortGroup - b.sortGroup ||
      a.sortValue - b.sortValue ||
      a.id.localeCompare(b.id),
  );
}
