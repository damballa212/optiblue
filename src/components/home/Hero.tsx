import { ArrowRight, FileText, Glasses } from "lucide-react";
import { Link } from "react-router-dom";
import { OpticalArtwork } from "../brand/OpticalArtwork";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Óptica + oftalmología en Venezuela</span>
          <h1>Monturas, lentes adaptados y atención visual.</h1>
          <p>Explora opciones disponibles, cotiza con tu fórmula o solicita atención en Barinas, Acarigua o Barquisimeto.</p>
          <div className={styles.actions}>
            <Link className={styles.primary} to="/catalogo">
              <Glasses size={18} aria-hidden="true" /> Ver catálogo <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className={styles.secondary} to="/lentes">
              <FileText size={18} aria-hidden="true" /> Cotizar mis lentes
            </Link>
          </div>
        </div>
        <div className={styles.art}>
          <OpticalArtwork />
        </div>
      </div>
    </section>
  );
}
