import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Producto } from "../types";

// Lectura directa de Firestore (SDK cliente) — sin pasar por Functions.
// onSnapshot mantiene la lista al día sola: tras un create/update/delete
// vía catalogoApi, este hook refleja el cambio sin recargar la página.
export function useProductos(): { productos: Producto[]; loading: boolean } {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      setProductos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Producto));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { productos, loading };
}
