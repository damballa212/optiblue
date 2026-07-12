import { ArrowRight, CheckCircle2, MapPin, MessageCircle, UserRoundCheck } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./ServiceProcess.module.css";

const steps = [
  { number: "01", label: "Consulta opciones", icon: CheckCircle2 },
  { number: "02", label: "Registra tus datos", icon: UserRoundCheck },
  { number: "03", label: "Elige una sede", icon: MapPin },
  { number: "04", label: "Continúa por WhatsApp", icon: MessageCircle },
];

export function ServiceProcess() {
  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <span>Atención visual</span>
        <h2>Elige el siguiente paso según lo que necesitas.</h2>
        <p>Consulta productos, solicita una cita o registra una cotización. Siempre sabrás qué ocurrirá antes de compartir tus datos.</p>
        <Link to="/servicios">Conocer servicios <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className={styles.steps}>
        {steps.map(({ number, label, icon: Icon }) => (
          <div key={number}>
            <Icon aria-hidden="true" />
            <strong>{number}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
