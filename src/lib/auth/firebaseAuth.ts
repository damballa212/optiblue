import { connectAuthEmulator, getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase";

export const auth = getAuth(firebaseApp);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}
