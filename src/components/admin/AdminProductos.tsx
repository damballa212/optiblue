import { useState, useEffect } from "react";
import type { Producto } from "../../types";
import { useProductos } from "../../hooks/useProductos";
import { useCategorias } from "../../hooks/useCategorias";
import { catalogoApi } from "../../lib/api/catalogo";
import { btnPrimary, btnGhost, overlay, modal, modalTitle, formGroupFull, label, input, select, table, th, td, badge } from "../../styles/shared";
import * as Admin from "./Admin.styles";
import * as S from "./AdminProductos.styles";

interface ProductoForm {
  nombre: string;
  categoriaId: string;
  precio: string;
  imagenUrl: string;
  descripcion: string;
  stock: string;
  destacado: boolean;
}

const EMPTY_FORM: ProductoForm = { nombre: "", categoriaId: "", precio: "", imagenUrl: "", descripcion: "", stock: "0", destacado: false };

const TEXT_FIELDS: [keyof ProductoForm, string][] = [
  ["nombre", "Nombre"],
  ["descripcion", "Descripción"],
  ["imagenUrl", "URL de imagen"],
  ["precio", "Precio ($)"],
  ["stock", "Stock"],
];

// Las escrituras van a Firestore vía catalogoApi (Cloud Function); la lista
// se actualiza sola por el onSnapshot de useProductos, sin tocar estado local.
export function AdminProductos() {
  const { productos } = useProductos();
  const { categorias } = useCategorias();
  const [editando, setEditando] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<ProductoForm>(EMPTY_FORM);
  const [nuevo, setNuevo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoriaLabel = (categoriaId: string) => categorias.find((c) => c.id === categoriaId)?.label ?? "—";

  // Si el modal de "nuevo producto" se abrió antes de que categorias
  // terminara de cargar (onSnapshot async), el <select> mostraba la primera
  // opción visualmente sin que el estado real se actualizara — esto lo
  // corrige apenas categorias llega.
  useEffect(() => {
    if (editando === "new" && !form.categoriaId && categorias.length > 0) {
      setForm((f) => ({ ...f, categoriaId: categorias[0].id }));
    }
  }, [editando, form.categoriaId, categorias]);

  function abrirEditar(p: Producto) {
    setForm({ nombre: p.nombre, categoriaId: p.categoriaId, precio: String(p.precio), imagenUrl: p.imagenUrl ?? "", descripcion: p.descripcion, stock: String(p.stock), destacado: p.destacado });
    setEditando(p.id);
    setNuevo(false);
    setError(null);
  }

  function abrirNuevo() {
    setForm({ ...EMPTY_FORM, categoriaId: categorias[0]?.id ?? "" });
    setEditando("new");
    setNuevo(true);
    setError(null);
  }

  async function guardar() {
    // Fallback por si categorias todavía no había cargado (onSnapshot async)
    // cuando se abrió el modal — el <select> se ve bien igual porque el
    // navegador muestra la primera opción aunque el value real sea "".
    const categoriaId = form.categoriaId || categorias[0]?.id || "";
    if (!categoriaId) {
      setError("No hay categorías cargadas todavía. Espera un segundo e intenta de nuevo.");
      return;
    }

    setGuardando(true);
    setError(null);
    const input = {
      nombre: form.nombre,
      categoriaId,
      precio: Number(form.precio),
      imagenUrl: form.imagenUrl.trim() ? form.imagenUrl.trim() : null,
      descripcion: form.descripcion,
      stock: Number(form.stock),
      destacado: form.destacado,
    };
    try {
      if (nuevo) {
        await catalogoApi.crearProducto(input);
      } else if (typeof editando === "string") {
        await catalogoApi.actualizarProducto(editando, input);
      }
      setEditando(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el producto");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: string) {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await catalogoApi.eliminarProducto(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar el producto");
    }
  }

  return (
    <>
      <div style={S.toolbar}>
        <button style={{ ...btnPrimary, width: "auto", padding: "10px 20px" }} onClick={abrirNuevo}>
          + Nuevo producto
        </button>
      </div>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Producto</th>
            <th style={th}>Categoría</th>
            <th style={th}>Precio</th>
            <th style={th}>Stock</th>
            <th style={th}>Destac.</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td style={td}>
                {p.imagenUrl ? <img src={p.imagenUrl} alt={p.nombre} style={S.thumbImg} /> : <span style={S.productCell}>👓</span>}
                {p.nombre}
              </td>
              <td style={td}>
                <span style={badge("azul")}>{categoriaLabel(p.categoriaId)}</span>
              </td>
              <td style={td}>
                <b>${p.precio}</b>
              </td>
              <td style={td}>{p.stock}</td>
              <td style={td}>{p.destacado ? "⭐" : "—"}</td>
              <td style={td}>
                <button onClick={() => abrirEditar(p)} style={Admin.actionBtn("edit")}>
                  Editar
                </button>
                <button onClick={() => eliminar(p.id)} style={Admin.actionBtn("delete")}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando !== null && (
        <div style={overlay} onClick={() => !guardando && setEditando(null)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalTitle}>{nuevo ? "Nuevo producto" : "Editar producto"}</div>
            {error && <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            {TEXT_FIELDS.map(([k, l]) => (
              <div key={k} style={formGroupFull}>
                <label style={label}>{l}</label>
                <input style={input} value={form[k] as string} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={formGroupFull}>
              <label style={label}>Categoría</label>
              <select style={select} value={form.categoriaId} onChange={(e) => setForm((f) => ({ ...f, categoriaId: e.target.value }))}>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={S.checkboxRow}>
              <input type="checkbox" checked={form.destacado} onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))} />
              <label style={label}>Producto destacado (aparece en el inicio)</label>
            </div>
            <button style={btnPrimary} onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </button>
            <button style={{ ...btnGhost, marginTop: 8 }} onClick={() => setEditando(null)} disabled={guardando}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
