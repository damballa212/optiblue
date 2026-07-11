import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as S from "./NavBar.styles";

export type PageKey = "home" | "productos" | "lentes" | "servicios" | "sedes";

interface NavBarProps {
  setPage: (page: PageKey) => void;
}

const LINKS: { key: PageKey; label: string; path: string }[] = [
  { key: "home", label: "Inicio", path: "/" },
  { key: "productos", label: "Catálogo", path: "/catalogo" },
  { key: "lentes", label: "Lentes adaptados", path: "/lentes" },
  { key: "servicios", label: "Oftalmología", path: "/servicios" },
  { key: "sedes", label: "Sedes", path: "/sedes" },
];

export function NavBar({ setPage }: NavBarProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function goTo(key: PageKey) {
    setPage(key);
    setMenuOpen(false);
  }

  return (
    <nav style={S.nav}>
      <button style={S.navLogo} onClick={() => goTo("home")} aria-label="Ir al inicio">
        <div style={S.navLogoCircle}>👁</div>
        <span style={S.navBrand}>
          Opti<span style={S.navBrandBlue}>Blue</span>
        </span>
      </button>
      {isMobile ? (
        <>
          <button style={S.menuButton} onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-nav">
            Menú
          </button>
          {menuOpen && (
            <div id="mobile-nav" style={S.mobileMenu}>
              {LINKS.map((l) => (
                <button key={l.key} style={S.mobileNavLink(location.pathname === l.path)} onClick={() => goTo(l.key)}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={S.navLinks}>
          {LINKS.map((l) => (
            <button key={l.key} style={S.navLink(location.pathname === l.path)} onClick={() => goTo(l.key)}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
