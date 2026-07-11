// Colección administrable en Firestore (no enum fijo) — ver decisión
// 2026-07-11 en Obsidian (OptiBlue/Decisiones). El catálogo real del
// cliente puede traer más categorías que monturas/solares/deporte.
export interface Categoria {
  id: string;
  key: string;
  label: string;
  orden: number;
}

// "todos" es un pseudo-filtro de UI, no una categoría real de Firestore.
export type CategoriaFiltro = "todos" | string;
