import { useCallback, useEffect, useRef, useState } from "react";
import type { Cotizacion } from "../types";
import { cotizacionesApi } from "../lib/api/cotizaciones";

// /cotizaciones no es de lectura pública en Firestore — mismo patrón que
// usePedidos/useCitas: fetch vía Function, refetch manual tras acciones.
export function useCotizaciones(): {
  cotizaciones: Cotizacion[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const requestRef = useRef(0);

  const refetch = useCallback(async () => {
    if (!mountedRef.current) return;
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await cotizacionesApi.listarCotizaciones();
      if (mountedRef.current && requestRef.current === requestId)
        setCotizaciones(result);
    } catch (e: unknown) {
      if (mountedRef.current && requestRef.current === requestId)
        setError(
          e instanceof Error
            ? e.message
            : "No se pudieron cargar las cotizaciones",
        );
    } finally {
      if (mountedRef.current && requestRef.current === requestId)
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void refetch();
    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
    };
  }, [refetch]);

  return { cotizaciones, loading, error, refetch };
}
