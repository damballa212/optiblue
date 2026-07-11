import type { Cotizacion, EstadoCotizacion } from "../../types";
import { useSedes } from "../../hooks/useSedes";
import { openWA, getSedeWhatsapp } from "../../lib/whatsapp";
import { table, th, td } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import * as Admin from "./Admin.styles";

interface AdminCotizacionesProps {
  cotizaciones: Cotizacion[];
  setCotizaciones: React.Dispatch<React.SetStateAction<Cotizacion[]>>;
}

const ESTADOS: EstadoCotizacion[] = ["pendiente", "contactado", "cerrada"];

export function AdminCotizaciones({ cotizaciones, setCotizaciones }: AdminCotizacionesProps) {
  const { sedes } = useSedes();

  function cambiarEstado(id: number, estado: EstadoCotizacion) {
    setCotizaciones((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
  }

  function contactarPorWA(c: Cotizacion) {
    openWA(encodeURIComponent(`Hola ${c.nombre}! Te contactamos de OptiBlue por tu cotización de ${c.montura} por $${c.total}.`), getSedeWhatsapp(sedes, c.sede));
  }

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
            <td style={td}>{c.montura}</td>
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
              <button onClick={() => contactarPorWA(c)} style={Admin.actionBtn("confirm")}>
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
