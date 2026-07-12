import type { Categoria } from "../../types";
import { ModalSurface } from "../shared/ModalSurface";
import { CatalogFilters } from "./CatalogFilters";
import type { CatalogFilters as CatalogFilterState } from "./catalogFilterLogic";
import styles from "./MobileFilterSheet.module.css";

interface MobileFilterSheetProps {
  categories: Categoria[];
  filters: CatalogFilterState;
  bounds: { min: number; max: number };
  resultCount: number;
  onChange: (filters: CatalogFilterState) => void;
  onClear: () => void;
  onClose: () => void;
}

export function MobileFilterSheet(props: MobileFilterSheetProps) {
  return (
    <ModalSurface title="Filtrar catálogo" eyebrow="Opciones disponibles" onClose={props.onClose} footer={<><button className={styles.clear} type="button" onClick={props.onClear}>Limpiar</button><button className={styles.apply} type="button" onClick={props.onClose}>Ver {props.resultCount} resultados</button></>}>
      <CatalogFilters categories={props.categories} filters={props.filters} bounds={props.bounds} onChange={props.onChange} compact />
    </ModalSurface>
  );
}
