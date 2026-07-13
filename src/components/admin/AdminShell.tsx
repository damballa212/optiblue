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
import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/auth/firebaseAuth";
import { useAdminOperations } from "./data/AdminOperationsContext";
import { AdminPushToast } from "./notifications/AdminPushToast";
import { deactivateAdminPush, reconcileAdminPushToken } from "../../lib/push/deviceToken";
import { openStorefront } from "../../lib/appUrls";
import {
  getAdminPrimaryTab,
  getAdminRouteTitle,
  type AdminPrimaryTab,
} from "./domain/presentation";
import styles from "./ui/AdminLayout.module.css";
import polish from "./ui/AdminPolish.module.css";

interface AdminNavItem {
  to: string;
  label: string;
  shortLabel?: string;
  icon: typeof Home;
  count: "all" | "pedidos" | "citas" | "cotizaciones" | null;
  tab: AdminPrimaryTab;
}

const NAV_ITEMS: AdminNavItem[] = [
  { to: "/admin/hoy", label: "Hoy", icon: Home, count: "all", tab: "hoy" },
  {
    to: "/admin/pedidos",
    label: "Pedidos",
    icon: ShoppingBag,
    count: "pedidos",
    tab: "pedidos",
  },
  { to: "/admin/citas", label: "Citas", icon: CalendarDays, count: "citas", tab: "citas" },
  {
    to: "/admin/cotizaciones",
    label: "Cotizaciones",
    shortLabel: "Cotiza.",
    icon: FileText,
    count: "cotizaciones",
    tab: "cotizaciones",
  },
  { to: "/admin/mas", label: "Más", icon: MoreHorizontal, count: null, tab: "mas" },
];

export function AdminShell() {
  const { pedidos, citas, cotizaciones } = useAdminOperations();
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const activeTab = getAdminPrimaryTab(location.pathname);
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

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    if (
      activeTab === "pedidos" ||
      activeTab === "citas" ||
      activeTab === "cotizaciones"
    ) {
      window.sessionStorage.setItem(
        `optiblue-admin-tab-${activeTab}`,
        `${location.pathname}${location.search}`,
      );
    }
  }, [activeTab, location.pathname, location.search]);

  useEffect(() => {
    void reconcileAdminPushToken().catch(() => undefined);
  }, []);

  const destinationFor = (item: AdminNavItem) => {
    if (
      item.tab === "pedidos" ||
      item.tab === "citas" ||
      item.tab === "cotizaciones"
    )
      return window.sessionStorage.getItem(`optiblue-admin-tab-${item.tab}`) ?? item.to;
    return item.to;
  };

  async function logout() {
    await deactivateAdminPush();
    await signOut(auth);
    navigate("/admin/login");
  }

  return (
    <div className={styles.adminShell}>
      <AdminPushToast />
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
          {NAV_ITEMS.map(({ to, label, icon: Icon, count, tab }) => (
            <NavLink
              key={to}
              to={destinationFor({ to, label, icon: Icon, count, tab })}
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
            onClick={openStorefront}
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
          <span className={styles.mobileBrandMark} aria-hidden="true"><i /></span>
          <span className={styles.mobileBrand}>OPTIBLUE ADMIN</span>
        </header>
        <header className={styles.desktopHeader}>
          <strong>Operación diaria</strong>
          <span>{getAdminRouteTitle(location.pathname)}</span>
        </header>
        <main className={styles.adminMain} ref={mainRef}>
          <Outlet />
        </main>
        <nav
          className={styles.bottomNav}
          aria-label="Navegación administrativa móvil"
        >
          {NAV_ITEMS.map(({ to, label, shortLabel, icon: Icon, count, tab }) => {
            const isCurrent = activeTab === tab;
            return (
            <Link
              key={to}
              to={destinationFor({ to, label, shortLabel, icon: Icon, count, tab })}
              className={isCurrent ? styles.bottomActive : undefined}
              aria-current={isCurrent ? "page" : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              {count && countFor(count) > 0 && (
                <b className={polish.pendingCount}>{countFor(count)}</b>
              )}
              <span>{shortLabel ?? label}</span>
            </Link>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
