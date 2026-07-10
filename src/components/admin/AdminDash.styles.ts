import type { CSSProperties } from "react";
import { colors } from "../../styles/tokens";

export const dashGrid: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 };
export const panelTitle: CSSProperties = { fontSize: 15, fontWeight: 700, marginBottom: 14 };
export const listRow: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${colors.slate100}`, fontSize: 14 };
export const rowName: CSSProperties = { fontWeight: 600 };
export const rowMeta: CSSProperties = { fontSize: 12, color: colors.slate500 };
export const rowTotal: CSSProperties = { fontWeight: 800, color: colors.blue700 };
