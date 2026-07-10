export type EstadoCotizacion = "pendiente" | "contactado" | "cerrada";

export interface Cotizacion {
  id: number;
  nombre: string;
  telefono: string;
  sede: string;
  montura: string;
  od: string;
  oi: string;
  astigmatismoOD: string;
  astigmatismoOI: string;
  extras: string[];
  total: number;
  estado: EstadoCotizacion;
  fecha: string;
}
