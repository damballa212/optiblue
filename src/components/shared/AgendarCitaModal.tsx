import { useState, useEffect } from "react";
import { useSedes } from "../../hooks/useSedes";
import { citasApi } from "../../lib/api/citas";
import { overlay, modal, modalTitle, formGroupFull, label, input, select, btnWA, btnGhost } from "../../styles/shared";
import { colors } from "../../styles/tokens";

export interface CitaAgendada {
  nombre: string;
  telefono: string;
  sede: string;
  fecha: string;
  hora: string;
}

interface AgendarCitaModalProps {
  motivo: string;
  onClose: () => void;
  // El modal solo persiste la cita — cada caller arma su propio mensaje de
  // WhatsApp con el contexto que tenga (montura, servicio, etc.).
  onAgendada: (info: CitaAgendada) => boolean | void;
}

export function AgendarCitaModal({ motivo, onClose, onAgendada }: AgendarCitaModalProps) {
  const { sedes } = useSedes();
  const [sede, setSede] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  useEffect(() => {
    if (!sede && sedes.length > 0) setSede(sedes[0].ciudad);
  }, [sede, sedes]);

  async function confirmar() {
    if (!nombre.trim() || !telefono.trim() || !fecha || !hora) {
      setError("Completa todos los campos para agendar.");
      return;
    }
    const sedeObj = sedes.find((s) => s.ciudad === sede);
    if (!sedeObj) {
      setError("Elige una sede.");
      return;
    }

    setEnviando(true);
    setError(null);
    setConfirmacion(null);
    try {
      await citasApi.crearCita({ nombre: nombre.trim(), telefono: telefono.trim(), sedeId: sedeObj.id, fecha, hora, motivo });
      const whatsappAbierto = onAgendada({ nombre: nombre.trim(), telefono: telefono.trim(), sede, fecha, hora });
      if (whatsappAbierto === false) {
        setConfirmacion("Tu solicitud de cita quedó registrada. Esta sede todavía no tiene WhatsApp real configurado; el equipo debe contactarte con el teléfono que dejaste.");
      } else {
        onClose();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo registrar la solicitud de cita. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalTitle}>📅 Solicitar cita — {motivo}</div>
        {error && <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        {confirmacion && <p style={{ color: colors.blue700, fontSize: 13, marginBottom: 12 }}>{confirmacion}</p>}
        {!confirmacion && (
          <>
          <p style={{ color: colors.slate500, fontSize: 13, marginBottom: 12 }}>La fecha y hora son preferidas, no una reserva automática. Primero registramos tu solicitud y luego la sede confirma disponibilidad.</p>
          <div style={formGroupFull}>
            <label style={label}>Tu nombre</label>
            <input style={input} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" />
          </div>
          <div style={formGroupFull}>
            <label style={label}>Tu teléfono</label>
            <input style={input} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+58 412-000-0000" />
          </div>
          <div style={formGroupFull}>
            <label style={label}>Fecha preferida</label>
            <input style={input} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div style={formGroupFull}>
            <label style={label}>Hora preferida</label>
            <input style={input} type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>
          <div style={formGroupFull}>
            <label style={label}>Sede</label>
            <select style={select} value={sede} onChange={(e) => setSede(e.target.value)}>
              {sedes.map((s) => (
                <option key={s.id} value={s.ciudad}>
                  {s.ciudad}
                </option>
              ))}
            </select>
          </div>
          <button style={btnWA} onClick={confirmar} disabled={enviando}>
            {enviando ? "Registrando…" : "Registrar solicitud"}
          </button>
          </>
        )}
        <button style={{ ...btnGhost, marginTop: 10 }} onClick={onClose} disabled={enviando}>
          {confirmacion ? "Cerrar" : "Cancelar"}
        </button>
      </div>
    </div>
  );
}
