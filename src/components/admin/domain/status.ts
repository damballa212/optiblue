import type { EstadoCita, EstadoCotizacion, EstadoPedido } from "../../../types";
import type { AdminEntityKind } from "./attention";

export type AdminStatusTone = "attention" | "progress" | "resolved" | "closed";

export interface AdminStatusMeta {
  label: string;
  tone: AdminStatusTone;
}

type StatusByKind = {
  pedido: EstadoPedido;
  cita: EstadoCita;
  cotizacion: EstadoCotizacion;
};

const STATUS_META: { [K in AdminEntityKind]: Record<StatusByKind[K], AdminStatusMeta> } = {
  pedido: {
    pendiente: { label: "Pendiente", tone: "attention" },
    pagado: { label: "Pagado", tone: "resolved" },
    no_pagado: { label: "No pagado", tone: "closed" },
  },
  cita: {
    pendiente: { label: "Pendiente", tone: "attention" },
    confirmada: { label: "Confirmada", tone: "progress" },
    completada: { label: "Completada", tone: "resolved" },
    cancelada: { label: "Cancelada", tone: "closed" },
  },
  cotizacion: {
    pendiente: { label: "Pendiente", tone: "attention" },
    contactado: { label: "Contactado", tone: "progress" },
    cerrada: { label: "Cerrada", tone: "resolved" },
  },
};

export function getAdminStatusMeta<K extends AdminEntityKind>(kind: K, status: StatusByKind[K]): AdminStatusMeta {
  return STATUS_META[kind][status];
}

export const ADMIN_STATUS_OPTIONS = {
  pedido: ["pendiente", "pagado", "no_pagado"],
  cita: ["pendiente", "confirmada", "completada", "cancelada"],
  cotizacion: ["pendiente", "contactado", "cerrada"],
} as const;
