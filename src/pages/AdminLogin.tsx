import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../lib/auth/AuthContext";
import * as S from "./AdminLogin.styles";

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
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch {
      // Mensaje genérico a propósito: no revelar si el email existe o no.
      setError("Correo o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.brand}>
          <div style={S.brandCircle}>👁</div>
          <span style={S.brandText}>
            Opti<span style={S.brandBlue}>Blue</span>
          </span>
        </div>
        <div style={S.title}>Panel de administración</div>
        <div style={S.subtitle}>Iniciá sesión para gestionar el catálogo, pedidos y citas.</div>

        {error && <div style={S.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={S.formGroup}>
            <label style={S.label}>Correo</label>
            <input style={S.input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Contraseña</label>
            <input style={S.input} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button style={S.submitBtn} type="submit" disabled={enviando}>
            {enviando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <Link to="/" style={S.backLink}>
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}
