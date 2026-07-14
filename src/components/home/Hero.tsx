import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, FileText, Glasses } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const phase = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));

export function Hero() {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState("01");

  useEffect(() => {
    const story = storyRef.current;
    const stage = stageRef.current;
    if (!story || !stage) return;

    const reducedMotion = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    let requestedFrame: number | null = null;

    const update = () => {
      requestedFrame = null;
      if (reducedMotion?.matches) return;

      const rect = story.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - stage.offsetHeight);
      const progress = clamp(-rect.top / scrollable);
      const open = phase(progress, 0.05, 0.37);
      const copyOut = phase(progress, 0.16, 0.34);
      const pathsIn = phase(progress, 0.28, 0.43);
      const pathsOut = phase(progress, 0.49, 0.63);
      const split = phase(progress, 0.3, 0.58);
      const cities = phase(progress, 0.56, 0.7) * (1 - phase(progress, 0.74, 0.84));
      const exit = phase(progress, 0.8, 0.98);

      stage.style.setProperty("--p-open", open.toFixed(4));
      stage.style.setProperty("--p-copy-out", copyOut.toFixed(4));
      stage.style.setProperty("--p-paths", (pathsIn * (1 - pathsOut)).toFixed(4));
      stage.style.setProperty("--p-split", split.toFixed(4));
      stage.style.setProperty("--p-cities", cities.toFixed(4));
      stage.style.setProperty("--p-exit", exit.toFixed(4));

      const nextScene = progress < 0.28 ? "01" : progress < 0.56 ? "02" : progress < 0.8 ? "03" : "04";
      setScene((current) => current === nextScene ? current : nextScene);
    };

    const requestUpdate = () => {
      if (requestedFrame !== null) return;
      requestedFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion?.addEventListener("change", requestUpdate);
    update();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion?.removeEventListener("change", requestUpdate);
      if (requestedFrame !== null) window.cancelAnimationFrame(requestedFrame);
    };
  }, []);

  return (
    <section ref={storyRef} className={styles.story} id="inicio">
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.navyReveal} aria-hidden="true" />
        <div className={styles.electricField} aria-hidden="true" />
        <div className={styles.opticGrid} aria-hidden="true"><span /><span /><span /><span /></div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>Óptica + oftalmología en Venezuela</p>
          <h1 aria-label="Monturas, lentes adaptados y atención visual."><span>Monturas,</span><span>lentes adaptados</span><span>y atención visual.</span></h1>
          <p className={styles.lede}>Explora opciones disponibles, cotiza con tu fórmula o solicita atención en Barinas, Acarigua o Barquisimeto.</p>
        </div>

        <div className={styles.pathScene} aria-hidden="true">
          <span>01</span><p>CATÁLOGO</p>
          <span>02</span><p>FÓRMULA</p>
          <span>03</span><p>CITA</p>
        </div>

        <div className={styles.cityScene} aria-hidden="true">
          <p>BARINAS</p><p>ACARIGUA</p><p>BARQUISIMETO</p>
        </div>

        <div className={styles.portalRig} aria-hidden="true">
          <span className={`${styles.lens} ${styles.lensLeft}`}><i /></span>
          <span className={`${styles.lens} ${styles.lensRight}`}><i /></span>
          <span className={styles.lensBridge} />
          <span className={`${styles.reticle} ${styles.reticleX}`} />
          <span className={`${styles.reticle} ${styles.reticleY}`} />
        </div>

        <div className={styles.finale} aria-hidden="true"><span>AHORA EN</span><strong>OPTIBLUE</strong></div>

        <div className={styles.actions}>
          <Link className={styles.primary} to="/catalogo"><Glasses aria-hidden="true" /> Ver catálogo <ArrowUpRight aria-hidden="true" /></Link>
          <Link className={styles.secondary} to="/lentes"><FileText aria-hidden="true" /> Cotizar mis lentes</Link>
        </div>

        <div className={styles.counter} aria-hidden="true"><span>{scene}</span><i /><span>04</span></div>
      </div>
    </section>
  );
}
