import styles from "./OpticalArtwork.module.css";

interface OpticalArtworkProps {
  compact?: boolean;
}

export function OpticalArtwork({ compact = false }: OpticalArtworkProps) {
  return (
    <div className={`${styles.artwork} ${compact ? styles.compact : ""}`} aria-hidden="true">
      <span className={styles.outer} />
      <span className={styles.inner} />
      <span className={styles.bridge} />
      <span className={styles.glint} />
    </div>
  );
}
