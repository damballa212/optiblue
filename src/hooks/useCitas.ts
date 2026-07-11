import { useCallback, useEffect, useState } from "react";
import type { Cita } from "../types";
import { citasApi } from "../lib/api/citas";

// /citas no es de lectura pública en Firestore — el admin lee vía la
// Function, sin tiempo real (mismo patrón que usePedidos).
export function useCitas(): { citas: Cita[]; loading: boolean; error: string | null; refetch: () => void } {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    citasApi
      .listarCitas()
      .then(setCitas)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudieron cargar las citas"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { citas, loading, error, refetch };
}
