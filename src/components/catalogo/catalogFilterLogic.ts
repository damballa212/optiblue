import type { Producto } from "../../types";

export type CatalogSort = "default" | "price-asc" | "price-desc";

export interface CatalogFilters {
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  featuredOnly: boolean;
  sort: CatalogSort;
}

export function getCatalogPriceBounds(products: Producto[]) {
  if (products.length === 0) return { min: 0, max: 0 };

  const prices = products.map((product) => product.precio);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function filterAndSortProducts(products: Producto[], filters: CatalogFilters) {
  const filtered = products.filter((product) => {
    if (filters.categoryId !== "all" && product.categoriaId !== filters.categoryId) return false;
    if (product.precio < filters.minPrice || product.precio > filters.maxPrice) return false;
    if (filters.inStockOnly && product.stock <= 0) return false;
    if (filters.featuredOnly && !product.destacado) return false;
    return true;
  });

  if (filters.sort === "price-asc") return [...filtered].sort((a, b) => a.precio - b.precio);
  if (filters.sort === "price-desc") return [...filtered].sort((a, b) => b.precio - a.precio);
  return filtered;
}
