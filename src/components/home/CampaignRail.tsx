import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useHorizontalRail } from "./useHorizontalRail";
import styles from "./CampaignRail.module.css";

const CAMPAIGN_COUNT = 4;

export function CampaignRail() {
  const { railRef, canPrevious, canNext, progress, scroll, update } = useHorizontalRail(CAMPAIGN_COUNT);

  return (
    <section className={styles.section} aria-labelledby="campaign-title">
      <header className={styles.heading}>
        <div><p>Ahora en OptiBlue</p><h2 id="campaign-title">El siguiente paso, a tu manera.</h2></div>
        <div className={styles.controls} aria-label="Controles de opciones">
          <button type="button" onClick={() => scroll(-1)} disabled={!canPrevious} aria-label="Opción anterior"><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => scroll(1)} disabled={!canNext} aria-label="Opción siguiente"><ArrowRight aria-hidden="true" /></button>
        </div>
      </header>

      <div ref={railRef} className={styles.rail} onScroll={update}>
        <article className={`${styles.campaign} ${styles.formula}`} data-rail-item>
          <div className={`${styles.art} ${styles.formulaArt}`} aria-hidden="true">
            <span className={`${styles.formulaRing} ${styles.formulaRingA}`} />
            <span className={`${styles.formulaRing} ${styles.formulaRingB}`} />
            <span className={styles.formulaAxis} />
            <b>OD</b><b>OI</b>
          </div>
          <div className={styles.copy}>
            <span>01 / Lentes adaptados</span>
            <h3>Cotiza con tu fórmula.</h3>
            <p>Registra OD, OI y los extras disponibles antes de elegir una sede.</p>
            <Link to="/lentes">Empezar cotización <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </article>

        <article className={`${styles.campaign} ${styles.locations}`} data-rail-item>
          <div className={styles.locationStack} aria-hidden="true"><span>BARINAS</span><span>ACARIGUA</span><span>BARQUISIMETO</span></div>
          <div className={styles.copy}>
            <span>02 / Sedes</span>
            <h3>Atención en tres ciudades.</h3>
            <p>Consulta los datos disponibles de cada sede antes de trasladarte.</p>
            <Link to="/sedes">Ver sedes <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </article>

        <article className={`${styles.campaign} ${styles.appointment}`} data-rail-item>
          <div className={`${styles.art} ${styles.appointmentArt}`} aria-hidden="true">
            <span className={styles.appointmentOrbit} />
            <span className={styles.appointmentDot} />
            <strong>03</strong>
          </div>
          <div className={styles.copy}>
            <span>03 / Atención visual</span>
            <h3>Solicita una cita.</h3>
            <p>Indica una fecha y hora preferidas. La sede confirma contigo por WhatsApp.</p>
            <Link to="/servicios">Solicitar cita <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </article>

        <article className={`${styles.campaign} ${styles.availability}`} data-rail-item>
          <div className={styles.availabilityArt} aria-hidden="true"><span>STOCK</span><strong>GENERAL</strong><i /></div>
          <div className={styles.copy}>
            <span>04 / Catálogo</span>
            <h3>Consulta disponibilidad.</h3>
            <p>El stock publicado es general. La sede coordina contigo antes de trasladarte.</p>
            <Link to="/catalogo">Abrir catálogo <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </article>
      </div>

      <div className={styles.progress} aria-hidden="true"><span style={{ transform: `scaleX(${0.34 + progress * 0.66})` }} /></div>
    </section>
  );
}
