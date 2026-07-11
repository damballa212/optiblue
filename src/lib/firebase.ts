import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Config mínima: el frontend solo LEE Firestore directo (SDK cliente).
// Toda escritura pasa por Cloud Functions — ver src/lib/api/catalogo.ts.
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "demo-optiblue",
  // Firebase Auth exige un apiKey no vacío incluso contra el emulador
  // (no se valida ahí, solo contra un proyecto real en producción).
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "demo-api-key",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}
