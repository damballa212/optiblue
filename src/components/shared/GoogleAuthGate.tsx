import { useState, type ReactNode } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../lib/auth/AuthContext";
import { btnGhost, formGroupFull } from "../../styles/shared";
import { colors } from "../../styles/tokens";

interface GoogleAuthGateProps {
  children: ReactNode;
}

// Gate in-context: el catálogo sigue 100% público, esto solo aparece en el
// momento de reservar/cotizar/agendar (dentro del modal correspondiente),
// no como una página de login aparte para clientes (decisión 2026-07-11).
export function GoogleAuthGate({ children }: GoogleAuthGateProps) {
  const { user, loading } = useAuth();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;
  if (user) return <>{children}</>;

  async function iniciarSesion() {
    setEnviando(true);
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      // Log del error real para diagnóstico — el mensaje a la persona queda
      // genérico a propósito, pero no hay que tragarse la causa real.
      console.error("Google sign-in falló:", e);
      setError("No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={formGroupFull}>
      <p style={{ fontSize: 13, color: colors.slate500, marginBottom: 12 }}>Inicia sesión con Google para continuar.</p>
      {error && <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button style={btnGhost} onClick={iniciarSesion} disabled={enviando}>
        {enviando ? "Conectando…" : "🔵 Continuar con Google"}
      </button>
    </div>
  );
}
