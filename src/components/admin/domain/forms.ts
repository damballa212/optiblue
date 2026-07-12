export interface ProductFormValue {
  nombre: string;
  categoriaId: string;
  precio: string;
  stock: string;
  imagenUrl: string;
  descripcion: string;
  destacado: boolean;
}

export interface CategoryFormValue {
  key: string;
  label: string;
  orden: string;
}

export interface LocationFormValue {
  ciudad: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  horario: string;
  maps: string;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProductForm(value: ProductFormValue): Partial<Record<keyof ProductFormValue, string>> {
  const errors: Partial<Record<keyof ProductFormValue, string>> = {};
  if (!value.nombre.trim()) errors.nombre = "Indica el nombre.";
  if (!value.categoriaId) errors.categoriaId = "Selecciona una categoria.";
  const price = Number(value.precio);
  if (value.precio.trim() === "" || !Number.isFinite(price) || price < 0) errors.precio = "Debe ser 0 o mayor.";
  const stock = Number(value.stock);
  if (value.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) errors.stock = "Debe ser un entero de 0 o mayor.";
  if (value.imagenUrl.trim() && !isHttpUrl(value.imagenUrl.trim())) errors.imagenUrl = "Usa una URL HTTP o HTTPS valida.";
  return errors;
}

export function validateCategoryForm(value: CategoryFormValue): Partial<Record<keyof CategoryFormValue, string>> {
  const errors: Partial<Record<keyof CategoryFormValue, string>> = {};
  if (!value.key.trim()) errors.key = "Indica la clave.";
  if (!value.label.trim()) errors.label = "Indica el nombre visible.";
  const order = Number(value.orden);
  if (value.orden.trim() === "" || !Number.isInteger(order) || order < 0) errors.orden = "Debe ser un entero de 0 o mayor.";
  return errors;
}

export function validateLocationForm(value: LocationFormValue): Partial<Record<keyof LocationFormValue, string>> {
  const errors: Partial<Record<keyof LocationFormValue, string>> = {};
  for (const key of ["ciudad", "direccion", "telefono", "whatsapp", "horario"] as const) {
    if (!value[key].trim()) errors[key] = "Este campo es obligatorio.";
  }
  if (!value.maps.trim() || !isHttpUrl(value.maps.trim())) errors.maps = "Usa una URL HTTP o HTTPS valida.";
  return errors;
}
