import { useSedes } from "../../hooks/useSedes";
import type { PageKey } from "./NavBar";
import * as S from "./Footer.styles";

interface FooterProps {
  setPage: (page: PageKey) => void;
}

const CATALOGO_LINKS = ["Monturas", "Lentes de sol", "Deporte", "Lentes adaptados"];

export function Footer({ setPage }: FooterProps) {
  const { sedes, loading, error } = useSedes();
  const year = new Date().getFullYear();

  return (
    <footer style={S.footer}>
      <div style={S.inner}>
        <div style={S.columns}>
          <div>
            <div style={S.brand}>👁 OptiBlue</div>
            <div style={S.brandDesc}>Tu óptica de confianza en Venezuela. Tecnología, estilo y salud visual en un solo lugar.</div>
          </div>
          <div>
            <div style={S.colTitle}>Catálogo</div>
            {CATALOGO_LINKS.map((l) => (
              <div key={l} style={S.colLink} onClick={() => setPage(l === "Lentes adaptados" ? "lentes" : "productos")}>
                {l}
              </div>
            ))}
          </div>
          <div>
            <div style={S.colTitle}>Sedes</div>
            {loading && <div style={S.colText}>Cargando sedes...</div>}
            {!loading && error && <div style={S.colText}>Sedes por confirmar</div>}
            {!loading && !error && sedes.length === 0 && <div style={S.colText}>Sedes por confirmar</div>}
            {!loading &&
              !error &&
              sedes.map((s) => (
                <div key={s.id} style={S.colText}>
                  📍 {s.ciudad}
                </div>
              ))}
          </div>
          <div>
            <div style={S.colTitle}>Contacto</div>
            <div style={S.colText}>💬 WhatsApp disponible</div>
            <div style={S.colText}>📅 Citas en línea</div>
            <div style={S.colText}>Lun–Sáb 9am–7pm</div>
          </div>
        </div>
        <div style={S.bottom}>© {year} OptiBlue · Todos los derechos reservados</div>
      </div>
    </footer>
  );
}
