import {
  ExternalLink,
  LogOut,
  MapPin,
  Package,
  ChevronRight,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../lib/auth/firebaseAuth";
import styles from "../ui/AdminLayout.module.css";

export function AdminMorePage() {
  const navigate = useNavigate();
  async function logout() {
    await signOut(auth);
    navigate("/admin/login");
  }
  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        <div>
          <span>Configuración</span>
          <h2>Más</h2>
          <p>Mantenimiento y acceso</p>
        </div>
      </div>
      <div className={styles.moreGroup}>
        <h3>Operación</h3>
        <Link to="/admin/catalogo">
          <Package aria-hidden="true" />
          <span>
            <strong>Catálogo</strong>
            <small>Productos y categorías</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </Link>
        <Link to="/admin/sedes">
          <MapPin aria-hidden="true" />
          <span>
            <strong>Sedes</strong>
            <small>Dirección, contacto, horario y mapa</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.moreGroup}>
        <h3>Acceso</h3>
        <button
          type="button"
          onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
        >
          <ExternalLink aria-hidden="true" />
          <span>
            <strong>Ver sitio público</strong>
            <small>Abrir storefront en otra pestaña</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
        <button type="button" className={styles.logoutRow} onClick={logout}>
          <LogOut aria-hidden="true" />
          <span>
            <strong>Cerrar sesión</strong>
            <small>Finalizar acceso administrativo</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
