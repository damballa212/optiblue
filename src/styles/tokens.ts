/**
 * Design tokens — single source of truth for every color/radius value
 * used across the admin style modules. Public CSS Modules mirror these
 * values as custom properties in global.css.
 */

export const colors = {
  navy: "#002d63",
  navyStrong: "#003b7a",
  blue700: "#174edc",
  blue600: "#1f5bff",
  blue400: "#54bfe8",
  blueBg: "#d7eef3",
  blueBgLight: "#edf6f8",
  blueBorder: "#b8d8e2",

  slate900: "#071d35",
  slate800: "#102f4a",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f5f8f9",
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
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6,
  card: 4,
  panel: 6,
  pill: 99,
} as const;

export const fontFamily = "'DM Sans Variable', system-ui, sans-serif";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  section: 72,
} as const;

export const breakpoints = {
  mobile: 390,
  tablet: 768,
  desktop: 1440,
} as const;

export const shadows = {
  lift: "0 12px 28px rgba(0, 45, 99, 0.12)",
  overlay: "0 24px 70px rgba(0, 29, 53, 0.22)",
} as const;

export type BadgeColor = "verde" | "azul" | "amarillo" | "rojo";

export const badgeColorMap: Record<BadgeColor, [string, string]> = {
  verde: [colors.green100, colors.green800],
  azul: [colors.blueBgLight, colors.blue700],
  amarillo: [colors.amber100, colors.amber800],
  rojo: [colors.red100, colors.red800],
};
