import type { Cita, EstadoCita } from "../../types";
import { openWA } from "../../lib/whatsapp";
import { table, th, td } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import * as Admin from "./Admin.styles";

interface AdminCitasProps {
  citas: Cita[];
  setCitas: React.Dispatch<React.SetStateAction<Cita[]>>;
}

const ESTADOS: EstadoCita[] = ["pendiente", "confirmada", "completada", "cancelada"];

export function AdminCitas({ citas, setCitas }: AdminCitasProps) {
  function cambiarEstado(id: number, estado: EstadoCita) {
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
  }

  function eliminar(id: number) {
    if (window.confirm("¿Eliminar cita?")) setCitas((prev) => prev.filter((c) => c.id !== id));
  }

  function confirmarPorWA(c: Cita) {
    openWA(encodeURIComponent(`Hola ${c.nombre}! Te confirmamos tu cita en OptiBlue ${c.sede} el ${c.fecha} a las ${c.hora}.`), c.sede);
  }

  return (
    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Paciente</th>
          <th style={th}>Sede</th>
          <th style={th}>Fecha / Hora</th>
          <th style={th}>Motivo</th>
          <th style={th}>Estado</th>
          <th style={th}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {citas.map((c) => (
          <tr key={c.id}>
            <td style={td}>
              <div style={{ fontWeight: 600 }}>{c.nombre}</div>
              <div style={{ fontSize: 12, color: colors.slate500 }}>{c.telefono}</div>
            </td>
            <td style={td}>{c.sede}</td>
            <td style={td}>
              {c.fecha} · {c.hora}
            </td>
            <td style={td}>{c.motivo}</td>
            <td style={td}>
              <select value={c.estado} onChange={(e) => cambiarEstado(c.id, e.target.value as EstadoCita)} style={{ border: `1px solid ${colors.slate200}`, borderRadius: 6, padding: "4px 8px", fontSize: 13 }}>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </td>
            <td style={td}>
              <button onClick={() => confirmarPorWA(c)} style={Admin.actionBtn("confirm")}>
                💬 WA
              </button>
              <button onClick={() => eliminar(c.id)} style={Admin.actionBtn("delete")}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
        {citas.length === 0 && (
          <tr>
            <td colSpan={6} style={{ ...td, textAlign: "center", color: colors.slate400 }}>
              No hay citas registradas.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
