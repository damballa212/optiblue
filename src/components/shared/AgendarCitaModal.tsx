import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSedes } from "../../hooks/useSedes";
import { citasApi } from "../../lib/api/citas";
import { ModalSurface } from "./ModalSurface";
import { OptionalGooglePrefill } from "./OptionalGooglePrefill";
import form from "./PublicForm.module.css";
import styles from "./AgendarCitaModal.module.css";

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
      setError("Completa nombre, teléfono, fecha y hora preferidas.");
      return;
    }
    const sedeObj = sedes.find((item) => item.ciudad === sede);
    if (!sedeObj) {
      setError("Elige una sede.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      await citasApi.crearCita({ nombre: nombre.trim(), telefono: telefono.trim(), sedeId: sedeObj.id, fecha, hora, motivo });
      const whatsappAbierto = onAgendada({ nombre: nombre.trim(), telefono: telefono.trim(), sede, fecha, hora });
      setConfirmacion(whatsappAbierto === false ? "Tu solicitud quedó registrada. La sede todavía no tiene WhatsApp real configurado; el equipo debe contactarte al teléfono indicado." : "Tu solicitud quedó registrada. Se abrió WhatsApp para continuar con la sede.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo registrar la solicitud. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ModalSurface title="Solicitar cita" eyebrow={motivo} onClose={onClose} footer={confirmacion ? <button className={form.primary} type="button" onClick={onClose}>Cerrar</button> : <><button className={form.secondary} type="button" onClick={onClose} disabled={enviando}>Cancelar</button><button className={form.primary} type="button" onClick={confirmar} disabled={enviando}>{enviando ? "Registrando..." : <>Registrar solicitud <ArrowRight size={16} /></>}</button></>}>
      {error && <p className={form.error} role="alert">{error}</p>}
      {confirmacion ? <div className={styles.confirmation}><CheckCircle2 aria-hidden="true" /><div><h3>Solicitud registrada</h3><p>{confirmacion}</p></div></div> : <>
        <p className={form.notice}>La fecha y hora son preferidas, no un turno confirmado. La sede coordina disponibilidad después del registro.</p>
        <div className={form.grid}>
          <div className={form.field}><label htmlFor="cita-nombre">Nombre</label><input id="cita-nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} autoComplete="name" placeholder="Escribe tu nombre" /></div>
          <div className={form.field}><label htmlFor="cita-telefono">Teléfono</label><input id="cita-telefono" value={telefono} onChange={(event) => setTelefono(event.target.value)} autoComplete="tel" inputMode="tel" placeholder="Número de contacto" /></div>
          <div className={form.field}><label htmlFor="cita-fecha">Fecha preferida</label><input id="cita-fecha" type="date" value={fecha} onChange={(event) => setFecha(event.target.value)} /></div>
          <div className={form.field}><label htmlFor="cita-hora">Hora preferida</label><input id="cita-hora" type="time" value={hora} onChange={(event) => setHora(event.target.value)} /></div>
          <div className={`${form.field} ${form.full}`}><label htmlFor="cita-sede">Sede</label><select id="cita-sede" value={sede} onChange={(event) => setSede(event.target.value)}><option value="">Selecciona una sede</option>{sedes.map((item) => <option key={item.id} value={item.ciudad}>{item.ciudad}</option>)}</select></div>
        </div>
        <OptionalGooglePrefill onName={setNombre} />
      </>}
    </ModalSurface>
  );
}
