import { useEffect, useRef, useState } from "react";
import { initServiceWorker } from "./registerSW";

/**
 * Registra el service worker (solo en build de producción; en dev el SW
 * está deshabilitado, ver vite.config.ts devOptions) y expone si hay una
 * versión nueva esperando confirmación del usuario.
 */
export function usePwaUpdate(): { needRefresh: boolean; applyUpdate: () => void } {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }
    updateRef.current = initServiceWorker({
      onNeedRefresh: () => setNeedRefresh(true),
    });
  }, []);

  const applyUpdate = () => {
    void updateRef.current?.(true);
  };

  return { needRefresh, applyUpdate };
}
