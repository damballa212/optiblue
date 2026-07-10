import type { Producto } from "../../types";
import { card, btnPrimary } from "../../styles/shared";
import * as S from "./ProductCard.styles";

const CATEGORIA_LABEL: Record<Producto["categoria"], string> = {
  monturas: "Montura",
  solares: "Lente solar",
  deporte: "Deporte",
};

interface ProductCardProps {
  p: Producto;
  onReservar: (producto: Producto) => void;
}

export function ProductCard({ p, onReservar }: ProductCardProps) {
  return (
    <div style={card}>
      <div style={S.cardImg}>{p.imagen}</div>
      <div style={S.cardBody}>
        <div style={S.cardCat}>{CATEGORIA_LABEL[p.categoria]}</div>
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
