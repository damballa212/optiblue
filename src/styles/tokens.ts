/**
 * Design tokens — single source of truth for every color/radius value
 * used across the *.styles.ts files. No component should hardcode a hex
 * value directly; it imports from here instead.
 */

export const colors = {
  navy: "#0f3460",
  blue700: "#1e40af",
  blue600: "#2563eb",
  blue400: "#60a5fa",
  blueBg: "#f0f7ff",
  blueBgLight: "#eff6ff",
  blueBorder: "#bfdbfe",

  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  gray700: "#374151",

  white: "#ffffff",

  whatsapp: "#25D366",
  green100: "#d1fae5",
  green800: "#065f46",
  amber100: "#fef3c7",
  amber800: "#92400e",
  red100: "#fee2e2",
  red800: "#991b1b",

  overlay: "rgba(15,20,50,0.5)",
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 9,
  xl: 10,
  card: 14,
  panel: 16,
  pill: 99,
} as const;

export const fontFamily = "'Inter', system-ui, sans-serif";

export type BadgeColor = "verde" | "azul" | "amarillo" | "rojo";

export const badgeColorMap: Record<BadgeColor, [string, string]> = {
  verde: [colors.green100, colors.green800],
  azul: [colors.blueBgLight, colors.blue700],
  amarillo: [colors.amber100, colors.amber800],
  rojo: [colors.red100, colors.red800],
};
