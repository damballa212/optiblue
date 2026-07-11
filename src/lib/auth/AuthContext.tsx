import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, isAdmin: false, loading: true });

// Un solo Firebase Auth para todo el sitio — clientes (Google) y admin
// (correo/contraseña) comparten la misma instancia. Lo que los separa es
// autorización, no infraestructura: `isAdmin` depende del custom claim
// `admin:true`, asignado a mano (ver backend scripts/set-admin-claim.ts),
// nunca autoasignable por el usuario.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAdmin: false, loading: true });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, isAdmin: false, loading: false });
        return;
      }
      const tokenResult = await user.getIdTokenResult();
      setState({ user, isAdmin: tokenResult.claims.admin === true, loading: false });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
