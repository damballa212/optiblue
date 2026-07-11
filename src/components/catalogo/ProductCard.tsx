import type { Producto } from "../../types";
import { card, btnPrimary } from "../../styles/shared";
import * as S from "./ProductCard.styles";

interface ProductCardProps {
  p: Producto;
  categoriaLabel: string;
  onReservar: (producto: Producto) => void;
}

export function ProductCard({ p, categoriaLabel, onReservar }: ProductCardProps) {
  return (
    <div style={card}>
      {p.imagenUrl ? <img src={p.imagenUrl} alt={p.nombre} style={S.cardImgReal} /> : <div style={S.cardImg}>👓</div>}
      <div style={S.cardBody}>
        <div style={S.cardCat}>{categoriaLabel}</div>
        <div style={S.cardName}>{p.nombre}</div>
        <div style={S.cardDesc}>{p.descripcion}</div>
        <div style={S.cardPrice}>${p.precio}</div>
        <button style={btnPrimary} onClick={() => onReservar(p)}>
          📅 Reservar
        </button>
        <div style={S.cardFootnote}>Te redirigimos a WhatsApp</div>
      </div>
    </div>
  );
}
