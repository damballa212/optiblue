import type { Producto, Categoria } from "../../types";

// Toda escritura al catálogo pasa por acá — nunca directo a Firestore desde
// el cliente (las Security Rules del backend lo bloquean de todas formas).
const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiCatalogo";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error ?? "Error de red al comunicarse con el servidor");
  }
  return body.data as T;
}

export type ProductoInput = Omit<Producto, "id">;
export type CategoriaInput = Omit<Categoria, "id">;

export const catalogoApi = {
  crearProducto: (input: ProductoInput) => request<Producto>("/productos", { method: "POST", body: JSON.stringify(input) }),
  actualizarProducto: (id: string, input: ProductoInput) => request<Producto>(`/productos/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  eliminarProducto: (id: string) => request<null>(`/productos/${id}`, { method: "DELETE" }),

  crearCategoria: (input: CategoriaInput) => request<Categoria>("/categorias", { method: "POST", body: JSON.stringify(input) }),
  actualizarCategoria: (id: string, input: CategoriaInput) => request<Categoria>(`/categorias/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  eliminarCategoria: (id: string) => request<null>(`/categorias/${id}`, { method: "DELETE" }),
};
