import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useCitas } from "../../../hooks/useCitas";
import { useCotizaciones } from "../../../hooks/useCotizaciones";
import { usePedidos } from "../../../hooks/usePedidos";
import { useProductos } from "../../../hooks/useProductos";
import { useSedes } from "../../../hooks/useSedes";
import type { Cita, Cotizacion, Pedido, Producto, Sede } from "../../../types";

interface AdminOperationsValue {
  pedidos: Pedido[];
  citas: Cita[];
  cotizaciones: Cotizacion[];
  productos: Producto[];
  sedes: Sede[];
  loading: {
    pedidos: boolean;
    citas: boolean;
    cotizaciones: boolean;
    productos: boolean;
    sedes: boolean;
  };
  errors: {
    pedidos: string | null;
    citas: string | null;
    cotizaciones: string | null;
    productos: string | null;
    sedes: string | null;
  };
  productNames: Map<string, string>;
  locationNames: Map<string, string>;
  refreshPedidos: () => Promise<void>;
  refreshCitas: () => Promise<void>;
  refreshCotizaciones: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AdminOperationsContext = createContext<AdminOperationsValue | null>(null);

export function AdminOperationsProvider({ children }: { children: ReactNode }) {
  const pedidosState = usePedidos();
  const citasState = useCitas();
  const cotizacionesState = useCotizaciones();
  const productosState = useProductos();
  const sedesState = useSedes();

  useEffect(() => {
    const refreshVisibleData = () => {
      if (document.visibilityState !== "visible") return;
      void Promise.all([
        pedidosState.refetch(),
        citasState.refetch(),
        cotizacionesState.refetch(),
      ]);
    };
    document.addEventListener("visibilitychange", refreshVisibleData);
    return () => document.removeEventListener("visibilitychange", refreshVisibleData);
  }, [pedidosState.refetch, citasState.refetch, cotizacionesState.refetch]);

  const value = useMemo<AdminOperationsValue>(
    () => ({
      pedidos: pedidosState.pedidos,
      citas: citasState.citas,
      cotizaciones: cotizacionesState.cotizaciones,
      productos: productosState.productos,
      sedes: sedesState.sedes,
      loading: {
        pedidos: pedidosState.loading,
        citas: citasState.loading,
        cotizaciones: cotizacionesState.loading,
        productos: productosState.loading,
        sedes: sedesState.loading,
      },
      errors: {
        pedidos: pedidosState.error,
        citas: citasState.error,
        cotizaciones: cotizacionesState.error,
        productos: productosState.error,
        sedes: sedesState.error,
      },
      productNames: new Map(
        productosState.productos.map((item) => [item.id, item.nombre]),
      ),
      locationNames: new Map(
        sedesState.sedes.map((item) => [item.id, item.ciudad]),
      ),
      refreshPedidos: pedidosState.refetch,
      refreshCitas: citasState.refetch,
      refreshCotizaciones: cotizacionesState.refetch,
      refreshAll: async () => {
        await Promise.all([
          pedidosState.refetch(),
          citasState.refetch(),
          cotizacionesState.refetch(),
        ]);
      },
    }),
    [
      pedidosState.pedidos,
      pedidosState.loading,
      pedidosState.error,
      pedidosState.refetch,
      citasState.citas,
      citasState.loading,
      citasState.error,
      citasState.refetch,
      cotizacionesState.cotizaciones,
      cotizacionesState.loading,
      cotizacionesState.error,
      cotizacionesState.refetch,
      productosState.productos,
      productosState.loading,
      productosState.error,
      sedesState.sedes,
      sedesState.loading,
      sedesState.error,
    ],
  );

  return (
    <AdminOperationsContext.Provider value={value}>
      {children}
    </AdminOperationsContext.Provider>
  );
}

export function useAdminOperations(): AdminOperationsValue {
  const value = useContext(AdminOperationsContext);
  if (!value)
    throw new Error(
      "useAdminOperations debe usarse dentro de AdminOperationsProvider",
    );
  return value;
}
