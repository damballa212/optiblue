import { useState, useEffect } from "react";
import { useSedes } from "../../hooks/useSedes";
import { citasApi } from "../../lib/api/citas";
import { overlay, modal, modalTitle, formGroupFull, label, input, select, btnWA, btnGhost } from "../../styles/shared";

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
  onAgendada: (info: CitaAgendada) => void;
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
    try {
      await citasApi.crearCita({ nombre: nombre.trim(), telefono: telefono.trim(), sedeId: sedeObj.id, fecha, hora, motivo });
      onAgendada({ nombre: nombre.trim(), telefono: telefono.trim(), sede, fecha, hora });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo agendar la cita. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalTitle}>📅 Agendar cita — {motivo}</div>
        {error && <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <div style={formGroupFull}>
          <label style={label}>Tu nombre</label>
          <input style={input} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" />
        </div>
        <div style={formGroupFull}>
          <label style={label}>Tu teléfono</label>
          <input style={input} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+58 412-000-0000" />
        </div>
        <div style={formGroupFull}>
          <label style={label}>Fecha</label>
          <input style={input} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div style={formGroupFull}>
          <label style={label}>Hora</label>
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
          {enviando ? "Agendando…" : "💬 Confirmar por WhatsApp"}
        </button>
        <button style={{ ...btnGhost, marginTop: 10 }} onClick={onClose} disabled={enviando}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
