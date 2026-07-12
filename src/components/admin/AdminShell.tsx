import {
  CalendarDays,
  Eye,
  FileText,
  Home,
  LogOut,
  MapPin,
  MoreHorizontal,
  Package,
  ShoppingBag,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/auth/firebaseAuth";
import { useAdminOperations } from "./data/AdminOperationsContext";
import styles from "./ui/AdminLayout.module.css";
import polish from "./ui/AdminPolish.module.css";

interface AdminNavItem {
  to: string;
  label: string;
  shortLabel?: string;
  icon: typeof Home;
  count: "all" | "pedidos" | "citas" | "cotizaciones" | null;
}

const NAV_ITEMS: AdminNavItem[] = [
  { to: "/admin/hoy", label: "Hoy", icon: Home, count: "all" },
  {
    to: "/admin/pedidos",
    label: "Pedidos",
    icon: ShoppingBag,
    count: "pedidos",
  },
  { to: "/admin/citas", label: "Citas", icon: CalendarDays, count: "citas" },
  {
    to: "/admin/cotizaciones",
    label: "Cotizaciones",
    shortLabel: "Cotiza.",
    icon: FileText,
    count: "cotizaciones",
  },
  { to: "/admin/mas", label: "Más", icon: MoreHorizontal, count: null },
];

const TITLES: Record<string, string> = {
  "/admin/hoy": "Hoy",
  "/admin/pedidos": "Pedidos",
  "/admin/citas": "Citas",
  "/admin/cotizaciones": "Cotizaciones",
  "/admin/catalogo": "Catálogo",
  "/admin/sedes": "Sedes",
  "/admin/mas": "Más",
};

export function AdminShell() {
  const { pedidos, citas, cotizaciones } = useAdminOperations();
  const location = useLocation();
  const navigate = useNavigate();
  const counts = {
    pedidos: pedidos.filter((item) => item.estado === "pendiente").length,
    citas: citas.filter((item) => item.estado === "pendiente").length,
    cotizaciones: cotizaciones.filter((item) => item.estado === "pendiente")
      .length,
  };
  const countFor = (key: AdminNavItem["count"]) =>
    key === "all"
      ? counts.pedidos + counts.citas + counts.cotizaciones
      : key
        ? counts[key]
        : 0;

  async function logout() {
    await signOut(auth);
    navigate("/admin/login");
  }

  return (
    <div className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}>
            <i />
          </span>
          <div>
            <strong>OPTIBLUE</strong>
            <small>ADMIN</small>
          </div>
        </div>
        <nav aria-label="Navegación administrativa">
          {NAV_ITEMS.map(({ to, label, icon: Icon, count }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? styles.navActive : undefined
              }
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
              {count && countFor(count) > 0 && (
                <b className={polish.pendingCount}>{countFor(count)}</b>
              )}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarTools}>
          <NavLink to="/admin/catalogo">
            <Package size={19} aria-hidden="true" />
            <span>Catálogo</span>
          </NavLink>
          <NavLink to="/admin/sedes">
            <MapPin size={19} aria-hidden="true" />
            <span>Sedes</span>
          </NavLink>
          <button
            type="button"
            onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
          >
            <Eye size={19} aria-hidden="true" />
            Ver sitio
          </button>
          <button type="button" onClick={logout}>
            <LogOut size={19} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <section className={styles.adminWorkspace}>
        <header className={styles.mobileHeader}>
          <div>
            <span className={styles.mobileBrand}>OPTIBLUE ADMIN</span>
            <h1>{TITLES[location.pathname] ?? "Administracion"}</h1>
          </div>
        </header>
        <header className={styles.desktopHeader}>
          <strong>Operación diaria</strong>
          <span>{TITLES[location.pathname] ?? "Administración"}</span>
        </header>
        <main className={styles.adminMain}>
          <Outlet />
        </main>
        <nav
          className={styles.bottomNav}
          aria-label="Navegación administrativa móvil"
        >
          {NAV_ITEMS.map(({ to, label, shortLabel, icon: Icon, count }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? styles.bottomActive : undefined
              }
            >
              <Icon size={20} aria-hidden="true" />
              {count && countFor(count) > 0 && (
                <b className={polish.pendingCount}>{countFor(count)}</b>
              )}
              <span>{shortLabel ?? label}</span>
            </NavLink>
          ))}
        </nav>
      </section>
    </div>
  );
}
