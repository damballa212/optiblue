import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnline } from "../../hooks/useOnline";
import { useSedes } from "../../hooks/useSedes";
import { pedidosApi } from "../../lib/api/pedidos";
import { buildWAMessage, getSedeWhatsapp, openWA } from "../../lib/whatsapp";
import type { Producto } from "../../types";
import { ModalSurface } from "../shared/ModalSurface";
import { OptionalGooglePrefill } from "../shared/OptionalGooglePrefill";
import form from "../shared/PublicForm.module.css";
import { ProductImage } from "./ProductImage";
import styles from "./ReservaModal.module.css";

interface ReservaModalProps {
  producto: Producto;
  onClose: () => void;
}

export function ReservaModal({ producto, onClose }: ReservaModalProps) {
  const { sedes } = useSedes();
  const online = useOnline();
  const [sede, setSede] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  useEffect(() => {
    if (!sede && sedes.length > 0) setSede(sedes[0].ciudad);
  }, [sede, sedes]);

  async function confirmar() {
    if (!online) {
      setError("Necesitas conexión a internet para registrar tu solicitud.");
      return;
    }
    if (!nombre.trim() || !telefono.trim()) {
      setError("Completa tu nombre y teléfono para continuar.");
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
      await pedidosApi.crearPedido({ nombre: nombre.trim(), telefono: telefono.trim(), sedeId: sedeObj.id, productoId: producto.id, precio: producto.precio, fecha: new Date().toISOString().slice(0, 10) });
      const msg = buildWAMessage({ tipo: "reserva", nombre: producto.nombre, precio: producto.precio, sede });
      const whatsappAbierto = openWA(msg, getSedeWhatsapp(sedes, sede));
      setConfirmacion(whatsappAbierto ? "Tu solicitud quedó registrada. Se abrió WhatsApp para continuar con la sede." : "Tu solicitud quedó registrada. La sede todavía no tiene WhatsApp real configurado; el equipo debe contactarte al teléfono indicado.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo registrar tu solicitud. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ModalSurface title="Apartar en sede" eyebrow={producto.nombre} onClose={onClose} footer={confirmacion ? <button className={form.primary} type="button" onClick={onClose}>Cerrar</button> : <><button className={form.secondary} type="button" onClick={onClose} disabled={enviando}>Cancelar</button><button className={form.primary} type="button" onClick={confirmar} disabled={enviando || !online}>{enviando ? "Registrando..." : <>Registrar solicitud <ArrowRight size={16} /></>}</button></>}>
      <div className={styles.product}>
        <div className={styles.media}><ProductImage src={producto.imagenUrl} alt={producto.nombre} width={600} height={360} /></div>
        <div><span>Producto</span><h3>{producto.nombre}</h3><strong>${producto.precio}</strong></div>
      </div>
      {!online && !confirmacion && <p className={form.error} role="alert">Sin conexión: necesitas internet para registrar tu solicitud.</p>}
      {error && <p className={form.error} role="alert">{error}</p>}
      {confirmacion ? <div className={styles.confirmation}><CheckCircle2 aria-hidden="true" /><div><h3>Solicitud registrada</h3><p>{confirmacion}</p></div></div> : <>
        <p className={form.notice}>Pedimos estos datos para registrar tu solicitud antes de continuar por WhatsApp.</p>
        <div className={form.grid}>
          <div className={form.field}><label htmlFor="reserva-nombre">Nombre</label><input id="reserva-nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} autoComplete="name" placeholder="Escribe tu nombre" /></div>
          <div className={form.field}><label htmlFor="reserva-telefono">Teléfono</label><input id="reserva-telefono" value={telefono} onChange={(event) => setTelefono(event.target.value)} autoComplete="tel" inputMode="tel" placeholder="Número de contacto" /></div>
          <div className={`${form.field} ${form.full}`}><label htmlFor="reserva-sede">Sede</label><select id="reserva-sede" value={sede} onChange={(event) => setSede(event.target.value)}><option value="">Selecciona una sede</option>{sedes.map((item) => <option key={item.id} value={item.ciudad}>{item.ciudad}</option>)}</select></div>
        </div>
        <OptionalGooglePrefill onName={setNombre} />
        <div className={styles.sedeNote}><MapPin size={16} aria-hidden="true" /> El stock mostrado es general; la sede coordina el apartado contigo.</div>
      </>}
    </ModalSurface>
  );
}
