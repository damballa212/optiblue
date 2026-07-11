import { useState } from "react";
import type { Producto, CategoriaFiltro } from "../../types";
import { useProductos } from "../../hooks/useProductos";
import { useCategorias } from "../../hooks/useCategorias";
import { section, sectionTag, sectionH2, sectionSub, grid } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import * as S from "./PageProductos.styles";
import { ProductCard } from "./ProductCard";
import { ReservaModal } from "./ReservaModal";

export function PageProductos() {
  const { productos } = useProductos();
  const { categorias } = useCategorias();
  const [cat, setCat] = useState<CategoriaFiltro>("todos");
  const [modal, setModal] = useState<Producto | null>(null);

  const filtered = cat === "todos" ? productos : productos.filter((p) => p.categoriaId === cat);
  const categoriaLabel = (categoriaId: string) => categorias.find((c) => c.id === categoriaId)?.label ?? "Producto";

  return (
    <div style={section}>
      <div style={sectionTag}>Catálogo</div>
      <h2 style={sectionH2}>Encuentra tu estilo</h2>
      <p style={sectionSub}>Explora nuestra colección de monturas, lentes de sol y equipos deportivos.</p>
      <div style={S.filterRow}>
        <button style={S.filterBtn(cat === "todos")} onClick={() => setCat("todos")}>
          Todo
        </button>
        {categorias.map((c) => (
          <button key={c.id} style={S.filterBtn(cat === c.id)} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: colors.slate400 }}>No hay productos en esta categoría.</p>
      ) : (
        <div style={grid(220)}>
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} categoriaLabel={categoriaLabel(p.categoriaId)} onReservar={setModal} />
          ))}
        </div>
      )}
      {modal && <ReservaModal producto={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
