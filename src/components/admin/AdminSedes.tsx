import { useState } from "react";
import { useSedes } from "../../hooks/useSedes";
import { sedesApi } from "../../lib/api/sedes";
import { openWA } from "../../lib/whatsapp";
import { grid, card, btnWA, btnPrimary, btnGhost, overlay, modal, modalTitle, formGroupFull, label, input } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import * as Admin from "./Admin.styles";
import * as S from "./AdminProductos.styles";

interface SedeForm {
  ciudad: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  horario: string;
  maps: string;
}

const EMPTY_FORM: SedeForm = { ciudad: "", direccion: "", telefono: "", whatsapp: "", horario: "Lun–Sáb 9am–7pm", maps: "https://maps.google.com" };

const FIELDS: [keyof SedeForm, string][] = [
  ["ciudad", "Ciudad"],
  ["direccion", "Dirección"],
  ["telefono", "Teléfono"],
  ["whatsapp", "WhatsApp (solo números, con código de país)"],
  ["horario", "Horario"],
  ["maps", "Link de Google Maps"],
];

export function AdminSedes() {
  const { sedes } = useSedes();
  const [editando, setEditando] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<SedeForm>(EMPTY_FORM);
  const [nuevo, setNuevo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function abrirEditar(s: (typeof sedes)[number]) {
    setForm({ ciudad: s.ciudad, direccion: s.direccion, telefono: s.telefono, whatsapp: s.whatsapp, horario: s.horario, maps: s.maps });
    setEditando(s.id);
    setNuevo(false);
    setError(null);
  }

  function abrirNuevo() {
    setForm(EMPTY_FORM);
    setEditando("new");
    setNuevo(true);
    setError(null);
  }

  async function guardar() {
    setGuardando(true);
    setError(null);
    try {
      if (nuevo) {
        await sedesApi.crearSede(form);
      } else if (typeof editando === "string") {
        await sedesApi.actualizarSede(editando, form);
      }
      setEditando(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la sede");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: string) {
    if (!window.confirm("¿Eliminar sede?")) return;
    try {
      await sedesApi.eliminarSede(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la sede");
    }
  }

  return (
    <>
      <div style={S.toolbar}>
        <button style={{ ...btnPrimary, width: "auto", padding: "10px 20px" }} onClick={abrirNuevo}>
          + Nueva sede
        </button>
      </div>
      {error && <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div style={grid(280)}>
        {sedes.map((s) => (
          <div key={s.id} style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>📍 {s.ciudad}</div>
            <div style={{ fontSize: 14, color: colors.slate600, marginBottom: 4 }}>{s.direccion}</div>
            <div style={{ fontSize: 14, color: colors.slate600, marginBottom: 4 }}>📞 {s.telefono}</div>
            <div style={{ fontSize: 14, color: colors.slate600, marginBottom: 12 }}>🕐 {s.horario}</div>
            <button style={{ ...btnWA, fontSize: 13, marginBottom: 8 }} onClick={() => openWA(encodeURIComponent(`Hola! Consulta desde sede ${s.ciudad}`), s.whatsapp)}>
              💬 Probar WhatsApp
            </button>
            <div>
              <button onClick={() => abrirEditar(s)} style={Admin.actionBtn("edit")}>
                Editar
              </button>
              <button onClick={() => eliminar(s.id)} style={Admin.actionBtn("delete")}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {editando !== null && (
        <div style={overlay} onClick={() => !guardando && setEditando(null)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalTitle}>{nuevo ? "Nueva sede" : "Editar sede"}</div>
            {FIELDS.map(([k, l]) => (
              <div key={k} style={formGroupFull}>
                <label style={label}>{l}</label>
                <input style={input} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <button style={btnPrimary} onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </button>
            <button style={{ ...btnGhost, marginTop: 8 }} onClick={() => setEditando(null)} disabled={guardando}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
