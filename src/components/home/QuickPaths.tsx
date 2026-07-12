import { CalendarCheck, FileText, Glasses } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./QuickPaths.module.css";

const paths = [
  { title: "Elegir montura", text: "Explora el catálogo disponible", to: "/catalogo", icon: Glasses },
  { title: "Cotizar con fórmula", text: "Registra OD, OI y extras", to: "/lentes", icon: FileText },
  { title: "Solicitar cita", text: "Indica fecha y hora preferidas", to: "/servicios", icon: CalendarCheck },
];

export function QuickPaths() {
  return (
    <section className={styles.paths} aria-label="Acciones principales">
      <div className={styles.inner}>
        {paths.map(({ title, text, to, icon: Icon }) => (
          <Link key={title} to={to}>
            <span className={styles.icon}><Icon aria-hidden="true" /></span>
            <span><strong>{title}</strong><small>{text}</small></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
