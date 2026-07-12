import { useCallback, useEffect, useState } from "react";
import type { ConfiguracionCotizacion } from "../types";
import { cotizacionesApi } from "../lib/api/cotizaciones";

// A diferencia de useProductos/useSedes (onSnapshot), la configuración de
// precios no es lectura pública de Firestore — vive detrás de la Cloud
// Function (ver GET /configuracion), así que acá no hay tiempo real.
export function useConfiguracionCotizacion(): { configuracion: ConfiguracionCotizacion | null; loading: boolean; error: string | null; refetch: () => void } {
  const [configuracion, setConfiguracion] = useState<ConfiguracionCotizacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    cotizacionesApi
      .obtenerConfiguracion()
      .then(setConfiguracion)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudo cargar la configuración de precios"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { configuracion, loading, error, refetch };
}
