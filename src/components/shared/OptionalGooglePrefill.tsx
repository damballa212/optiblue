import { LogIn } from "lucide-react";
import { useState } from "react";
import styles from "./OptionalGooglePrefill.module.css";

interface OptionalGooglePrefillProps {
  onName: (name: string) => void;
}

export function OptionalGooglePrefill({ onName }: OptionalGooglePrefillProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    try {
      const [{ GoogleAuthProvider, signInWithPopup }, { auth }] = await Promise.all([import("firebase/auth"), import("../../lib/auth/firebaseAuth")]);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if (result.user.displayName) onName(result.user.displayName);
    } catch {
      setError("No pudimos completar el nombre con Google. Puedes continuar con el formulario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <button type="button" onClick={signIn} disabled={loading}>
        <LogIn size={17} aria-hidden="true" /> {loading ? "Conectando..." : "Completar nombre con Google"}
      </button>
      <span>Opcional. El teléfono sigue siendo necesario.</span>
      {error && <p role="status">{error}</p>}
    </div>
  );
}
