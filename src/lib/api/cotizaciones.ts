import type { Cotizacion, EstadoCotizacion } from "../../types";
import { apiRequest } from "./http";

const BASE_URL = import.meta.env.VITE_COTIZACIONES_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiCotizaciones";

export type CotizacionInput = Omit<Cotizacion, "id" | "estado">;

export const cotizacionesApi = {
  crearCotizacion: (input: CotizacionInput) => apiRequest<Cotizacion>(BASE_URL, "/cotizaciones", { method: "POST", body: JSON.stringify(input) }),
  // Back office: requiere sesión admin.
  listarCotizaciones: () => apiRequest<Cotizacion[]>(BASE_URL, "/cotizaciones", undefined, true),
  actualizarEstadoCotizacion: (id: string, estado: EstadoCotizacion) => apiRequest<Cotizacion>(BASE_URL, `/cotizaciones/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }, true),
};
