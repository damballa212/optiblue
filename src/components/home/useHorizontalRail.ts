import { useCallback, useEffect, useRef, useState } from "react";

interface RailState {
  canPrevious: boolean;
  canNext: boolean;
  progress: number;
}

const initialState: RailState = { canPrevious: false, canNext: true, progress: 0 };

export function useHorizontalRail(itemCount: number) {
  const railRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RailState>(initialState);

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const progress = maxScroll <= 1 ? 1 : Math.min(1, Math.max(0, rail.scrollLeft / maxScroll));
    const nextState = {
      canPrevious: rail.scrollLeft > 1,
      canNext: maxScroll > 1 && rail.scrollLeft < maxScroll - 1,
      progress,
    };
    setState((current) => current.canPrevious === nextState.canPrevious
      && current.canNext === nextState.canNext
      && Math.abs(current.progress - nextState.progress) < 0.001
      ? current
      : nextState);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const frame = window.requestAnimationFrame(update);
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
    observer?.observe(rail);
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [itemCount, update]);

  const scroll = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const firstItem = rail.querySelector<HTMLElement>("[data-rail-item]");
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap || window.getComputedStyle(rail).gap) || 0;
    const amount = firstItem ? firstItem.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
    const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * amount, behavior: reduced ? "auto" : "smooth" });
  };

  return { railRef, ...state, update, scroll };
}
