import type { Cotizacion, EstadoCotizacion } from "../../types";

const BASE_URL = import.meta.env.VITE_COTIZACIONES_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiCotizaciones";

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

export type CotizacionInput = Omit<Cotizacion, "id" | "estado">;

export const cotizacionesApi = {
  crearCotizacion: (input: CotizacionInput) => request<Cotizacion>("/cotizaciones", { method: "POST", body: JSON.stringify(input) }),
  // /cotizaciones no es de lectura pública en Firestore, el admin lee vía esta Function.
  listarCotizaciones: () => request<Cotizacion[]>("/cotizaciones"),
  actualizarEstadoCotizacion: (id: string, estado: EstadoCotizacion) => request<Cotizacion>(`/cotizaciones/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }),
};
