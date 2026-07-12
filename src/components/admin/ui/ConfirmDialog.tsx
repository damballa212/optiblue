import { Trash2 } from "lucide-react";
import { ModalSurface } from "../../shared/ModalSurface";
import styles from "./AdminUi.module.css";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  error?: string | null;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  busy = false,
  error,
}: ConfirmDialogProps) {
  return (
    <ModalSurface
      title={title}
      eyebrow="Confirmar acción"
      onClose={() => !busy && onCancel()}
      footer={
        <>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onCancel}
            disabled={busy}
          >
            Conservar
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Eliminando..." : confirmLabel}
          </button>
        </>
      }
    >
      <div className={styles.confirmBody}>
        <span>
          <Trash2 aria-hidden="true" />
        </span>
        <p>{description}</p>
      </div>
      {error && (
        <p className={styles.inlineError} role="alert">
          {error}
        </p>
      )}
    </ModalSurface>
  );
}
