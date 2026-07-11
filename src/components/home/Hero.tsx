import type { PageKey } from "../layout/NavBar";
import * as S from "./Hero.styles";

interface HeroProps {
  setPage: (page: PageKey) => void;
}

const SEDES = ["Barinas", "Acarigua", "Barquisimeto"];

export function Hero({ setPage }: HeroProps) {
  return (
    <div style={S.hero}>
      <div style={S.heroTag}>Barinas · Acarigua · Barquisimeto</div>
      <h1 style={S.heroH1}>
        Ve el mundo con claridad.
        <br />
        Estilo que te define.
      </h1>
      <p style={S.heroSub}>Óptica y oftalmología con atención por sede, cotización de lentes adaptados y contacto directo por WhatsApp.</p>
      <div style={S.heroBtns}>
        <button style={S.btnHeroP} onClick={() => setPage("productos")}>
          Ver catálogo
        </button>
        <button style={S.btnHeroS} onClick={() => setPage("lentes")}>
          Cotizar mis lentes
        </button>
      </div>
      <div style={S.highlights}>
        {SEDES.map((sede) => (
          <div key={sede} style={S.highlightItem}>
            {sede}
          </div>
        ))}
      </div>
    </div>
  );
}
