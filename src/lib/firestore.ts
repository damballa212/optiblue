import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";

// Persistencia offline (IndexedDB) para que catálogo/sedes/servicios sigan
// visibles sin red con los últimos datos vistos (onSnapshot los sirve desde
// caché). Solo lecturas públicas se benefician de esto; las escrituras
// (pedidos/citas/cotizaciones) siguen requiriendo red, sin cola offline.
export const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
