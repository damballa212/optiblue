import { useCallback, useEffect, useRef, useState } from "react";
import type { Pedido } from "../types";
import { pedidosApi } from "../lib/api/pedidos";

// A diferencia de useProductos/useSedes (onSnapshot), /pedidos no es de
// lectura pública en Firestore — el admin lee vía la Function, así que acá
// no hay tiempo real: refetch() se llama a mano tras cada acción.
export function usePedidos(): {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
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
      const result = await pedidosApi.listarPedidos();
      if (mountedRef.current && requestRef.current === requestId)
        setPedidos(result);
    } catch (e: unknown) {
      if (mountedRef.current && requestRef.current === requestId)
        setError(
          e instanceof Error ? e.message : "No se pudieron cargar los pedidos",
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

  return { pedidos, loading, error, refetch };
}
