import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Sede } from "../types";

export function useSedes(): { sedes: Sede[]; loading: boolean; error: string | null } {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "sedes"),
      (snapshot) => {
        setSedes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Sede));
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

  return { sedes, loading, error };
}
