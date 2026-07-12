import { describe, expect, it } from "vitest";
import { validateCategoryForm, validateLocationForm, validateProductForm } from "./forms";

describe("admin form validation", () => {
  it("rechaza precio negativo, stock decimal y URL de imagen invalida", () => {
    expect(validateProductForm({ nombre: "Producto", categoriaId: "c1", precio: "-1", stock: "1.5", imagenUrl: "ftp://imagen", descripcion: "", destacado: false })).toMatchObject({
      precio: expect.any(String),
      stock: expect.any(String),
      imagenUrl: expect.any(String),
    });
  });

  it("acepta URL de imagen vacia y numeros no negativos", () => {
    expect(validateProductForm({ nombre: "Producto", categoriaId: "c1", precio: "0", stock: "0", imagenUrl: "", descripcion: "", destacado: false })).toEqual({});
  });

  it("valida categoria y orden", () => {
    expect(validateCategoryForm({ key: "", label: "", orden: "-1" })).toEqual({ key: expect.any(String), label: expect.any(String), orden: expect.any(String) });
  });

  it("valida los seis campos de sede y Maps HTTP", () => {
    expect(validateLocationForm({ ciudad: "", direccion: "", telefono: "", whatsapp: "", horario: "", maps: "maps" })).toEqual({
      ciudad: expect.any(String),
      direccion: expect.any(String),
      telefono: expect.any(String),
      whatsapp: expect.any(String),
      horario: expect.any(String),
      maps: expect.any(String),
    });
  });
});
