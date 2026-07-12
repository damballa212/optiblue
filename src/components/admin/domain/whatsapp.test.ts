import { describe, expect, it } from "vitest";
import type { Cita, Cotizacion, Pedido } from "../../../types";
import { buildAdminWhatsAppMessage } from "./whatsapp";

describe("buildAdminWhatsAppMessage", () => {
  it("genera mensajes editables con los campos reales", () => {
    const pedido = {
      id: "1",
      nombre: "Ana",
      telefono: "58412",
      sedeId: "s1",
      productoId: "p1",
      precio: 20,
      fecha: "2026-07-12",
      estado: "pendiente",
    } satisfies Pedido;
    const cita = {
      id: "2",
      nombre: "Luis",
      telefono: "58424",
      sedeId: "s1",
      fecha: "2026-07-13",
      hora: "10:00",
      motivo: "Evaluacion",
      nota: "",
      estado: "pendiente",
    } satisfies Cita;
    const cotizacion = {
      id: "3",
      nombre: "Mia",
      telefono: "58414",
      sedeId: "s1",
      productoId: "p1",
      od: "-1",
      oi: "-2",
      astigmatismoOD: "0",
      astigmatismoOI: "0",
      extras: ["filtro azul"],
      total: 40,
      fecha: "2026-07-12",
      estado: "pendiente",
    } satisfies Cotizacion;

    expect(
      buildAdminWhatsAppMessage({
        kind: "pedido",
        entity: pedido,
        location: "Barinas",
        product: "Montura",
      }),
    ).toContain("Ana");
    expect(
      buildAdminWhatsAppMessage({
        kind: "cita",
        entity: cita,
        location: "Barinas",
      }),
    ).toContain("10:00");
    expect(
      buildAdminWhatsAppMessage({
        kind: "cotizacion",
        entity: cotizacion,
        location: "Barinas",
        product: "Montura",
      }),
    ).toContain("$40");
  });
});
