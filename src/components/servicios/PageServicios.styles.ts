import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

export const servCard: CSSProperties = { background: colors.white, border: `1px solid ${colors.slate200}`, borderRadius: radii.card, padding: "22px" };
export const servIcon: CSSProperties = { fontSize: 36, marginBottom: 12 };
export const servName: CSSProperties = { fontSize: 16, fontWeight: 700, color: colors.slate900, marginBottom: 6 };
export const servDesc: CSSProperties = { fontSize: 13, color: colors.slate500, lineHeight: 1.6, marginBottom: 10 };
export const servPrice: CSSProperties = { fontSize: 14, fontWeight: 700, color: colors.blue600 };
