import {
  Edit3,
  Glasses,
  ImageOff,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useCategorias } from "../../../hooks/useCategorias";
import { catalogoApi } from "../../../lib/api/catalogo";
import type { Categoria, Producto } from "../../../types";
import { ModalSurface } from "../../shared/ModalSurface";
import { useAdminOperations } from "../data/AdminOperationsContext";
import {
  validateCategoryForm,
  validateProductForm,
  type CategoryFormValue,
  type ProductFormValue,
} from "../domain/forms";
import { AdminDataState } from "../ui/AdminDataState";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import layout from "../ui/AdminLayout.module.css";
import ui from "../ui/AdminUi.module.css";
import styles from "../ui/AdminMaintenance.module.css";
import polish from "../ui/AdminPolish.module.css";
import { AdminPageHeading } from "../ui/AdminPageHeading";

const EMPTY_PRODUCT: ProductFormValue = {
  nombre: "",
  categoriaId: "",
  precio: "",
  stock: "0",
  imagenUrl: "",
  descripcion: "",
  destacado: false,
};

const EMPTY_CATEGORY: CategoryFormValue = { key: "", label: "", orden: "0" };

type ProductEditor = { mode: "new" } | { mode: "edit"; product: Producto };
type CategoryEditor = { mode: "new" } | { mode: "edit"; category: Categoria };

function ProductVisual({
  product,
  previewUrl,
}: {
  product?: Producto;
  previewUrl?: string;
}) {
  const [failed, setFailed] = useState(false);
  const source = previewUrl ?? product?.imagenUrl ?? "";
  useEffect(() => setFailed(false), [source]);
  if (!source || failed) {
    return (
      <span className={styles.productFallback} aria-label="Producto sin imagen">
        <Glasses aria-hidden="true" />
      </span>
    );
  }
  return (
    <img
      src={source}
      alt={product?.nombre || "Vista previa del producto"}
      onError={() => setFailed(true)}
    />
  );
}

