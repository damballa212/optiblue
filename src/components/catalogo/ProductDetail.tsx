import { ArrowRight, FileText, MapPin, MessageCircle, PackageCheck, Star } from "lucide-react";
import type { Producto } from "../../types";
import { ModalSurface } from "../shared/ModalSurface";
import { ProductImage } from "./ProductImage";
import styles from "./ProductDetail.module.css";

interface ProductDetailProps {
  product: Producto;
  categoryLabel: string;
  onClose: () => void;
  onReserve: () => void;
  onQuote: () => void;
  onAvailability: () => void;
}

export function ProductDetail({ product, categoryLabel, onClose, onReserve, onQuote, onAvailability }: ProductDetailProps) {
  return (
    <ModalSurface title={product.nombre} eyebrow={categoryLabel} onClose={onClose} wide>
      <div className={styles.layout}>
        <div className={styles.media}>
          {product.destacado && <span className={styles.featured}><Star size={14} aria-hidden="true" /> Destacado</span>}
          <ProductImage src={product.imagenUrl} alt={product.nombre} width={900} height={700} />
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{categoryLabel}</span>
          <h3>{product.nombre}</h3>
          <p>{product.descripcion}</p>
          <div className={styles.price}>${product.precio}</div>
          <div className={product.stock > 0 ? styles.stock : styles.noStock}><PackageCheck size={17} aria-hidden="true" /> {product.stock > 0 ? `${product.stock} disponibles en catálogo` : "Sin stock en catálogo"}</div>
          <div className={styles.notice}>El stock mostrado es general. Confirma la coordinación con la sede antes de trasladarte.</div>
          <div className={styles.actions}>
            <button className={styles.primary} type="button" onClick={onReserve} disabled={product.stock <= 0}><MapPin aria-hidden="true" /> Apartar en sede <ArrowRight aria-hidden="true" /></button>
            <button className={styles.secondary} type="button" onClick={onQuote}><FileText aria-hidden="true" /> Cotizar con mi fórmula <ArrowRight aria-hidden="true" /></button>
            <button className={styles.outline} type="button" onClick={onAvailability}><MessageCircle aria-hidden="true" /> Consultar disponibilidad <ArrowRight aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </ModalSurface>
  );
}
