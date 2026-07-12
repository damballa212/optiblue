import { describe, expect, it } from "vitest";
import { getAdminStatusMeta } from "./status";

describe("getAdminStatusMeta", () => {
  it("reserva color para atencion y progreso", () => {
    expect(getAdminStatusMeta("pedido", "pendiente").tone).toBe("attention");
    expect(getAdminStatusMeta("cita", "confirmada").tone).toBe("progress");
    expect(getAdminStatusMeta("cotizacion", "contactado").tone).toBe("progress");
  });

  it("mantiene resultados y cierres negativos neutrales", () => {
    expect(getAdminStatusMeta("pedido", "pagado").tone).toBe("resolved");
    expect(getAdminStatusMeta("cita", "completada").tone).toBe("resolved");
    expect(getAdminStatusMeta("cotizacion", "cerrada").tone).toBe("resolved");
    expect(getAdminStatusMeta("pedido", "no_pagado").tone).toBe("closed");
    expect(getAdminStatusMeta("cita", "cancelada").tone).toBe("closed");
  });
});
