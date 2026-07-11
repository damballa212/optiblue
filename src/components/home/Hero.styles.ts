import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

export const hero: CSSProperties = { background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.blue700} 60%, ${colors.blue600} 100%)`, color: colors.white, padding: "64px 24px 48px", textAlign: "center" };
export const heroTag: CSSProperties = { display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: radii.pill, padding: "4px 14px", fontSize: 12, marginBottom: 16, fontWeight: 500 };
export const heroH1: CSSProperties = { fontSize: 36, fontWeight: 800, marginBottom: 14, lineHeight: 1.2 };
export const heroSub: CSSProperties = { fontSize: 16, opacity: 0.85, marginBottom: 28, maxWidth: 520, margin: "0 auto 28px" };
export const heroBtns: CSSProperties = { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" };
export const btnHeroP: CSSProperties = { background: colors.white, color: colors.blue700, border: "none", borderRadius: radii.xl, padding: "12px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer" };
export const btnHeroS: CSSProperties = { background: "transparent", color: colors.white, border: "2px solid rgba(255,255,255,0.5)", borderRadius: radii.xl, padding: "12px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer" };
export const highlights: CSSProperties = { display: "flex", justifyContent: "center", gap: 10, marginTop: 40, flexWrap: "wrap" };
export const highlightItem: CSSProperties = { textAlign: "center", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: radii.pill, padding: "7px 14px", fontSize: 13, fontWeight: 700 };
