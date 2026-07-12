import { ArrowRight, CalendarCheck, FileText, ScanEye } from "lucide-react";
import { useState } from "react";
import { SERVICIOS } from "../../data";
import { useSedes } from "../../hooks/useSedes";
import { getSedeWhatsapp, openWA } from "../../lib/whatsapp";
import type { Servicio } from "../../types";
import { AgendarCitaModal, type CitaAgendada } from "../shared/AgendarCitaModal";
import styles from "./PageServicios.module.css";

const ICONS = [ScanEye, FileText, CalendarCheck];

export function PageServicios() {
  const { sedes } = useSedes();
  const [servicioAAgendar, setServicioAAgendar] = useState<Servicio | null>(null);

  function citaAgendada(servicio: Servicio, info: CitaAgendada) {
    const msg = encodeURIComponent(`Hola OptiBlue! Quisiera solicitar: *${servicio.nombre}*\nFecha preferida: ${info.fecha} — Hora preferida: ${info.hora}`);
    return openWA(msg, getSedeWhatsapp(sedes, info.sede));
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}><span>Servicios visuales</span><h1>Atención según lo que necesitas.</h1><p>Consulta información, registra una cotización o solicita una fecha preferida en una sede OptiBlue.</p></header>
      <section className={styles.services}>
        <div className={styles.heading}><span>Opciones disponibles</span><h2>Elige el siguiente paso.</h2></div>
        <div className={styles.grid}>
          {SERVICIOS.map((service, index) => {
            const Icon = ICONS[index] ?? ScanEye;
            return <article key={service.nombre}><span className={styles.icon}><Icon aria-hidden="true" /></span><h3>{service.nombre}</h3><p>{service.desc}</p><button type="button" onClick={() => setServicioAAgendar(service)}>Solicitar atención <ArrowRight size={17} aria-hidden="true" /></button></article>;
          })}
        </div>
        <aside className={styles.note}><CalendarCheck aria-hidden="true" /><div><h2>La solicitud no confirma un turno automático.</h2><p>Indicas fecha y hora preferidas; la sede coordina disponibilidad después de registrar tus datos.</p></div></aside>
      </section>
      {servicioAAgendar && <AgendarCitaModal motivo={servicioAAgendar.nombre} onClose={() => setServicioAAgendar(null)} onAgendada={(info) => citaAgendada(servicioAAgendar, info)} />}
    </main>
  );
}
