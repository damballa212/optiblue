import type { EstadoCotizacion } from "../../types";
import { useCotizaciones } from "../../hooks/useCotizaciones";
import { useProductos } from "../../hooks/useProductos";
import { useSedes } from "../../hooks/useSedes";
import { cotizacionesApi } from "../../lib/api/cotizaciones";
import { openWA, getSedeWhatsapp } from "../../lib/whatsapp";
import { table, th, td } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import * as Admin from "./Admin.styles";

const ESTADOS: EstadoCotizacion[] = ["pendiente", "contactado", "cerrada"];

export function AdminCotizaciones() {
  const { cotizaciones, loading, error, refetch } = useCotizaciones();
  const { productos } = useProductos();
  const { sedes } = useSedes();

  const productoNombre = (id: string) => productos.find((p) => p.id === id)?.nombre ?? "—";
  const sedeCiudad = (id: string) => sedes.find((s) => s.id === id)?.ciudad ?? "—";

  async function cambiarEstado(id: string, estado: EstadoCotizacion) {
    await cotizacionesApi.actualizarEstadoCotizacion(id, estado);
    refetch();
  }

  function contactarPorWA(nombre: string, productoId: string, total: number, sedeId: string) {
    openWA(encodeURIComponent(`Hola ${nombre}! Te contactamos de OptiBlue por tu cotización de ${productoNombre(productoId)} por $${total}.`), getSedeWhatsapp(sedes, sedeCiudad(sedeId)));
  }

  if (loading) return <p style={{ color: colors.slate400 }}>Cargando cotizaciones…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Cliente</th>
          <th style={th}>Montura</th>
          <th style={th}>Graduación</th>
          <th style={th}>Extras</th>
          <th style={th}>Total</th>
          <th style={th}>Estado</th>
          <th style={th}>WA</th>
        </tr>
      </thead>
      <tbody>
        {cotizaciones.map((c) => (
          <tr key={c.id}>
            <td style={td}>
              <div style={{ fontWeight: 600 }}>{c.nombre}</div>
              <div style={{ fontSize: 12, color: colors.slate500 }}>{c.telefono}</div>
            </td>
            <td style={td}>{productoNombre(c.productoId)}</td>
            <td style={{ ...td, fontSize: 12 }}>
              OD {c.od || "—"} / OI {c.oi || "—"}
            </td>
            <td style={td}>{c.extras?.join(", ") || "—"}</td>
            <td style={td}>
              <b style={{ color: colors.blue700 }}>${c.total}</b>
            </td>
            <td style={td}>
              <select value={c.estado} onChange={(e) => cambiarEstado(c.id, e.target.value as EstadoCotizacion)} style={{ border: `1px solid ${colors.slate200}`, borderRadius: 6, padding: "4px 8px", fontSize: 13 }}>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </td>
            <td style={td}>
              <button onClick={() => contactarPorWA(c.nombre, c.productoId, c.total, c.sedeId)} style={Admin.actionBtn("confirm")}>
                💬
              </button>
            </td>
          </tr>
        ))}
        {cotizaciones.length === 0 && (
          <tr>
            <td colSpan={7} style={{ ...td, textAlign: "center", color: colors.slate400 }}>
              No hay cotizaciones.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
