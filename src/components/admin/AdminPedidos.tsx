import type { EstadoPedido } from "../../types";
import { usePedidos } from "../../hooks/usePedidos";
import { useProductos } from "../../hooks/useProductos";
import { useSedes } from "../../hooks/useSedes";
import { pedidosApi } from "../../lib/api/pedidos";
import { table, th, td, badge } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import type { BadgeColor } from "../../styles/tokens";

const ESTADOS: EstadoPedido[] = ["pendiente", "pagado", "no_pagado"];

const ESTADO_BADGE: Record<EstadoPedido, BadgeColor> = {
  pendiente: "amarillo",
  pagado: "verde",
  no_pagado: "rojo",
};

export function AdminPedidos() {
  const { pedidos, loading, error, refetch } = usePedidos();
  const { productos } = useProductos();
  const { sedes } = useSedes();

  const productoNombre = (id: string) => productos.find((p) => p.id === id)?.nombre ?? "—";
  const sedeCiudad = (id: string) => sedes.find((s) => s.id === id)?.ciudad ?? "—";

  async function cambiarEstado(id: string, estado: EstadoPedido) {
    await pedidosApi.actualizarEstadoPedido(id, estado);
    refetch();
  }

  if (loading) return <p style={{ color: colors.slate400 }}>Cargando pedidos…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Cliente</th>
          <th style={th}>Producto</th>
          <th style={th}>Sede</th>
          <th style={th}>Precio</th>
          <th style={th}>Fecha</th>
          <th style={th}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map((p) => (
          <tr key={p.id}>
            <td style={td}>
              <div style={{ fontWeight: 600 }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: colors.slate500 }}>{p.telefono}</div>
            </td>
            <td style={td}>{productoNombre(p.productoId)}</td>
            <td style={td}>{sedeCiudad(p.sedeId)}</td>
            <td style={td}>
              <b>${p.precio}</b>
            </td>
            <td style={td}>{p.fecha}</td>
            <td style={td}>
              <select
                value={p.estado}
                onChange={(e) => cambiarEstado(p.id, e.target.value as EstadoPedido)}
                style={{ border: `1px solid ${colors.slate200}`, borderRadius: 6, padding: "4px 8px", fontSize: 13 }}
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <span style={{ marginLeft: 8, ...badge(ESTADO_BADGE[p.estado]) }}>{p.estado}</span>
            </td>
          </tr>
        ))}
        {pedidos.length === 0 && (
          <tr>
            <td colSpan={6} style={{ ...td, textAlign: "center", color: colors.slate400 }}>
              No hay pedidos registrados.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
