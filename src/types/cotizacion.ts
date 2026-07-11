export type EstadoCotizacion = "pendiente" | "contactado" | "cerrada";

// La fórmula óptica vive acá, nunca en el producto (ver decisión 2026-07-11).
export interface Cotizacion {
  id: string;
  nombre: string;
  telefono: string;
  sedeId: string;
  productoId: string;
  od: string;
  oi: string;
  astigmatismoOD: string;
  astigmatismoOI: string;
  extras: string[];
  total: number;
  estado: EstadoCotizacion;
  fecha: string;
}
