import type { CategoriaProducto } from "./categoria";

export interface Producto {
  id: number;
  nombre: string;
  categoria: CategoriaProducto;
  precio: number;
  imagen: string;
  descripcion: string;
  stock: number;
  destacado: boolean;
}
