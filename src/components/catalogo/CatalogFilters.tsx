import type { Categoria } from "../../types";
import type { CatalogFilters as CatalogFilterState } from "./catalogFilterLogic";
import styles from "./CatalogFilters.module.css";

interface CatalogFiltersProps {
  categories: Categoria[];
  filters: CatalogFilterState;
  bounds: { min: number; max: number };
  onChange: (filters: CatalogFilterState) => void;
  compact?: boolean;
}

export function CatalogFilters({ categories, filters, bounds, onChange, compact = false }: CatalogFiltersProps) {
  const update = <K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className={`${styles.filters} ${compact ? styles.compact : ""}`}>
      <fieldset>
        <legend>Categoría</legend>
        <label><input type="radio" name={compact ? "mobile-category" : "category"} checked={filters.categoryId === "all"} onChange={() => update("categoryId", "all")} /> Todas</label>
        {categories.map((category) => (
          <label key={category.id}><input type="radio" name={compact ? "mobile-category" : "category"} checked={filters.categoryId === category.id} onChange={() => update("categoryId", category.id)} /> {category.label}</label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Precio</legend>
        <div className={styles.priceInputs}>
          <label><span>Mínimo</span><input type="number" min={bounds.min} max={filters.maxPrice} value={filters.minPrice} onChange={(event) => update("minPrice", Number(event.target.value))} /></label>
          <label><span>Máximo</span><input type="number" min={filters.minPrice} max={bounds.max} value={filters.maxPrice} onChange={(event) => update("maxPrice", Number(event.target.value))} /></label>
        </div>
        <div className={styles.rangeTrack}><span style={{ left: `${bounds.max === bounds.min ? 0 : ((filters.minPrice - bounds.min) / (bounds.max - bounds.min)) * 100}%`, right: `${bounds.max === bounds.min ? 0 : 100 - ((filters.maxPrice - bounds.min) / (bounds.max - bounds.min)) * 100}%` }} /></div>
      </fieldset>
      <fieldset>
        <legend>Disponibilidad</legend>
        <label><input type="checkbox" checked={filters.inStockOnly} onChange={(event) => update("inStockOnly", event.target.checked)} /> Con stock</label>
        <label><input type="checkbox" checked={filters.featuredOnly} onChange={(event) => update("featuredOnly", event.target.checked)} /> Destacados</label>
      </fieldset>
    </div>
  );
}
