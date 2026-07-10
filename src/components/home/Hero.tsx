import type { PageKey } from "../layout/NavBar";
import * as S from "./Hero.styles";

interface HeroProps {
  setPage: (page: PageKey) => void;
}

const HIGHLIGHTS: [string, string][] = [
  ["👓", "+500 modelos"],
  ["🏆", "15 años de experiencia"],
  ["📍", "3 ciudades"],
  ["⭐", "4.9 en Google"],
];

export function Hero({ setPage }: HeroProps) {
  return (
    <div style={S.hero}>
      <div style={S.heroTag}>3 sedes en Venezuela 🇻🇪</div>
      <h1 style={S.heroH1}>
        Ve el mundo con claridad.
        <br />
        Estilo que te define.
      </h1>
      <p style={S.heroSub}>Monturas premium, lentes adaptados a tu graduación y atención oftalmológica de primera en Caracas, Valencia y Maracaibo.</p>
      <div style={S.heroBtns}>
        <button style={S.btnHeroP} onClick={() => setPage("productos")}>
          Ver catálogo
        </button>
        <button style={S.btnHeroS} onClick={() => setPage("lentes")}>
          Cotizar mis lentes
        </button>
      </div>
      <div style={S.highlights}>
        {HIGHLIGHTS.map(([ic, t]) => (
          <div key={t} style={S.highlightItem}>
            <div style={S.highlightIcon}>{ic}</div>
            <div style={S.highlightText}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
