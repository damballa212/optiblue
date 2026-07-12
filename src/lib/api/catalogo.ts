import type { Producto, Categoria } from "../../types";
import { apiRequest } from "./http";

const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiCatalogo";

export type ProductoInput = Omit<Producto, "id">;
export type CategoriaInput = Omit<Categoria, "id">;

export const catalogoApi = {
  crearProducto: (input: ProductoInput) => apiRequest<Producto>(BASE_URL, "/productos", { method: "POST", body: JSON.stringify(input) }, true),
  actualizarProducto: (id: string, input: ProductoInput) => apiRequest<Producto>(BASE_URL, `/productos/${id}`, { method: "PUT", body: JSON.stringify(input) }, true),
  eliminarProducto: (id: string) => apiRequest<null>(BASE_URL, `/productos/${id}`, { method: "DELETE" }, true),

  crearCategoria: (input: CategoriaInput) => apiRequest<Categoria>(BASE_URL, "/categorias", { method: "POST", body: JSON.stringify(input) }, true),
  actualizarCategoria: (id: string, input: CategoriaInput) => apiRequest<Categoria>(BASE_URL, `/categorias/${id}`, { method: "PUT", body: JSON.stringify(input) }, true),
  eliminarCategoria: (id: string) => apiRequest<null>(BASE_URL, `/categorias/${id}`, { method: "DELETE" }, true),
};
