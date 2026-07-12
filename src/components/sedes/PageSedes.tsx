import { Clock3, Map, MapPin, MessageCircle, Phone } from "lucide-react";
import { useSedes } from "../../hooks/useSedes";
import { normalizeWhatsappNumber, openWA } from "../../lib/whatsapp";
import { DataState } from "../shared/DataState";
import { hasConfiguredValue, isSpecificMapUrl } from "./locationAvailability";
import styles from "./PageSedes.module.css";

export function PageSedes() {
  const { sedes, loading, error } = useSedes();

  return (
    <main className={styles.page}>
      <header className={styles.hero}><span>Sedes OptiBlue</span><h1>Atención local en tres ciudades.</h1><p>Consulta dirección, horario y canales disponibles para Barinas, Acarigua y Barquisimeto.</p></header>
      <section className={styles.section}>
        {loading && <DataState kind="loading" title="Cargando sedes" message="Consultando direcciones, horarios y contactos." />}
        {!loading && error && <DataState kind="error" title="No pudimos cargar las sedes" message="Revisa la conexión o vuelve a intentarlo en unos minutos." />}
        {!loading && !error && sedes.length === 0 && <DataState kind="empty" title="Sedes pendientes" message="Todavía no hay sedes publicadas en el sistema." />}
        {!loading && !error && sedes.length > 0 && <div className={styles.grid}>{sedes.map((sede) => {
          const whatsappAvailable = Boolean(normalizeWhatsappNumber(sede.whatsapp));
          const mapAvailable = isSpecificMapUrl(sede.maps);
          return <article key={sede.id}><div className={styles.top}><span>Sede</span><MapPin aria-hidden="true" /></div><h2>{sede.ciudad}</h2><dl><div><dt><MapPin size={16} /> Dirección</dt><dd>{hasConfiguredValue(sede.direccion) ? sede.direccion : "Por confirmar"}</dd></div><div><dt><Phone size={16} /> Teléfono</dt><dd>{hasConfiguredValue(sede.telefono) ? sede.telefono : "Por confirmar"}</dd></div><div><dt><Clock3 size={16} /> Horario</dt><dd>{hasConfiguredValue(sede.horario) ? sede.horario : "Por confirmar"}</dd></div></dl><div className={styles.actions}><button type="button" disabled={!whatsappAvailable} onClick={() => openWA(encodeURIComponent(`Hola OptiBlue! Quisiera información de la sede ${sede.ciudad}.`), sede.whatsapp)}><MessageCircle size={17} /> {whatsappAvailable ? "Escribir por WhatsApp" : "WhatsApp por confirmar"}</button><button type="button" disabled={!mapAvailable} onClick={() => window.open(sede.maps, "_blank", "noopener,noreferrer")}><Map size={17} /> {mapAvailable ? "Ver mapa" : "Mapa por confirmar"}</button></div></article>;
        })}</div>}
      </section>
    </main>
  );
}
