import { describe, expect, it } from "vitest";
import type { Cita, Cotizacion, Pedido } from "../../../types";
import { buildAttentionItems } from "./attention";

const pedido = (
  id: string,
  fecha: string,
  estado: Pedido["estado"] = "pendiente",
): Pedido => ({
  id,
  nombre: `Pedido ${id}`,
  telefono: "584120000000",
  sedeId: "s1",
  productoId: "p1",
  precio: 20,
  fecha,
  estado,
});

const cita = (
  id: string,
  fecha: string,
  hora: string,
  estado: Cita["estado"] = "pendiente",
): Cita => ({
  id,
  nombre: `Cita ${id}`,
  telefono: "584120000000",
  sedeId: "s1",
  fecha,
  hora,
  motivo: "Evaluacion",
  nota: "",
  estado,
});

const cotizacion = (
  id: string,
  fecha: string,
  estado: Cotizacion["estado"] = "pendiente",
): Cotizacion => ({
  id,
  nombre: `Cotizacion ${id}`,
  telefono: "584120000000",
  sedeId: "s1",
  productoId: "p1",
  od: "",
  oi: "",
  astigmatismoOD: "",
  astigmatismoOI: "",
  extras: [],
  total: 30,
  fecha,
  estado,
});

describe("buildAttentionItems", () => {
  it("incluye solo estados pendientes", () => {
    const items = buildAttentionItems({
      pedidos: [
        pedido("pendiente", "2026-07-12"),
        pedido("pagado", "2026-07-13", "pagado"),
      ],
      citas: [
        cita("pendiente", "2026-07-13", "10:00"),
        cita("confirmada", "2026-07-12", "09:00", "confirmada"),
      ],
      cotizaciones: [
        cotizacion("pendiente", "2026-07-12"),
        cotizacion("cerrada", "2026-07-13", "cerrada"),
      ],
      productos: [],
      sedes: [],
    });

    expect(items.map((item) => item.id)).toEqual([
      "pendiente",
      "pendiente",
      "pendiente",
    ]);
    expect(items.map((item) => item.kind)).toEqual([
      "cita",
      "pedido",
      "cotizacion",
    ]);
  });

  it("prioriza citas por fecha y hora ascendente antes de operaciones recientes", () => {
    const items = buildAttentionItems({
      pedidos: [pedido("pedido-nuevo", "2026-07-12")],
      citas: [
        cita("cita-tarde", "2026-07-13", "14:00"),
        cita("cita-temprano", "2026-07-12", "09:00"),
      ],
      cotizaciones: [cotizacion("cotizacion-nueva", "2026-07-14")],
      productos: [],
      sedes: [],
    });

    expect(items.map((item) => item.id)).toEqual([
      "cita-temprano",
      "cita-tarde",
      "cotizacion-nueva",
      "pedido-nuevo",
    ]);
  });

  it("deja fechas invalidas visibles al final de cada grupo", () => {
    const items = buildAttentionItems({
      pedidos: [
        pedido("pedido-valido", "2026-07-12"),
        pedido("pedido-invalido", "sin-fecha"),
      ],
      citas: [
        cita("cita-invalida", "mañana", "tarde"),
        cita("cita-valida", "2026-07-13", "10:00"),
      ],
      cotizaciones: [],
      productos: [],
      sedes: [],
    });

    expect(items.map((item) => item.id)).toEqual([
      "cita-valida",
      "cita-invalida",
      "pedido-valido",
      "pedido-invalido",
    ]);
    expect(
      items.find((item) => item.id === "cita-invalida")?.dateLabel,
    ).toBeNull();
  });

  it("resuelve sede y producto con fallbacks honestos", () => {
    const [item] = buildAttentionItems({
      pedidos: [pedido("p", "2026-07-12")],
      citas: [],
      cotizaciones: [],
      productos: [
        {
          id: "p1",
          nombre: "Montura real",
          categoriaId: "c1",
          precio: 20,
          imagenUrl: null,
          descripcion: "",
          stock: 1,
          destacado: false,
        },
      ],
      sedes: [
        {
          id: "s1",
          ciudad: "Barinas",
          direccion: "d",
          telefono: "t",
          whatsapp: "w",
          horario: "h",
          maps: "https://maps.google.com",
        },
      ],
    });

    expect(item.locationLabel).toBe("Barinas");
    expect(item.contextLabel).toBe("Montura real");
  });
});
