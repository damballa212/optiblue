import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

export const stepsWrap: CSSProperties = { display: "flex", gap: 0, marginBottom: 28, background: colors.slate100, borderRadius: radii.md, overflow: "hidden" };

export function stepBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    padding: "10px 6px",
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    background: active ? colors.blue600 : "transparent",
    color: active ? colors.white : colors.slate500,
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

export const adaptBox: CSSProperties = { background: colors.white, border: `1px solid ${colors.slate200}`, borderRadius: radii.card, padding: "24px", marginBottom: 16 };
export const adaptTitle: CSSProperties = { fontSize: 17, fontWeight: 700, color: colors.slate900, marginBottom: 4 };
export const adaptSub: CSSProperties = { fontSize: 14, color: colors.slate500, marginBottom: 20 };
export const formRow: CSSProperties = { display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" };
export const formGroup: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 120 };

export function extraCard(selected: boolean): CSSProperties {
  return {
    border: `1.5px solid ${selected ? colors.blue600 : colors.slate200}`,
    background: selected ? colors.blueBgLight : colors.white,
    borderRadius: radii.xl,
    padding: "12px",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

export const extraName: CSSProperties = { fontSize: 13, fontWeight: 700, color: colors.slate900 };
export const extraDesc: CSSProperties = { fontSize: 12, color: colors.slate500 };
export const extraPrice: CSSProperties = { fontSize: 13, fontWeight: 700, color: colors.blue600, marginTop: 4 };
export const extraHeader: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };

export const cotizTotal: CSSProperties = { background: colors.blueBgLight, borderRadius: radii.md, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 };
export const cotizNum: CSSProperties = { fontSize: 24, fontWeight: 800, color: colors.blue700 };
export const cotizBreakdown: CSSProperties = { fontSize: 12, color: colors.slate500 };
export const cotizLabel: CSSProperties = { fontSize: 13, fontWeight: 600, color: colors.slate900 };

export const resumenBox: CSSProperties = { background: colors.slate50, border: `1px solid ${colors.slate200}`, borderRadius: radii.md, padding: 16, marginBottom: 16, fontSize: 14, color: colors.slate700 };
export const resumenGrid: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" };

export const actionsRow: CSSProperties = { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 };
export const actionsRowTop: CSSProperties = { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 };
