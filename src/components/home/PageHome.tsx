import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCategorias } from "../../hooks/useCategorias";
import { useProductos } from "../../hooks/useProductos";
import { ProductCard } from "../catalogo/ProductCard";
import { DataState } from "../shared/DataState";
import { AdviceBanner } from "./AdviceBanner";
import { Hero } from "./Hero";
import { LocationPreview } from "./LocationPreview";
import { QuickPaths } from "./QuickPaths";
import { ServiceProcess } from "./ServiceProcess";
import styles from "./PageHome.module.css";

export function PageHome() {
  const navigate = useNavigate();
  const { productos, loading: productosLoading, error: productosError } = useProductos();
  const { categorias, loading: categoriasLoading, error: categoriasError } = useCategorias();
  const destacados = productos.filter((producto) => producto.destacado).slice(0, 3);
  const categoriaLabel = (categoriaId: string) => categorias.find((categoria) => categoria.id === categoriaId)?.label ?? "Producto";
  const loading = productosLoading || categoriasLoading;
  const error = productosError || categoriasError;

  return (
    <main>
      <Hero />
      <QuickPaths />
      <section className={styles.featured}>
        <div className={styles.heading}>
          <div><span>Catálogo disponible</span><h2>Productos destacados</h2><p>Selección marcada como destacada en el catálogo actual.</p></div>
          <Link to="/catalogo">Ver catálogo completo <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        {loading && <DataState kind="loading" title="Cargando productos" message="Consultando el catálogo disponible." />}
        {!loading && error && <DataState kind="error" title="No pudimos cargar los productos" message="El resto de la navegación sigue disponible." actionLabel="Abrir catálogo" onAction={() => navigate("/catalogo")} />}
        {!loading && !error && destacados.length === 0 && <DataState kind="empty" title="Destacados pendientes" message="Todavía no hay productos marcados como destacados." actionLabel="Ver catálogo" onAction={() => navigate("/catalogo")} />}
        {!loading && !error && destacados.length > 0 && (
          <div className={styles.grid}>
            {destacados.map((producto) => <ProductCard key={producto.id} p={producto} categoriaLabel={categoriaLabel(producto.categoriaId)} onView={(item) => navigate(`/catalogo/${item.id}`)} />)}
          </div>
        )}
      </section>
      <ServiceProcess />
      <LocationPreview />
      <AdviceBanner />
    </main>
  );
}
