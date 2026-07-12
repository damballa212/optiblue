import { useState } from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/auth/firebaseAuth";
import { useAuth } from "../lib/auth/AuthContext";
import styles from "./AdminLogin.module.css";

// Página standalone — a propósito no comparte NavBar/Footer del sitio
// público. Solo login: no hay "crear cuenta" acá (ver core/auth.ts del
// backend — el único camino para volverse admin es el script de bootstrap).
export function AdminLogin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin/hoy" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/hoy");
    } catch {
      // Mensaje genérico a propósito: no revelar si el email existe o no.
      setError("Correo o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.brandPanel}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <i />
          </span>
          <span>OPTIBLUE</span>
        </div>
        <div className={styles.brandMessage}>
          <ShieldCheck aria-hidden="true" />
          <h1>Operación diaria</h1>
          <p>Acceso reservado al personal autorizado de OptiBlue.</p>
        </div>
        <small>Panel administrativo</small>
      </aside>
      <main className={styles.loginArea}>
        <div className={styles.mobileBrand}>
          <span className={styles.brandMark}>
            <i />
          </span>
          <strong>OPTIBLUE ADMIN</strong>
        </div>
        <section
          className={styles.loginForm}
          aria-labelledby="admin-login-title"
        >
          <span className={styles.eyebrow}>Acceso administrativo</span>
          <h2 id="admin-login-title">Iniciar sesión</h2>
          <p>Usa las credenciales asignadas para gestionar la operación.</p>

          {error && (
            <div className={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              <span>Correo</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                inputMode="email"
                autoFocus
              />
            </label>
            <label>
              <span>Contraseña</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            <button type="submit" disabled={enviando}>
              <LockKeyhole aria-hidden="true" />
              {enviando ? "Ingresando..." : "Ingresar al panel"}
            </button>
          </form>

          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            Volver al sitio público
          </Link>
        </section>
      </main>
    </div>
  );
}
