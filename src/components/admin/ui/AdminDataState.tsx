import { AlertCircle, Inbox, RotateCw, type LucideIcon } from "lucide-react";
import styles from "./AdminLayout.module.css";

interface AdminDataStateProps {
  kind: "loading" | "empty" | "error";
  title: string;
  message: string;
  onRetry?: () => void;
  actionLabel?: string;
  actionIcon?: LucideIcon;
}

export function AdminDataState({
  kind,
  title,
  message,
  onRetry,
  actionLabel = "Reintentar",
  actionIcon: ActionIcon = RotateCw,
}: AdminDataStateProps) {
  if (kind === "loading") {
    return (
      <div className={styles.rowSkeletons} aria-label={title} aria-busy="true">
        {[0, 1, 2, 3].map((item) => (
          <div key={item}>
            <i />
            <span>
              <b />
              <b />
            </span>
          </div>
        ))}
      </div>
    );
  }
  const Icon = kind === "error" ? AlertCircle : Inbox;
  return (
    <div
      className={`${styles.dataState} ${kind === "error" ? styles.dataError : ""}`}
      role={kind === "error" ? "alert" : "status"}
    >
      <Icon aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          <ActionIcon size={15} aria-hidden="true" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
