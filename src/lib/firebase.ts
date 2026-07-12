import { initializeApp } from "firebase/app";

// Config mínima: el frontend solo LEE Firestore directo (SDK cliente).
// Toda escritura pasa por Cloud Functions — ver src/lib/api/catalogo.ts.
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "demo-optiblue";

const firebaseConfig = {
  projectId,
  // Firebase Auth exige un apiKey no vacío incluso contra el emulador
  // (no se valida ahí, solo contra un proyecto real en producción).
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "demo-api-key",
  // Requerido por signInWithPopup/redirect (Google, etc.) — sin esto
  // Firebase no puede armar la página de OAuth y tira
  // auth/auth-domain-config-required. No hace falta contra el emulador
  // (por eso nunca se notó hasta probar Google Sign-In en producción).
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? `${projectId}.firebaseapp.com`,
};

export const firebaseApp = initializeApp(firebaseConfig);
