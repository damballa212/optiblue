import { RefreshCw } from "lucide-react";
import styles from "./UpdateToast.module.css";

interface UpdateToastProps {
  onUpdate: () => void;
}

export function UpdateToast({ onUpdate }: UpdateToastProps) {
  return (
    <div className={styles.toast} role="status">
      <RefreshCw size={18} aria-hidden="true" />
      <p>Hay una nueva versión de OptiBlue disponible.</p>
      <button type="button" onClick={onUpdate}>
        Actualizar
      </button>
    </div>
  );
}
