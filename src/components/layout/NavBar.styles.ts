import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

export const nav: CSSProperties = { background: colors.navy, color: colors.white, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 };
export const navLogo: CSSProperties = { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" };
export const navLogoCircle: CSSProperties = { width: 36, height: 36, background: colors.blue600, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 };
export const navBrand: CSSProperties = { fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: colors.white };
export const navBrandBlue: CSSProperties = { color: colors.blue400 };
export const navLinks: CSSProperties = { display: "flex", gap: 6, alignItems: "center" };

export function navLink(active: boolean): CSSProperties {
  return { background: active ? colors.blue600 : "transparent", color: colors.white, border: "none", borderRadius: radii.md, padding: "7px 14px", fontSize: 14, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "background 0.15s" };
}

export const adminBtn: CSSProperties = { background: colors.blue700, color: colors.white, border: "none", borderRadius: radii.md, padding: "7px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };
