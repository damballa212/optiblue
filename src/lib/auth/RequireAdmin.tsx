import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "./RequireAdmin.module.css";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div
        className={styles.gate}
        role="status"
        aria-label="Verificando sesión"
        aria-busy="true"
      >
        <header>
          <span>
            <i />
          </span>
          <strong>OPTIBLUE ADMIN</strong>
        </header>
        <main>
          <div className={styles.heading} />
          <div className={styles.summary}>
            <i />
            <i />
            <i />
          </div>
          <div className={styles.rows}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </main>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
