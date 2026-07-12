// Espejo del contrato del backend (optiblue-backend/src/types/cotizacion-config.ts).
// Precio base del lente y extras administrables — el frontend nunca decide
// estos valores, solo los muestra tal como los devuelve GET /configuracion.
export interface ExtraCotizacion {
  key: string;
  label: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  orden: number;
}

export interface ConfiguracionCotizacion {
  lenteBase: number;
  extras: ExtraCotizacion[];
}
