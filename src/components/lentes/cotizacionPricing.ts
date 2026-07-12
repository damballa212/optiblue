import type { ConfiguracionCotizacion, ExtraCotizacion } from "../../types";

// Esta es solo la vista previa que ve el cliente ANTES de enviar. El total
// real y autoritativo lo calcula el backend (ver createCotizacion en
// optiblue-backend) — si la configuración cambió entre que se cargó esta
// página y el envío, el total devuelto por el backend prevalece.
export function extrasActivos(configuracion: ConfiguracionCotizacion | null): ExtraCotizacion[] {
  return configuracion?.extras.filter((extra) => extra.activo) ?? [];
}

export function calcularTotalPreview(configuracion: ConfiguracionCotizacion | null, precioMontura: number, extrasSeleccionados: string[]): number {
  const disponibles = extrasActivos(configuracion);
  const extrasTotal = extrasSeleccionados.reduce((sum, key) => sum + (disponibles.find((extra) => extra.key === key)?.precio ?? 0), 0);
  const lenteBase = configuracion?.lenteBase ?? 0;
  return precioMontura + extrasTotal + lenteBase;
}
