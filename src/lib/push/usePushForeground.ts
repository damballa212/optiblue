import { useEffect, useState } from "react";
import { escucharForeground } from "./fcm";
import type { AdminForegroundNotification } from "./notification";
import { detectarSoportePush } from "./support";

interface UsePushForegroundResult {
  notificacion: AdminForegroundNotification | null;
  descartar: () => void;
}

export function usePushForeground(): UsePushForegroundResult {
  const [notificacion, setNotificacion] = useState<AdminForegroundNotification | null>(null);

  useEffect(() => {
    if (detectarSoportePush() !== "soportado") {
      return;
    }
    return escucharForeground(setNotificacion);
  }, []);

  return { notificacion, descartar: () => setNotificacion(null) };
}
