import { useCallback, useEffect, useState } from "react";
import type { Cotizacion } from "../types";
import { cotizacionesApi } from "../lib/api/cotizaciones";

// /cotizaciones no es de lectura pública en Firestore — mismo patrón que
// usePedidos/useCitas: fetch vía Function, refetch manual tras acciones.
export function useCotizaciones(): { cotizaciones: Cotizacion[]; loading: boolean; error: string | null; refetch: () => void } {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    cotizacionesApi
      .listarCotizaciones()
      .then(setCotizaciones)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudieron cargar las cotizaciones"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { cotizaciones, loading, error, refetch };
}
