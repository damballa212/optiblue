import { describe, expect, it } from "vitest";
import type { Producto } from "../../types";
import { filterAndSortProducts, getCatalogPriceBounds, type CatalogFilters } from "./catalogFilterLogic";

const products: Producto[] = [
  { id: "a", nombre: "Classic", categoriaId: "monturas", precio: 45, imagenUrl: "", descripcion: "A", stock: 3, destacado: true },
  { id: "b", nombre: "Solar", categoriaId: "sol", precio: 70, imagenUrl: "", descripcion: "B", stock: 0, destacado: false },
  { id: "c", nombre: "Essential", categoriaId: "monturas", precio: 30, imagenUrl: "", descripcion: "C", stock: 8, destacado: false },
];

const baseFilters: CatalogFilters = {
  categoryId: "all",
  minPrice: 0,
  maxPrice: 100,
  inStockOnly: false,
  featuredOnly: false,
  sort: "default",
};

describe("filterAndSortProducts", () => {
  it("filters by the real V1 fields together", () => {
    const result = filterAndSortProducts(products, {
      ...baseFilters,
      categoryId: "monturas",
      minPrice: 40,
      inStockOnly: true,
      featuredOnly: true,
    });

    expect(result.map((product) => product.id)).toEqual(["a"]);
  });

  it("sorts by price without mutating the Firestore order", () => {
    const originalOrder = products.map((product) => product.id);
    const result = filterAndSortProducts(products, { ...baseFilters, sort: "price-asc" });

    expect(result.map((product) => product.id)).toEqual(["c", "a", "b"]);
    expect(products.map((product) => product.id)).toEqual(originalOrder);
  });

  it("sorts descending by price", () => {
    const result = filterAndSortProducts(products, { ...baseFilters, sort: "price-desc" });

    expect(result.map((product) => product.id)).toEqual(["b", "a", "c"]);
  });
});

describe("getCatalogPriceBounds", () => {
  it("derives bounds from current product prices", () => {
    expect(getCatalogPriceBounds(products)).toEqual({ min: 30, max: 70 });
  });

  it("returns zero bounds for an empty catalog", () => {
    expect(getCatalogPriceBounds([])).toEqual({ min: 0, max: 0 });
  });
});
