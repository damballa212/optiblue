/**
 * jsdom (vía Vitest) no expone `window.localStorage` de forma confiable en
 * este entorno: Node 22+ registra su propio `localStorage` experimental en
 * el scope global, y la población de globals de Vitest no llega a
 * sobreescribirlo con el de jsdom. Se reemplaza por un stub en memoria en
 * los tests que lo necesitan.
 */
export function installLocalStorageStub(): void {
  const store = new Map<string, string>();
  const stub: Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear"> = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
  Object.defineProperty(window, "localStorage", { value: stub, configurable: true, writable: true });
}
