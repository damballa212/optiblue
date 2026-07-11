import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Categoria } from "../types";

export function useCategorias(): { categorias: Categoria[]; loading: boolean; error: string | null } {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "categorias"), orderBy("orden"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCategorias(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Categoria));
        setError(null);
        setLoading(false);
      },
      (firestoreError) => {
        setError(firestoreError.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  return { categorias, loading, error };
}
