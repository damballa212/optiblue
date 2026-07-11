import type { CSSProperties } from "react";
import { colors, radii } from "../../styles/tokens";

export const nav: CSSProperties = { background: colors.navy, color: colors.white, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100, boxSizing: "border-box", width: "100%" };
export const navLogo: CSSProperties = { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "transparent", border: "none", padding: 0 };
export const navLogoCircle: CSSProperties = { width: 36, height: 36, background: colors.blue600, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 };
export const navBrand: CSSProperties = { fontSize: 20, fontWeight: 700, letterSpacing: 0, color: colors.white };
export const navBrandBlue: CSSProperties = { color: colors.blue400 };
export const navLinks: CSSProperties = { display: "flex", gap: 6, alignItems: "center" };

export function navLink(active: boolean): CSSProperties {
  return { background: active ? colors.blue600 : "transparent", color: colors.white, border: "none", borderRadius: radii.md, padding: "7px 14px", fontSize: 14, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "background 0.15s" };
}

export const menuButton: CSSProperties = { background: colors.blue600, color: colors.white, border: "none", borderRadius: radii.md, padding: "8px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer" };
export const mobileMenu: CSSProperties = { position: "absolute", top: 60, left: 0, right: 0, background: colors.navy, borderTop: `1px solid ${colors.slate800}`, padding: "10px 16px 14px", display: "grid", gap: 8, boxShadow: "0 18px 28px rgba(15, 23, 42, 0.22)" };

export function mobileNavLink(active: boolean): CSSProperties {
  return { background: active ? colors.blue600 : "rgba(255,255,255,0.06)", color: colors.white, border: "none", borderRadius: radii.md, padding: "11px 14px", fontSize: 15, cursor: "pointer", fontWeight: active ? 700 : 600, textAlign: "left" };
}
