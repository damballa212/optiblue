import type { CSSProperties } from "react";
import { colors, radii, fontFamily } from "../styles/tokens";

export const page: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.blue700} 60%, ${colors.blue600} 100%)`,
  fontFamily,
  padding: 24,
};

export const card: CSSProperties = {
  background: colors.white,
  borderRadius: radii.panel,
  padding: "40px 36px",
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 24px 60px rgba(15,20,50,0.35)",
};

export const brand: CSSProperties = { display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" };
export const brandCircle: CSSProperties = { width: 40, height: 40, background: colors.blue600, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 };
export const brandText: CSSProperties = { fontSize: 22, fontWeight: 700, color: colors.slate900 };
export const brandBlue: CSSProperties = { color: colors.blue600 };

export const title: CSSProperties = { fontSize: 20, fontWeight: 800, color: colors.slate900, marginBottom: 6, textAlign: "center" };
export const subtitle: CSSProperties = { fontSize: 13, color: colors.slate500, marginBottom: 28, textAlign: "center" };

export const formGroup: CSSProperties = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 };
export const label: CSSProperties = { fontSize: 13, fontWeight: 600, color: colors.gray700 };
export const input: CSSProperties = { border: `1.5px solid ${colors.slate200}`, borderRadius: radii.md, padding: "11px 14px", fontSize: 14, color: colors.slate900, outline: "none", background: colors.slate50 };

export const submitBtn: CSSProperties = {
  background: colors.blue600,
  color: colors.white,
  border: "none",
  borderRadius: radii.lg,
  padding: "12px 18px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  width: "100%",
  marginTop: 4,
};

export const errorBox: CSSProperties = {
  background: colors.red100,
  color: colors.red800,
  borderRadius: radii.md,
  padding: "10px 14px",
  fontSize: 13,
  marginBottom: 18,
};

export const backLink: CSSProperties = { display: "block", textAlign: "center", marginTop: 24, fontSize: 13, color: colors.slate400, textDecoration: "none" };
