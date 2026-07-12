import { AlertCircle, ArrowRight, PackageSearch } from "lucide-react";
import styles from "./DataState.module.css";

type DataStateKind = "loading" | "empty" | "error";

interface DataStateProps {
  kind: DataStateKind;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function DataState({ kind, title, message, actionLabel, onAction }: DataStateProps) {
  if (kind === "loading") {
    return (
      <div className={styles.skeletonGrid} aria-label={title} aria-busy="true">
        {[0, 1, 2].map((item) => (
          <div className={styles.skeletonCard} key={item}>
            <span className={styles.skeletonMedia} />
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLineShort} />
          </div>
        ))}
      </div>
    );
  }

  const Icon = kind === "error" ? AlertCircle : PackageSearch;
  return (
    <div className={`${styles.state} ${styles[kind]}`} role={kind === "error" ? "alert" : "status"}>
      <Icon aria-hidden="true" />
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
        {actionLabel && onAction && (
          <button type="button" onClick={onAction}>
            {actionLabel} <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
