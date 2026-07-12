import type { Cotizacion, EstadoCotizacion, ConfiguracionCotizacion } from "../../types";
import { apiRequest } from "./http";

const BASE_URL = import.meta.env.VITE_COTIZACIONES_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiCotizaciones";

// El backend calcula "total" a partir del producto real y la configuración
// vigente — el cliente nunca lo envía (ver Fase 2 del plan de integridad de
// precios 2026-07-12).
export type CotizacionInput = Omit<Cotizacion, "id" | "estado" | "total">;

export const cotizacionesApi = {
  crearCotizacion: (input: CotizacionInput) => apiRequest<Cotizacion>(BASE_URL, "/cotizaciones", { method: "POST", body: JSON.stringify(input) }),
  // Back office: requiere sesión admin.
  listarCotizaciones: () => apiRequest<Cotizacion[]>(BASE_URL, "/cotizaciones", undefined, true),
  actualizarEstadoCotizacion: (id: string, estado: EstadoCotizacion) => apiRequest<Cotizacion>(BASE_URL, `/cotizaciones/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }, true),
  // Precio base del lente y extras — lectura pública, escritura solo admin.
  obtenerConfiguracion: () => apiRequest<ConfiguracionCotizacion>(BASE_URL, "/configuracion"),
  actualizarConfiguracion: (input: ConfiguracionCotizacion) => apiRequest<ConfiguracionCotizacion>(BASE_URL, "/configuracion", { method: "PUT", body: JSON.stringify(input) }, true),
};
