export function hasConfiguredValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && !normalized.includes("por definir") && !normalized.includes("por confirmar");
}

export function isSpecificMapUrl(value: string): boolean {
  if (!hasConfiguredValue(value)) return false;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return (url.pathname !== "" && url.pathname !== "/") || url.search.length > 1 || url.hash.length > 1;
  } catch {
    return false;
  }
}
