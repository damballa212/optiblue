const DEFAULT_STOREFRONT_URL = "https://optiblue-prod.web.app";

export const STOREFRONT_URL = (
  import.meta.env.VITE_STOREFRONT_URL ?? DEFAULT_STOREFRONT_URL
).replace(/\/$/, "");

export function openStorefront(): void {
  window.open(STOREFRONT_URL, "_blank", "noopener,noreferrer");
}
