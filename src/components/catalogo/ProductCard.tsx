import { ArrowUpRight, PackageCheck, Star } from "lucide-react";
import type { Producto } from "../../types";
import { ProductImage } from "./ProductImage";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  p: Producto;
  categoriaLabel: string;
  onView: (producto: Producto) => void;
}

export function ProductCard({ p, categoriaLabel, onView }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {p.destacado && <span className={styles.featured}><Star size={13} aria-hidden="true" /> Destacado</span>}
        <ProductImage src={p.imagenUrl} alt={p.nombre} width={600} height={420} loading="lazy" />
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{categoriaLabel}</span>
        <h3>{p.nombre}</h3>
        <p>{p.descripcion}</p>
        <div className={styles.meta}>
          <strong>${p.precio}</strong>
          <span className={p.stock > 0 ? styles.inStock : styles.outOfStock}>
            <PackageCheck size={14} aria-hidden="true" /> {p.stock > 0 ? "Con stock" : "Sin stock"}
          </span>
        </div>
        <button type="button" onClick={() => onView(p)}>
          Ver producto <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