export function AdminCatalogPage() {
  const { productos, loading, errors } = useAdminOperations();
  const {
    categorias,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategorias();
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [query, setQuery] = useState("");
  const [productEditor, setProductEditor] = useState<ProductEditor | null>(
    null,
  );
  const [categoryEditor, setCategoryEditor] = useState<CategoryEditor | null>(
    null,
  );
  const [deleteProduct, setDeleteProduct] = useState<Producto | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Categoria | null>(null);
  const [busy, setBusy] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const categoryNames = useMemo(
    () => new Map(categorias.map((item) => [item.id, item.label])),
    [categorias],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const filteredProducts = productos.filter(
    (item) =>
      !normalizedQuery ||
      `${item.nombre} ${item.descripcion} ${categoryNames.get(item.categoriaId) ?? ""}`
        .toLocaleLowerCase("es")
        .includes(normalizedQuery),
  );

  async function removeProduct() {
    if (!deleteProduct) return;
    setBusy(true);
    setMutationError(null);
    try {
      await catalogoApi.eliminarProducto(deleteProduct.id);
      setDeleteProduct(null);
    } catch (cause) {
      setMutationError(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar el producto.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeCategory() {
    if (!deleteCategory) return;
    setBusy(true);
    setMutationError(null);
    try {
      await catalogoApi.eliminarCategoria(deleteCategory.id);
      setDeleteCategory(null);
    } catch (cause) {
      setMutationError(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar la categoría.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={layout.page}>
      <AdminPageHeading
        className={polish.maintenanceTitle}
        eyebrow="Mantenimiento"
        title="Catálogo"
        description="Productos y categorías visibles en el sitio público"
        action={<button
          className={styles.primaryAction}
          type="button"
          onClick={() =>
            tab === "products"
              ? setProductEditor({ mode: "new" })
              : setCategoryEditor({ mode: "new" })
          }
        >
          <Plus aria-hidden="true" />
          {tab === "products" ? "Nuevo producto" : "Nueva categoría"}
        </button>}
      />

      <div
        className={styles.segmented}
        role="tablist"
        aria-label="Sección del catálogo"
      >
        <button
          role="tab"
          aria-selected={tab === "products"}
          type="button"
          onClick={() => setTab("products")}
        >
          Productos <span>{productos.length}</span>
        </button>
        <button
          role="tab"
          aria-selected={tab === "categories"}
          type="button"
          onClick={() => setTab("categories")}
        >
          Categorías <span>{categorias.length}</span>
        </button>
      </div>

      {mutationError && (
        <p className={styles.pageError} role="alert">
          {mutationError}
        </p>
      )}

      {tab === "products" && (
        <section aria-label="Productos">
          <label className={styles.searchField}>
            <Search aria-hidden="true" />
            <span className={styles.srOnly}>Buscar productos</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o categoría"
            />
          </label>
          {loading.productos && (
            <AdminDataState
              kind="loading"
              title="Cargando productos"
              message=""
            />
          )}
          {!loading.productos && errors.productos && (
            <AdminDataState
              kind="error"
              title="No pudimos cargar los productos"
              message="La información existente no fue modificada."
            />
          )}
          {!loading.productos &&
            !errors.productos &&
            filteredProducts.length === 0 && (
              <AdminDataState
                kind="empty"
                title={query ? "Sin coincidencias" : "No hay productos"}
                message={
                  query
                    ? "Prueba con otra búsqueda."
                    : "Crea el primer producto para publicarlo en el catálogo."
                }
                onRetry={
                  query
                    ? () => setQuery("")
                    : () => setProductEditor({ mode: "new" })
                }
                actionLabel={query ? "Limpiar búsqueda" : "Crear producto"}
              />
            )}
          {!loading.productos &&
            !errors.productos &&
            filteredProducts.length > 0 && (
              <div className={styles.maintenanceList}>
                <div className={styles.productHead} aria-hidden="true">
                  <span>Producto</span>
                  <span>Categoría</span>
                  <span>Precio</span>
                  <span>Stock</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>
                {filteredProducts.map((product) => (
                  <article className={styles.productRow} key={product.id}>
                    <div className={styles.productIdentity}>
                      <ProductVisual product={product} />
                      <span>
                        <strong>{product.nombre}</strong>
                        <small>
                          {product.descripcion || "Sin descripción"}
                        </small>
                      </span>
                    </div>
                    <span className={styles.categoryText}>
                      {categoryNames.get(product.categoriaId) ??
                        "Categoría no disponible"}
                    </span>
                    <strong className={styles.price}>${product.precio}</strong>
                    <span
                      className={
                        product.stock > 0 ? styles.stock : styles.outOfStock
                      }
                    >
                      {product.stock}{" "}
                      <small>
                        {product.stock > 0 ? "disponibles" : "sin stock"}
                      </small>
                    </span>
                    <span className={styles.featured}>
                      {product.destacado ? (
                        <>
                          <Star
                            className={polish.featuredIcon}
                            aria-hidden="true"
                          />
                          Destacado
                        </>
                      ) : (
                        "Estándar"
                      )}
                    </span>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        title="Editar producto"
                        aria-label={`Editar ${product.nombre}`}
                        onClick={() =>
                          setProductEditor({ mode: "edit", product })
                        }
                      >
                        <Edit3 aria-hidden="true" />
                      </button>
                      <button
                        className={styles.deleteIcon}
                        type="button"
                        title="Eliminar producto"
                        aria-label={`Eliminar ${product.nombre}`}
                        onClick={() => {
                          setMutationError(null);
                          setDeleteProduct(product);
                        }}
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      )}

      {tab === "categories" && (
        <section aria-label="Categorías">
          {categoriesLoading && (
            <AdminDataState
              kind="loading"
              title="Cargando categorías"
              message=""
            />
          )}
          {!categoriesLoading && categoriesError && (
            <AdminDataState
              kind="error"
              title="No pudimos cargar las categorías"
              message="La información existente no fue modificada."
            />
          )}
          {!categoriesLoading &&
            !categoriesError &&
            categorias.length === 0 && (
              <AdminDataState
                kind="empty"
                title="No hay categorías"
                message="Crea una categoría antes de registrar productos."
                onRetry={() => setCategoryEditor({ mode: "new" })}
                actionLabel="Crear categoría"
              />
            )}
          {!categoriesLoading && !categoriesError && categorias.length > 0 && (
            <div className={styles.categoryList}>
              <div className={styles.categoryHead} aria-hidden="true">
                <span>Orden</span>
                <span>Nombre visible</span>
                <span>Clave</span>
                <span>Productos</span>
                <span>Acciones</span>
              </div>
              {categorias.map((category) => {
                const uses = productos.filter(
                  (product) => product.categoriaId === category.id,
                ).length;
                return (
                  <article className={styles.categoryRow} key={category.id}>
                    <strong>{category.orden}</strong>
                    <span>{category.label}</span>
                    <code>{category.key}</code>
                    <span>{uses}</span>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        title="Editar categoría"
                        aria-label={`Editar ${category.label}`}
                        onClick={() =>
                          setCategoryEditor({ mode: "edit", category })
                        }
                      >
                        <Edit3 aria-hidden="true" />
                      </button>
                      <button
                        className={styles.deleteIcon}
                        type="button"
                        title="Eliminar categoría"
                        aria-label={`Eliminar ${category.label}`}
                        onClick={() => {
                          setMutationError(null);
                          setDeleteCategory(category);
                        }}
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {productEditor && (
        <ProductEditorModal
          editor={productEditor}
          categories={categorias}
          onClose={() => setProductEditor(null)}
        />
      )}
      {categoryEditor && (
        <CategoryEditorModal
          editor={categoryEditor}
          onClose={() => setCategoryEditor(null)}
        />
      )}
      {deleteProduct && (
        <ConfirmDialog
          title={`Eliminar “${deleteProduct.nombre}”`}
          description="El producto dejará de estar disponible en el catálogo. Esta acción no se puede deshacer."
          confirmLabel="Eliminar producto"
          onConfirm={removeProduct}
          onCancel={() => !busy && setDeleteProduct(null)}
          busy={busy}
          error={mutationError}
        />
      )}
      {deleteCategory && (
        <ConfirmDialog
          title={`Eliminar “${deleteCategory.label}”`}
          description={`${productos.filter((product) => product.categoriaId === deleteCategory.id).length} producto(s) usan esta categoría. Verifica sus asignaciones antes de eliminarla; esta acción no se puede deshacer.`}
          confirmLabel="Eliminar categoría"
          onConfirm={removeCategory}
          onCancel={() => !busy && setDeleteCategory(null)}
          busy={busy}
          error={mutationError}
        />
      )}
    </div>
  );
}

function ProductEditorModal({
  editor,
  categories,
  onClose,
}: {
  editor: ProductEditor;
  categories: Categoria[];
  onClose: () => void;
}) {
  const editing = editor.mode === "edit" ? editor.product : null;
  const [form, setForm] = useState<ProductFormValue>(
    editing
      ? {
          nombre: editing.nombre,
          categoriaId: editing.categoriaId,
          precio: String(editing.precio),
          stock: String(editing.stock),
          imagenUrl: editing.imagenUrl ?? "",
          descripcion: editing.descripcion,
          destacado: editing.destacado,
        }
      : { ...EMPTY_PRODUCT, categoriaId: categories[0]?.id ?? "" },
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormValue, string>>
  >({});
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof ProductFormValue>(
    key: K,
    value: ProductFormValue[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  async function save() {
    const nextErrors = validateProductForm(form);
    setErrors(nextErrors);
    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
          ?.focus(),
      );
      return;
    }
    setBusy(true);
    setApiError(null);
    const input = {
      nombre: form.nombre.trim(),
      categoriaId: form.categoriaId,
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagenUrl: form.imagenUrl.trim() || null,
      descripcion: form.descripcion.trim(),
      destacado: form.destacado,
    };
    try {
      if (editing) await catalogoApi.actualizarProducto(editing.id, input);
      else await catalogoApi.crearProducto(input);
      onClose();
    } catch (cause) {
      setApiError(
        cause instanceof Error
          ? cause.message
          : "No se pudo guardar el producto.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalSurface
      title={editing ? "Editar producto" : "Nuevo producto"}
      eyebrow="Catálogo"
      onClose={() => !busy && onClose()}
      wide
      footer={
        <>
          <button
            type="button"
            className={ui.secondaryButton}
            onClick={onClose}
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={save}
            disabled={busy}
          >
            {busy ? "Guardando..." : "Guardar producto"}
          </button>
        </>
      }
    >
      <div className={styles.editorGrid}>
        <div className={styles.imagePreview}>
          <ProductVisual
            product={editing ?? undefined}
            previewUrl={form.imagenUrl.trim()}
          />
          <div>
            <strong>Vista previa</strong>
            <span>Se actualiza al pegar una URL válida.</span>
          </div>
        </div>
        <div className={styles.formGrid} ref={formRef}>
          <Field label="Nombre" error={errors.nombre}>
            <input
              name="nombre"
              value={form.nombre}
              onChange={(event) => set("nombre", event.target.value)}
              autoFocus
            />
          </Field>
          <Field label="Categoría" error={errors.categoriaId}>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={(event) => set("categoriaId", event.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Precio ($)" error={errors.precio}>
            <input
              name="precio"
              inputMode="decimal"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={(event) => set("precio", event.target.value)}
            />
          </Field>
          <Field label="Stock" error={errors.stock}>
            <input
              name="stock"
              inputMode="numeric"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) => set("stock", event.target.value)}
            />
          </Field>
          <Field
            className={styles.fullField}
            label="URL de imagen"
            error={errors.imagenUrl}
          >
            <div className={styles.inputWithIcon}>
              <ImageOff aria-hidden="true" />
              <input
                name="imagenUrl"
                inputMode="url"
                value={form.imagenUrl}
                onChange={(event) => set("imagenUrl", event.target.value)}
                placeholder="https://..."
              />
            </div>
          </Field>
          <Field
            className={styles.fullField}
            label="Descripción"
            error={errors.descripcion}
          >
            <textarea
              name="descripcion"
              rows={4}
              value={form.descripcion}
              onChange={(event) => set("descripcion", event.target.value)}
            />
          </Field>
          <label className={`${styles.checkField} ${styles.fullField}`}>
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(event) => set("destacado", event.target.checked)}
            />
            <span>
              <strong>Producto destacado</strong>
              <small>Aparece en las selecciones destacadas del sitio.</small>
            </span>
          </label>
        </div>
      </div>
      {apiError && (
        <p className={styles.formError} role="alert">
          {apiError}
        </p>
      )}
    </ModalSurface>
  );
}

function CategoryEditorModal({
  editor,
  onClose,
}: {
  editor: CategoryEditor;
  onClose: () => void;
}) {
  const editing = editor.mode === "edit" ? editor.category : null;
  const [form, setForm] = useState<CategoryFormValue>(
    editing
      ? { key: editing.key, label: editing.label, orden: String(editing.orden) }
      : EMPTY_CATEGORY,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormValue, string>>
  >({});
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  async function save() {
    const nextErrors = validateCategoryForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    setApiError(null);
    const input = {
      key: form.key.trim(),
      label: form.label.trim(),
      orden: Number(form.orden),
    };
    try {
      if (editing) await catalogoApi.actualizarCategoria(editing.id, input);
      else await catalogoApi.crearCategoria(input);
      onClose();
    } catch (cause) {
      setApiError(
        cause instanceof Error
          ? cause.message
          : "No se pudo guardar la categoría.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <ModalSurface
      title={editing ? "Editar categoría" : "Nueva categoría"}
      eyebrow="Catálogo"
      onClose={() => !busy && onClose()}
      footer={
        <>
          <button
            type="button"
            className={ui.secondaryButton}
            onClick={onClose}
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={save}
            disabled={busy}
          >
            {busy ? "Guardando..." : "Guardar categoría"}
          </button>
        </>
      }
    >
      <div className={styles.formGrid}>
        <Field
          className={styles.fullField}
          label="Nombre visible"
          error={errors.label}
        >
          <input
            value={form.label}
            onChange={(event) =>
              setForm((current) => ({ ...current, label: event.target.value }))
            }
            autoFocus
          />
        </Field>
        <Field label="Clave" error={errors.key}>
          <input
            value={form.key}
            onChange={(event) =>
              setForm((current) => ({ ...current, key: event.target.value }))
            }
          />
        </Field>
        <Field label="Orden" error={errors.orden}>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={form.orden}
            onChange={(event) =>
              setForm((current) => ({ ...current, orden: event.target.value }))
            }
          />
        </Field>
      </div>
      {apiError && (
        <p className={styles.formError} role="alert">
          {apiError}
        </p>
      )}
    </ModalSurface>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span>{label}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  );
}
