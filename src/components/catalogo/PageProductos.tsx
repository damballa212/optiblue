import { Filter, MessageCircle, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Producto } from "../../types";
import { useCategorias } from "../../hooks/useCategorias";
import { useProductos } from "../../hooks/useProductos";
import { CatalogFilters } from "./CatalogFilters";
import { filterAndSortProducts, getCatalogPriceBounds, type CatalogFilters as CatalogFilterState, type CatalogSort } from "./catalogFilterLogic";
import { MobileFilterSheet } from "./MobileFilterSheet";
import { ProductCard } from "./ProductCard";
import { ProductDetail } from "./ProductDetail";
import { ReservaModal } from "./ReservaModal";
import { DataState } from "../shared/DataState";
import styles from "./PageProductos.module.css";

export function PageProductos() {
  const navigate = useNavigate();
  const { productoId } = useParams();
  const { productos, loading: productosLoading, error: productosError } = useProductos();
  const { categorias, loading: categoriasLoading, error: categoriasError } = useCategorias();
  const bounds = useMemo(() => getCatalogPriceBounds(productos), [productos]);
  const [filters, setFilters] = useState<CatalogFilterState>({ categoryId: "all", minPrice: 0, maxPrice: Number.MAX_SAFE_INTEGER, inStockOnly: false, featuredOnly: false, sort: "default" });
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [reserveProduct, setReserveProduct] = useState<Producto | null>(null);
  const loading = productosLoading || categoriasLoading;
  const error = productosError || categoriasError;

  useEffect(() => {
    if (!filtersInitialized && productos.length > 0) {
      setFilters((current) => ({ ...current, minPrice: bounds.min, maxPrice: bounds.max }));
      setFiltersInitialized(true);
    }
  }, [bounds.max, bounds.min, filtersInitialized, productos.length]);

  const results = useMemo(() => filterAndSortProducts(productos, filters), [filters, productos]);
  const selectedProduct = productoId ? productos.find((product) => product.id === productoId) : undefined;
  const categoryLabel = (categoryId: string) => categorias.find((category) => category.id === categoryId)?.label ?? "Producto";
  const activeFilterCount = Number(filters.categoryId !== "all") + Number(filters.inStockOnly) + Number(filters.featuredOnly) + Number(filters.minPrice !== bounds.min || filters.maxPrice !== bounds.max);
  const clearFilters = () => setFilters({ categoryId: "all", minPrice: bounds.min, maxPrice: bounds.max, inStockOnly: false, featuredOnly: false, sort: "default" });

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div><span>Catálogo disponible</span><h1>Encuentra tu próxima montura.</h1><p>Filtra únicamente por la información registrada en el catálogo actual.</p></div>
        <strong>{loading ? "Consultando productos" : `${results.length} resultados`}</strong>
      </header>

      <div className={styles.mobileTools}>
        <button type="button" onClick={() => setMobileFiltersOpen(true)}><Filter aria-hidden="true" /> Filtros {activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
        <label><SlidersHorizontal aria-hidden="true" /><select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value as CatalogSort })}><option value="default">Ordenar</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option></select></label>
      </div>

      <div className={styles.catalogLayout}>
        <aside className={styles.filterRail}>
          <div className={styles.filterHeading}><h2>Filtros</h2>{activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Limpiar</button>}</div>
          <CatalogFilters categories={categorias} filters={filters} bounds={bounds} onChange={setFilters} />
        </aside>
        <section className={styles.results} aria-label="Resultados del catálogo">
          <div className={styles.toolbar}>
            <div className={styles.chips}>
              {filters.categoryId !== "all" && <button type="button" onClick={() => setFilters({ ...filters, categoryId: "all" })}>{categoryLabel(filters.categoryId)} <X size={13} /></button>}
              {filters.inStockOnly && <button type="button" onClick={() => setFilters({ ...filters, inStockOnly: false })}>Con stock <X size={13} /></button>}
              {filters.featuredOnly && <button type="button" onClick={() => setFilters({ ...filters, featuredOnly: false })}>Destacados <X size={13} /></button>}
            </div>
            <label className={styles.sort}>Ordenar por <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value as CatalogSort })}><option value="default">Orden actual</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option></select></label>
          </div>
          {loading && <DataState kind="loading" title="Cargando catálogo" message="Consultando productos y categorías." />}
          {!loading && error && <DataState kind="error" title="No pudimos cargar el catálogo" message="Revisa tu conexión o vuelve a intentarlo en unos minutos." />}
          {!loading && !error && productos.length === 0 && <DataState kind="empty" title="Catálogo pendiente" message="Todavía no hay productos publicados." actionLabel="Consultar sedes" onAction={() => navigate("/sedes")} />}
          {!loading && !error && productos.length > 0 && results.length === 0 && <DataState kind="empty" title="No hay productos con estos filtros" message="Ajusta los filtros o solicita orientación." actionLabel="Limpiar filtros" onAction={clearFilters} />}
          {!loading && !error && results.length > 0 && <div className={styles.grid}>{results.map((product) => <ProductCard key={product.id} p={product} categoriaLabel={categoryLabel(product.categoriaId)} onView={(item) => navigate(`/catalogo/${item.id}`)} />)}</div>}
          <div className={styles.advice}><MessageCircle aria-hidden="true" /><div><h2>¿No encuentras una opción?</h2><p>Consulta sedes o registra una cotización con los datos disponibles.</p></div><Link to="/lentes">Solicitar asesoría</Link></div>
        </section>
      </div>

      {mobileFiltersOpen && <MobileFilterSheet categories={categorias} filters={filters} bounds={bounds} resultCount={results.length} onChange={setFilters} onClear={clearFilters} onClose={() => setMobileFiltersOpen(false)} />}
      {selectedProduct && <ProductDetail product={selectedProduct} categoryLabel={categoryLabel(selectedProduct.categoriaId)} onClose={() => navigate("/catalogo")} onReserve={() => { setReserveProduct(selectedProduct); navigate("/catalogo", { replace: true }); }} onQuote={() => navigate(`/lentes?producto=${selectedProduct.id}`)} onAvailability={() => navigate("/sedes")} />}
      {!loading && productoId && !selectedProduct && <div className={styles.notFound}><DataState kind="empty" title="Producto no encontrado" message="El producto ya no está disponible en el catálogo." actionLabel="Volver al catálogo" onAction={() => navigate("/catalogo")} /></div>}
      {reserveProduct && <ReservaModal producto={reserveProduct} onClose={() => setReserveProduct(null)} />}
    </main>
  );
}
