export interface Producto {
  id: string;
  nombre: string;
  categoriaId: string;
  precio: number;
  imagenUrl: string | null;
  descripcion: string;
  stock: number;
  destacado: boolean;
}
