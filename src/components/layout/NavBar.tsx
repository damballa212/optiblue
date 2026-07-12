import { useEffect, useRef, useState } from "react";
import { FileText, Glasses, Home, MapPin, Menu, MessageCircle, Stethoscope, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BrandMark } from "../brand/BrandMark";
import styles from "./NavBar.module.css";

export type PageKey = "home" | "productos" | "lentes" | "servicios" | "sedes";

const LINKS = [
  { label: "Catálogo", path: "/catalogo" },
  { label: "Lentes adaptados", path: "/lentes" },
  { label: "Servicios", path: "/servicios" },
  { label: "Sedes", path: "/sedes" },
];

const MOBILE_LINKS = [
  { label: "Inicio", path: "/", icon: Home },
  { label: "Catálogo", path: "/catalogo", icon: Glasses },
  { label: "Cotizar", path: "/lentes", icon: FileText },
  { label: "Sedes", path: "/sedes", icon: MapPin },
];

export function NavBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link className={styles.brandLink} to="/" aria-label="OptiBlue, ir al inicio">
            <BrandMark />
          </Link>
          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {LINKS.map((link) => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link className={styles.assistance} to="/lentes">
            <MessageCircle size={17} aria-hidden="true" /> Solicitar asesoría
          </Link>
          <button ref={menuButtonRef} className={styles.menuButton} type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label="Abrir menú">
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.drawerOverlay} onMouseDown={(event) => event.target === event.currentTarget && setMenuOpen(false)}>
          <aside className={styles.drawer} id="mobile-menu" aria-label="Menú móvil">
            <div className={styles.drawerHeader}>
              <BrandMark compact />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
                <X aria-hidden="true" />
              </button>
            </div>
            <nav>
              <NavLink to="/" className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ""}`}>
                <Home aria-hidden="true" /> Inicio
              </NavLink>
              <NavLink to="/catalogo" className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ""}`}>
                <Glasses aria-hidden="true" /> Catálogo
              </NavLink>
              <NavLink to="/lentes" className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ""}`}>
                <FileText aria-hidden="true" /> Lentes adaptados
              </NavLink>
              <NavLink to="/servicios" className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ""}`}>
                <Stethoscope aria-hidden="true" /> Servicios
              </NavLink>
              <NavLink to="/sedes" className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ""}`}>
                <MapPin aria-hidden="true" /> Sedes
              </NavLink>
            </nav>
            <div className={styles.drawerFooter}>
              <span>Atención en</span>
              <strong>Barinas · Acarigua · Barquisimeto</strong>
            </div>
          </aside>
        </div>
      )}

      <nav className={styles.bottomNav} aria-label="Navegación móvil">
        {MOBILE_LINKS.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === "/"} className={({ isActive }) => `${styles.bottomLink} ${isActive ? styles.bottomActive : ""}`}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
