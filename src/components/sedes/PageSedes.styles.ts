import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

export const sedeCard: CSSProperties = { background: colors.white, border: `1px solid ${colors.slate200}`, borderRadius: radii.card, padding: "22px", display: "flex", flexDirection: "column", gap: 10 };
export const sedeCity: CSSProperties = { fontSize: 18, fontWeight: 800, color: colors.slate900 };
export const sedeRow: CSSProperties = { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: colors.slate600 };
export const sedeIcon: CSSProperties = { fontSize: 16, flexShrink: 0, marginTop: 1 };
export const sedeIconBadge: CSSProperties = { width: 40, height: 40, background: colors.blueBgLight, borderRadius: radii.xl, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 };
export const sedeHeader: CSSProperties = { display: "flex", alignItems: "center", gap: 10 };
export const sedeActions: CSSProperties = { display: "flex", gap: 8, marginTop: 4 };
