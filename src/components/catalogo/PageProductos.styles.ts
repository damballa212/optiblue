import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

export const filterRow: CSSProperties = { display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" };

export function filterBtn(active: boolean): CSSProperties {
  return {
    background: active ? colors.blue600 : colors.white,
    color: active ? colors.white : colors.slate600,
    border: `1px solid ${active ? colors.blue600 : colors.slate200}`,
    borderRadius: radii.pill,
    padding: "7px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  };
}
