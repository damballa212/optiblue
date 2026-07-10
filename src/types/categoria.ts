export type CategoriaProducto = "monturas" | "solares" | "deporte";

export type CategoriaFiltro = "todos" | CategoriaProducto;

export interface Categoria {
  key: CategoriaFiltro;
  label: string;
}
