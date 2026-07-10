import type { CSSProperties } from "react";
import { colors } from "../../styles/tokens";

export const adminSidebar: CSSProperties = { width: 220, background: colors.slate900, color: colors.white, minHeight: "100vh", padding: "20px 0", flexShrink: 0 };
export const adminMain: CSSProperties = { flex: 1, background: colors.slate50, minHeight: "100vh", overflow: "auto" };
export const adminHeader: CSSProperties = { background: colors.white, borderBottom: `1px solid ${colors.slate200}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" };
export const adminContent: CSSProperties = { padding: 28 };
export const adminLayout: CSSProperties = { display: "flex", minHeight: "100vh" };
export const sidebarBrandBlock: CSSProperties = { padding: "0 20px 20px", borderBottom: `1px solid ${colors.slate800}`, marginBottom: 8 };
export const sidebarBrand: CSSProperties = { fontSize: 16, fontWeight: 800, color: colors.white };
export const sidebarSubtitle: CSSProperties = { fontSize: 11, color: colors.slate400, marginTop: 2 };
export const sidebarExit: CSSProperties = { background: colors.slate800, color: colors.slate400, border: `1px solid ${colors.slate700}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", width: "100%" };
export const sidebarExitWrap: CSSProperties = { marginTop: "auto", padding: "20px" };
export const headerTitle: CSSProperties = { fontSize: 16, fontWeight: 700, color: colors.slate900 };
export const headerSubtitle: CSSProperties = { fontSize: 12, color: colors.slate500 };

export type ActionVariant = "edit" | "delete" | "confirm";

const ACTION_COLORS: Record<ActionVariant, [string, string]> = {
  edit: [colors.blueBgLight, colors.blue700],
  delete: [colors.red100, colors.red800],
  confirm: [colors.green100, colors.green800],
};

export function actionBtn(variant: ActionVariant): CSSProperties {
  const [bg, fg] = ACTION_COLORS[variant];
  return { background: bg, color: fg, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", marginRight: 6, fontSize: 13 };
}

export function sideItem(active: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    cursor: "pointer",
    background: active ? colors.blue700 : "transparent",
    color: active ? colors.white : colors.slate400,
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    borderLeft: active ? `3px solid ${colors.blue400}` : "3px solid transparent",
    transition: "all 0.15s",
  };
}
