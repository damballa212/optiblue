import type { EstadoCita } from "../../types";
import { useCitas } from "../../hooks/useCitas";
import { useSedes } from "../../hooks/useSedes";
import { citasApi } from "../../lib/api/citas";
import { openWA, getSedeWhatsapp } from "../../lib/whatsapp";
import { table, th, td } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import * as Admin from "./Admin.styles";

const ESTADOS: EstadoCita[] = ["pendiente", "confirmada", "completada", "cancelada"];

export function AdminCitas() {
  const { citas, loading, error, refetch } = useCitas();
  const { sedes } = useSedes();

  const sedeCiudad = (id: string) => sedes.find((s) => s.id === id)?.ciudad ?? "—";

  async function cambiarEstado(id: string, estado: EstadoCita) {
    await citasApi.actualizarEstadoCita(id, estado);
    refetch();
  }

  function confirmarPorWA(nombre: string, sedeId: string, fecha: string, hora: string) {
    const ciudad = sedeCiudad(sedeId);
    openWA(encodeURIComponent(`Hola ${nombre}! Te confirmamos tu cita en OptiBlue ${ciudad} el ${fecha} a las ${hora}.`), getSedeWhatsapp(sedes, ciudad));
  }

  if (loading) return <p style={{ color: colors.slate400 }}>Cargando citas…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

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
            <td style={td}>{sedeCiudad(c.sedeId)}</td>
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
              <button onClick={() => confirmarPorWA(c.nombre, c.sedeId, c.fecha, c.hora)} style={Admin.actionBtn("confirm")}>
                💬 WA
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
