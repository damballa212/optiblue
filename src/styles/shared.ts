import type { CSSProperties } from "react";
import { badgeColorMap, colors, radii, type BadgeColor } from "./tokens";

/**
 * Style primitives reused across multiple feature folders
 * (buttons, cards, section headers, forms, tables, modal, badges).
 * Anything specific to a single component lives next to that
 * component instead (its own `*.styles.ts`).
 */

export const section: CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "48px 24px" };
export const sectionTag: CSSProperties = { fontSize: 12, fontWeight: 700, color: colors.blue600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 };
export const sectionH2: CSSProperties = { fontSize: 26, fontWeight: 800, color: colors.slate900, marginBottom: 8 };
export const sectionSub: CSSProperties = { fontSize: 15, color: colors.slate500, marginBottom: 32 };

export const card: CSSProperties = { background: colors.white, borderRadius: radii.card, border: `1px solid ${colors.slate200}`, overflow: "hidden", transition: "box-shadow 0.2s" };

export function grid(cols: number): CSSProperties {
  return { display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${cols}px, 1fr))`, gap: 20 };
}

export const btnPrimary: CSSProperties = { background: colors.blue600, color: colors.white, border: "none", borderRadius: radii.lg, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 };
export const btnGhost: CSSProperties = { background: colors.blueBg, color: colors.blue600, border: `1px solid ${colors.blueBorder}`, borderRadius: radii.lg, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 8 };
export const btnWA: CSSProperties = { background: colors.whatsapp, color: colors.white, border: "none", borderRadius: radii.lg, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };

export const formGroupFull: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 };
export const label: CSSProperties = { fontSize: 13, fontWeight: 600, color: colors.gray700 };
export const input: CSSProperties = { border: `1.5px solid ${colors.slate200}`, borderRadius: radii.md, padding: "9px 12px", fontSize: 14, color: colors.slate900, outline: "none", background: colors.slate50 };
export const select: CSSProperties = { border: `1.5px solid ${colors.slate200}`, borderRadius: radii.md, padding: "9px 12px", fontSize: 14, color: colors.slate900, background: colors.slate50 };

export const overlay: CSSProperties = { position: "fixed", inset: 0, background: colors.overlay, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
export const modal: CSSProperties = { background: colors.white, borderRadius: radii.panel, padding: 28, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" };
export const modalTitle: CSSProperties = { fontSize: 18, fontWeight: 800, color: colors.slate900, marginBottom: 18 };

export const table: CSSProperties = { width: "100%", borderCollapse: "collapse", background: colors.white, borderRadius: 12, overflow: "hidden", border: `1px solid ${colors.slate200}` };
export const th: CSSProperties = { background: colors.slate100, padding: "12px 14px", fontSize: 12, fontWeight: 700, color: colors.slate600, textAlign: "left", textTransform: "uppercase", letterSpacing: 0.5 };
export const td: CSSProperties = { padding: "13px 14px", fontSize: 14, color: colors.slate700, borderTop: `1px solid ${colors.slate100}` };

export function badge(color?: BadgeColor): CSSProperties {
  const [bg, fg] = color ? badgeColorMap[color] : [colors.slate100, colors.slate600];
  return { background: bg, color: fg, borderRadius: radii.pill, padding: "3px 10px", fontSize: 12, fontWeight: 700 };
}

export const statCard: CSSProperties = { background: colors.white, borderRadius: 12, border: `1px solid ${colors.slate200}`, padding: "20px 22px" };
export const statNum: CSSProperties = { fontSize: 28, fontWeight: 800, color: colors.blue700 };
export const statLabel: CSSProperties = { fontSize: 13, color: colors.slate500, marginTop: 2 };
export const statGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28 };
