import { WifiOff } from "lucide-react";
import { useOnline } from "../../hooks/useOnline";
import styles from "./OfflineBanner.module.css";

export function OfflineBanner() {
  const online = useOnline();
  const isPanel = import.meta.env.VITE_APP_TARGET === "panel";

  if (online) {
    return null;
  }

  return (
    <div className={styles.banner} role="status">
      <WifiOff size={16} aria-hidden="true" />
      <span>
        {isPanel
          ? "Sin conexión. Algunas acciones y datos pueden no estar disponibles."
          : "Sin conexión — mostrando los últimos datos guardados."}
      </span>
    </div>
  );
}
