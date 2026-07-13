import type { DesregistrarTokenInput, RegistrarTokenInput } from "../../types";
import { apiRequest } from "./http";

const BASE_URL = import.meta.env.VITE_NOTIFICACIONES_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiNotificaciones";

// Ambos requieren sesión admin (backend: core/auth.ts) — un dispositivo solo
// gestiona su propio token de push.
export const notificacionesApi = {
  registrarToken: (input: RegistrarTokenInput) => apiRequest<null>(BASE_URL, "/tokens", { method: "POST", body: JSON.stringify(input) }, true),
  desregistrarToken: (input: DesregistrarTokenInput) => apiRequest<null>(BASE_URL, "/tokens", { method: "DELETE", body: JSON.stringify(input) }, true),
};
