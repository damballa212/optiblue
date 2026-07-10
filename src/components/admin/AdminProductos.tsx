import { useState } from "react";
import type { Producto, CategoriaProducto } from "../../types";
import { btnPrimary, btnGhost, overlay, modal, modalTitle, formGroupFull, label, input, select, table, th, td, badge } from "../../styles/shared";
import * as Admin from "./Admin.styles";
import * as S from "./AdminProductos.styles";

interface AdminProductosProps {
  products: Producto[];
  setProducts: React.Dispatch<React.SetStateAction<Producto[]>>;
}

interface ProductoForm {
  nombre: string;
  categoria: CategoriaProducto;
  precio: string;
  imagen: string;
  descripcion: string;
  stock: string;
  destacado: boolean;
}

const EMPTY_FORM: ProductoForm = { nombre: "", categoria: "monturas", precio: "", imagen: "👓", descripcion: "", stock: "0", destacado: false };

const TEXT_FIELDS: [keyof ProductoForm, string][] = [
  ["nombre", "Nombre"],
  ["descripcion", "Descripción"],
  ["imagen", "Emoji / ícono"],
  ["precio", "Precio ($)"],
  ["stock", "Stock"],
];

export function AdminProductos({ products, setProducts }: AdminProductosProps) {
  const [editando, setEditando] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<ProductoForm>(EMPTY_FORM);
  const [nuevo, setNuevo] = useState(false);

  function abrirEditar(p: Producto) {
    setForm({ nombre: p.nombre, categoria: p.categoria, precio: String(p.precio), imagen: p.imagen, descripcion: p.descripcion, stock: String(p.stock), destacado: p.destacado });
    setEditando(p.id);
    setNuevo(false);
  }

  function abrirNuevo() {
    setForm(EMPTY_FORM);
    setEditando("new");
    setNuevo(true);
  }

  function guardar() {
    if (nuevo) {
      const producto: Producto = { id: Date.now(), nombre: form.nombre, categoria: form.categoria, precio: Number(form.precio), imagen: form.imagen, descripcion: form.descripcion, stock: Number(form.stock), destacado: form.destacado };
      setProducts((prev) => [...prev, producto]);
    } else {
      setProducts((prev) => prev.map((p) => (p.id === editando ? { ...p, nombre: form.nombre, categoria: form.categoria, precio: Number(form.precio), imagen: form.imagen, descripcion: form.descripcion, stock: Number(form.stock), destacado: form.destacado } : p)));
    }
    setEditando(null);
  }

  function eliminar(id: number) {
    if (window.confirm("¿Eliminar producto?")) setProducts((prev) => prev.filter((p) => p.id !== id));
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
          {products.map((p) => (
            <tr key={p.id}>
              <td style={td}>
                <span style={S.productCell}>{p.imagen}</span>
                {p.nombre}
              </td>
              <td style={td}>
                <span style={badge("azul")}>{p.categoria}</span>
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
        <div style={overlay} onClick={() => setEditando(null)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalTitle}>{nuevo ? "Nuevo producto" : "Editar producto"}</div>
            {TEXT_FIELDS.map(([k, l]) => (
              <div key={k} style={formGroupFull}>
                <label style={label}>{l}</label>
                <input style={input} value={form[k] as string} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={formGroupFull}>
              <label style={label}>Categoría</label>
              <select style={select} value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value as CategoriaProducto }))}>
                <option value="monturas">Monturas</option>
                <option value="solares">Lentes de sol</option>
                <option value="deporte">Deporte</option>
              </select>
            </div>
            <div style={S.checkboxRow}>
              <input type="checkbox" checked={form.destacado} onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))} />
              <label style={label}>Producto destacado (aparece en el inicio)</label>
            </div>
            <button style={btnPrimary} onClick={guardar}>
              Guardar
            </button>
            <button style={{ ...btnGhost, marginTop: 8 }} onClick={() => setEditando(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
