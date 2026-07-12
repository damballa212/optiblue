import styles from "./BrandMark.module.css";

interface BrandMarkProps {
  compact?: boolean;
  inverse?: boolean;
}

export function BrandMark({ compact = false, inverse = false }: BrandMarkProps) {
  return (
    <span className={`${styles.brand} ${compact ? styles.compact : ""} ${inverse ? styles.inverse : ""}`}>
      <span className={styles.mark} aria-hidden="true">
        <span />
      </span>
      <span className={styles.wordmark}>OPTIBLUE</span>
    </span>
  );
}
