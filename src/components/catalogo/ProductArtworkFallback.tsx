import styles from "./ProductArtworkFallback.module.css";

interface ProductArtworkFallbackProps {
  label?: string;
}

export function ProductArtworkFallback({ label = "Imagen de producto pendiente" }: ProductArtworkFallbackProps) {
  return (
    <div className={styles.fallback} role="img" aria-label={label}>
      <span className={styles.lens} />
      <span className={styles.lens} />
      <span className={styles.bridge} />
      <span className={styles.armLeft} />
      <span className={styles.armRight} />
    </div>
  );
}
