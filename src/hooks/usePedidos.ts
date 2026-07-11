import { useCallback, useEffect, useState } from "react";
import type { Pedido } from "../types";
import { pedidosApi } from "../lib/api/pedidos";

// A diferencia de useProductos/useSedes (onSnapshot), /pedidos no es de
// lectura pública en Firestore — el admin lee vía la Function, así que acá
// no hay tiempo real: refetch() se llama a mano tras cada acción.
export function usePedidos(): { pedidos: Pedido[]; loading: boolean; error: string | null; refetch: () => void } {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    pedidosApi
      .listarPedidos()
      .then(setPedidos)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { pedidos, loading, error, refetch };
}
