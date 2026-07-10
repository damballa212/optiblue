import * as S from "./NavBar.styles";

export type PageKey = "home" | "productos" | "lentes" | "servicios" | "sedes";

interface NavBarProps {
  page: PageKey;
  setPage: (page: PageKey) => void;
  onAdmin: () => void;
}

const LINKS: { key: PageKey; label: string }[] = [
  { key: "home", label: "Inicio" },
  { key: "productos", label: "Catálogo" },
  { key: "lentes", label: "Lentes adaptados" },
  { key: "servicios", label: "Oftalmología" },
  { key: "sedes", label: "Sedes" },
];

export function NavBar({ page, setPage, onAdmin }: NavBarProps) {
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
          <button key={l.key} style={S.navLink(page === l.key)} onClick={() => setPage(l.key)}>
            {l.label}
          </button>
        ))}
        <button style={S.adminBtn} onClick={onAdmin}>
          ⚙ Panel
        </button>
      </div>
    </nav>
  );
}
