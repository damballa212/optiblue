import { useState } from "react";
import type { Producto } from "../../types";
import { CATEGORIAS } from "../../data";
import type { CategoriaFiltro } from "../../types";
import { section, sectionTag, sectionH2, sectionSub, grid } from "../../styles/shared";
import { colors } from "../../styles/tokens";
import * as S from "./PageProductos.styles";
import { ProductCard } from "./ProductCard";
import { ReservaModal } from "./ReservaModal";

interface PageProductosProps {
  products: Producto[];
}

export function PageProductos({ products }: PageProductosProps) {
  const [cat, setCat] = useState<CategoriaFiltro>("todos");
  const [modal, setModal] = useState<Producto | null>(null);
  const filtered = cat === "todos" ? products : products.filter((p) => p.categoria === cat);

  return (
    <div style={section}>
      <div style={sectionTag}>Catálogo</div>
      <h2 style={sectionH2}>Encuentra tu estilo</h2>
      <p style={sectionSub}>Explora nuestra colección de monturas, lentes de sol y equipos deportivos.</p>
      <div style={S.filterRow}>
        {CATEGORIAS.map((c) => (
          <button key={c.key} style={S.filterBtn(cat === c.key)} onClick={() => setCat(c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: colors.slate400 }}>No hay productos en esta categoría.</p>
      ) : (
        <div style={grid(220)}>
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onReservar={setModal} />
          ))}
        </div>
      )}
      {modal && <ReservaModal producto={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
