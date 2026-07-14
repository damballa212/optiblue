import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ArrowUpRight, FileText, Glasses } from "lucide-react";
import { Link } from "react-router-dom";
import {
  HERO_SCENE_TARGETS,
  HeroStepperController,
  type HeroDirection,
  type HeroScene,
} from "./heroStepper";
import styles from "./Hero.module.css";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const phase = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));
const SCENE_LABELS = ["01", "02", "03", "04"] as const;

gsap.registerPlugin(Observer);

function applyVisualProgress(stage: HTMLElement, progress: number) {
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
}

function isHeroActive(story: HTMLElement) {
  const rect = story.getBoundingClientRect();
  const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  const referenceHeight = Math.min(rect.height, window.innerHeight);
  return referenceHeight > 0 && visibleHeight / referenceHeight >= 0.8;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, input, select, textarea, [contenteditable='true']"));
}

export function Hero() {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<(typeof SCENE_LABELS)[number]>("01");

  useEffect(() => {
    const story = storyRef.current;
    const stage = stageRef.current;
    if (!story || !stage) return;

    const reducedMotion = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const controller = new HeroStepperController();
    const visualState = { progress: HERO_SCENE_TARGETS[0] };
    let observer: Observer | null = null;
    let tween: gsap.core.Tween | null = null;

    const finishBoundary = (boundary: "before" | "after") => {
      controller.completeTransition();

      if (boundary === "after") {
        story.nextElementSibling?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const animateToScene = (nextScene: HeroScene) => {
      setScene(SCENE_LABELS[nextScene]);
      story.dataset.transitioning = "true";
      tween?.kill();
      tween = gsap.to(visualState, {
        progress: HERO_SCENE_TARGETS[nextScene],
        duration: 0.82,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: () => applyVisualProgress(stage, visualState.progress),
        onComplete: () => {
          delete story.dataset.transitioning;
          controller.completeTransition();
        },
      });
    };

    const requestScene = (direction: HeroDirection, input: "gesture" | "keyboard") => {
      const result = controller.request(direction);
      if (!result) return;

      if (input === "keyboard") controller.completeGesture();
      if (result.boundary) {
        finishBoundary(result.boundary);
        return;
      }

      animateToScene(result.scene);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isHeroActive(story) || isInteractiveTarget(event.target)) return;

      let direction: HeroDirection | null = null;
      if (event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey)) direction = 1;
      if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey)) direction = -1;
      if (!direction) return;

      event.preventDefault();
      requestScene(direction, "keyboard");
    };

    const teardownInteractive = () => {
      observer?.kill();
      observer = null;
      tween?.kill();
      tween = null;
      window.removeEventListener("keydown", handleKeyDown);
      delete story.dataset.transitioning;
    };

    const setup = () => {
      teardownInteractive();
      controller.reset(0);
      visualState.progress = HERO_SCENE_TARGETS[0];
      applyVisualProgress(stage, visualState.progress);
      setScene("01");

      if (reducedMotion?.matches) return;

      observer = Observer.create({
        target: stage,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 32,
        dragMinimum: 24,
        lockAxis: true,
        preventDefault: true,
        allowClicks: true,
        onUp: () => requestScene(1, "gesture"),
        onDown: () => requestScene(-1, "gesture"),
        onStop: () => controller.completeGesture(),
        onStopDelay: 0.22,
      });
      window.addEventListener("keydown", handleKeyDown);
    };

    reducedMotion?.addEventListener("change", setup);
    setup();

    return () => {
      reducedMotion?.removeEventListener("change", setup);
      teardownInteractive();
    };
  }, []);

  return (
    <section ref={storyRef} className={styles.story} id="inicio" data-scene={scene}>
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
