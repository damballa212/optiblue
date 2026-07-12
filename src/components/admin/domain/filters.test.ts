import { describe, expect, it } from "vitest";
import { filterAdminRecords, normalizeAdminSearch } from "./filters";

const records = [
  {
    id: "1",
    nombre: "María Gómez",
    telefono: "+58 412-111",
    sedeId: "barinas",
    estado: "pendiente",
  },
  {
    id: "2",
    nombre: "José Pérez",
    telefono: "+58 424-222",
    sedeId: "acarigua",
    estado: "pagado",
  },
];

describe("admin filters", () => {
  it("normaliza mayusculas y diacriticos", () => {
    expect(normalizeAdminSearch("  María GÓMEZ ")).toBe("maria gomez");
  });

  it("busca por nombre o telefono", () => {
    expect(
      filterAdminRecords(records, {
        query: "maria",
        estado: "todos",
        sedeId: "todas",
      }).map((item) => item.id),
    ).toEqual(["1"]);
    expect(
      filterAdminRecords(records, {
        query: "424222",
        estado: "todos",
        sedeId: "todas",
      }).map((item) => item.id),
    ).toEqual(["2"]);
  });

  it("combina estado y sede", () => {
    expect(
      filterAdminRecords(records, {
        query: "",
        estado: "pendiente",
        sedeId: "barinas",
      }).map((item) => item.id),
    ).toEqual(["1"]);
    expect(
      filterAdminRecords(records, {
        query: "",
        estado: "pagado",
        sedeId: "barinas",
      }),
    ).toEqual([]);
  });
});
