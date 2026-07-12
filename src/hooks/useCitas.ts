import { useCallback, useEffect, useRef, useState } from "react";
import type { Cita } from "../types";
import { citasApi } from "../lib/api/citas";

// /citas no es de lectura pública en Firestore — el admin lee vía la
// Function, sin tiempo real (mismo patrón que usePedidos).
export function useCitas(): {
  citas: Cita[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [citas, setCitas] = useState<Cita[]>([]);
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
      const result = await citasApi.listarCitas();
      if (mountedRef.current && requestRef.current === requestId)
        setCitas(result);
    } catch (e: unknown) {
      if (mountedRef.current && requestRef.current === requestId)
        setError(
          e instanceof Error ? e.message : "No se pudieron cargar las citas",
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

  return { citas, loading, error, refetch };
}
