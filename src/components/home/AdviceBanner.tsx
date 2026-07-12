import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./AdviceBanner.module.css";

export function AdviceBanner() {
  return (
    <section className={styles.banner}>
      <div>
        <span>Orientación antes de elegir</span>
        <h2>¿No sabes qué opción necesitas?</h2>
        <p>Cuéntanos qué buscas, registra tus datos y continúa con una sede por WhatsApp cuando esté disponible.</p>
      </div>
      <Link to="/lentes"><MessageCircle size={18} aria-hidden="true" /> Solicitar asesoría <ArrowRight size={17} aria-hidden="true" /></Link>
    </section>
  );
}
