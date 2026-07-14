import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, PackageCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Producto } from "../../types";
import { DataState } from "../shared/DataState";
import { useHorizontalRail } from "./useHorizontalRail";
import styles from "./FeaturedSelection.module.css";

interface FeaturedSelectionProps {
  products: Producto[];
  categoryLabel: (categoryId: string) => string;
  loading: boolean;
  error: string | null;
}

function FeaturedVisual({ product }: { product: Producto }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [product.imagenUrl]);

  if (product.imagenUrl && !failed) {
    return <img src={product.imagenUrl} alt={product.nombre} width={900} height={700} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
  }

  return (
    <div className={styles.fallback} role="img" aria-label={`Imagen pendiente de ${product.nombre}`}>
      <span className={`${styles.frameLens} ${styles.frameLensLeft}`} />
      <span className={`${styles.frameLens} ${styles.frameLensRight}`} />
      <span className={styles.frameBridge} />
      <small>Imagen pendiente</small>
    </div>
  );
}

export function FeaturedSelection({ products, categoryLabel, loading, error }: FeaturedSelectionProps) {
  const navigate = useNavigate();
  const { railRef, canPrevious, canNext, progress, scroll, update } = useHorizontalRail(products.length);
  const multiple = products.length > 1;

  return (
    <>
      <section className={styles.section} aria-labelledby="selection-title">
        <header className={styles.heading}>
          <p>Catálogo disponible</p>
          <div className={styles.headingRow}>
            <h2 id="selection-title">Selección OptiBlue</h2>
            <div className={styles.headingActions}>
              <Link to="/catalogo">Ver catálogo completo <ArrowUpRight aria-hidden="true" /></Link>
              {multiple && (
                <div className={styles.controls} aria-label="Controles de productos destacados">
                  <button type="button" onClick={() => scroll(-1)} disabled={!canPrevious} aria-label="Producto anterior"><ArrowLeft aria-hidden="true" /></button>
                  <button type="button" onClick={() => scroll(1)} disabled={!canNext} aria-label="Producto siguiente"><ArrowRight aria-hidden="true" /></button>
                </div>
              )}
            </div>
          </div>
        </header>

        {loading && <div className={styles.state}><DataState kind="loading" title="Cargando productos" message="Consultando el catálogo disponible." /></div>}
        {!loading && error && <div className={styles.state}><DataState kind="error" title="No pudimos cargar los productos" message="El resto de la navegación sigue disponible." actionLabel="Abrir catálogo" onAction={() => navigate("/catalogo")} /></div>}
        {!loading && !error && products.length === 0 && <div className={styles.state}><DataState kind="empty" title="Destacados pendientes" message="Todavía no hay productos marcados como destacados." actionLabel="Ver catálogo" onAction={() => navigate("/catalogo")} /></div>}

        {!loading && !error && products.length > 0 && (
          <>
            <div ref={railRef} className={`${styles.rail} ${multiple ? styles.multiple : styles.single}`} onScroll={update}>
              {products.map((product) => (
                <article className={styles.product} key={product.id} data-rail-item>
                  <div className={styles.visual}><FeaturedVisual product={product} /></div>
                  <div className={styles.info}>
                    <div className={styles.meta}><span>Destacado</span><span>{categoryLabel(product.categoriaId)}</span></div>
                    <h3>{product.nombre}</h3>
                    <p>{product.descripcion}</p>
                    <div className={styles.price}>
                      <strong>${product.precio}</strong>
                      <span className={product.stock > 0 ? styles.inStock : styles.outOfStock}><PackageCheck aria-hidden="true" /> {product.stock > 0 ? "Con stock" : "Sin stock"}</span>
                    </div>
                    <div className={styles.productActions}>
                      <Link className={styles.primary} to={`/catalogo/${product.id}`}>Ver producto <ArrowUpRight aria-hidden="true" /></Link>
                      <Link className={styles.secondary} to={`/lentes?producto=${product.id}`}><FileText aria-hidden="true" /> Cotizar con mi fórmula</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {multiple && <div className={styles.progress} aria-hidden="true"><span style={{ transform: `scaleX(${0.34 + progress * 0.66})` }} /></div>}
          </>
        )}
      </section>
      <div className={styles.closingBand} aria-hidden="true"><p>BARINAS <span /> ACARIGUA <span /> BARQUISIMETO</p></div>
    </>
  );
}
