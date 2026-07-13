import { describe, expect, it } from "vitest";
import {
  formatAdminAmount,
  formatAdminDate,
  formatAdminEntityKind,
  formatRecordCount,
  getAdminPrimaryTab,
} from "./presentation";

describe("getAdminPrimaryTab", () => {
  it("agrupa catalogo y sedes bajo Mas", () => {
    expect(getAdminPrimaryTab("/admin/mas")).toBe("mas");
    expect(getAdminPrimaryTab("/admin/catalogo")).toBe("mas");
    expect(getAdminPrimaryTab("/admin/sedes")).toBe("mas");
  });

  it("mantiene las rutas operativas en su tab", () => {
    expect(getAdminPrimaryTab("/admin/hoy")).toBe("hoy");
    expect(getAdminPrimaryTab("/admin/pedidos")).toBe("pedidos");
    expect(getAdminPrimaryTab("/admin/citas")).toBe("citas");
    expect(getAdminPrimaryTab("/admin/cotizaciones")).toBe("cotizaciones");
  });
});

describe("presentacion administrativa", () => {
  it("convierte tipos internos en labels para personas", () => {
    expect(formatAdminEntityKind("pedido")).toBe("Pedido");
    expect(formatAdminEntityKind("cita")).toBe("Cita");
    expect(formatAdminEntityKind("cotizacion")).toBe("Cotización");
  });

  it("distingue conteo total de conteo filtrado", () => {
    expect(formatRecordCount(0, 0, false)).toBe("0 registros");
    expect(formatRecordCount(1, 1, false)).toBe("1 registro");
    expect(formatRecordCount(2, 8, true)).toBe("2 de 8 registros");
  });

  it("formatea fechas ISO sin desplazarlas por zona horaria", () => {
    expect(formatAdminDate("2026-07-12")).toBe("12 jul 2026");
    expect(formatAdminDate("valor-invalido")).toBe("valor-invalido");
  });

  it("formatea importes con el convenio de dolar existente", () => {
    expect(formatAdminAmount(10)).toBe("$10");
    expect(formatAdminAmount(10.5)).toBe("$10,5");
  });
});
