import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Sede } from "../types";

export function useSedes(): { sedes: Sede[]; loading: boolean } {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sedes"), (snapshot) => {
      setSedes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Sede));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { sedes, loading };
}
