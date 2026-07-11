import { Link, useLocation } from "react-router-dom";
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

  return (
    <nav style={S.nav}>
      <div style={S.navLogo} onClick={() => setPage("home")}>
        <div style={S.navLogoCircle}>👁</div>
        <span style={S.navBrand}>
          Opti<span style={S.navBrandBlue}>Blue</span>
        </span>
      </div>
      <div style={S.navLinks}>
        {LINKS.map((l) => (
          <button key={l.key} style={S.navLink(location.pathname === l.path)} onClick={() => setPage(l.key)}>
            {l.label}
          </button>
        ))}
        <Link to="/admin" style={S.adminBtn}>
          ⚙ Panel
        </Link>
      </div>
    </nav>
  );
}
