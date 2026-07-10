import type { CSSProperties } from "react";
import { colors } from "../../styles/tokens";

export const footer: CSSProperties = { background: colors.slate900, color: colors.slate400, padding: "40px 24px 24px" };
export const inner: CSSProperties = { maxWidth: 1100, margin: "0 auto" };
export const columns: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28, marginBottom: 28 };
export const brand: CSSProperties = { fontSize: 18, fontWeight: 800, color: colors.white, marginBottom: 8 };
export const brandDesc: CSSProperties = { fontSize: 13, lineHeight: 1.7 };
export const colTitle: CSSProperties = { fontSize: 13, fontWeight: 700, color: colors.white, marginBottom: 10 };
export const colLink: CSSProperties = { fontSize: 13, marginBottom: 6, cursor: "pointer" };
export const colText: CSSProperties = { fontSize: 13, marginBottom: 6 };
export const bottom: CSSProperties = { borderTop: `1px solid ${colors.slate800}`, paddingTop: 16, fontSize: 12, textAlign: "center" };
