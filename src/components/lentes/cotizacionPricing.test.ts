import { describe, expect, it } from "vitest";
import { calcularTotalPreview, extrasActivos } from "./cotizacionPricing";
import type { ConfiguracionCotizacion } from "../../types";

const CONFIG: ConfiguracionCotizacion = {
  lenteBase: 10,
  extras: [
    { key: "fotocromatico", label: "Fotocromático", descripcion: "", precio: 20, activo: true, orden: 1 },
    { key: "filtroazul", label: "Filtro de luz azul", descripcion: "", precio: 15, activo: true, orden: 2 },
    { key: "descontinuado", label: "Descontinuado", descripcion: "", precio: 5, activo: false, orden: 3 },
  ],
};

describe("extrasActivos", () => {
  it("filtra los extras inactivos", () => {
    expect(extrasActivos(CONFIG).map((e) => e.key)).toEqual(["fotocromatico", "filtroazul"]);
  });

  it("devuelve lista vacía si no hay configuración todavía", () => {
    expect(extrasActivos(null)).toEqual([]);
  });
});

describe("calcularTotalPreview", () => {
  it("suma montura + lente base + extras seleccionados", () => {
    expect(calcularTotalPreview(CONFIG, 45, ["fotocromatico"])).toBe(75);
  });

  it("ignora extras inactivos aunque vengan seleccionados (no deberían poder seleccionarse desde la UI)", () => {
    expect(calcularTotalPreview(CONFIG, 45, ["descontinuado"])).toBe(55);
  });

  it("devuelve solo el precio de la montura si no hay configuración cargada", () => {
    expect(calcularTotalPreview(null, 45, ["fotocromatico"])).toBe(45);
  });

  it("no suma extras desconocidos", () => {
    expect(calcularTotalPreview(CONFIG, 45, ["no-existe"])).toBe(55);
  });
});
