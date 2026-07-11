import type { Cita, EstadoCita } from "../../types";
import { apiRequest } from "./http";

const BASE_URL = import.meta.env.VITE_CITAS_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiCitas";

export type CitaInput = Omit<Cita, "id" | "estado" | "nota">;

export const citasApi = {
  crearCita: (input: CitaInput) => apiRequest<Cita>(BASE_URL, "/citas", { method: "POST", body: JSON.stringify(input) }),
  // Back office: requiere sesión admin.
  listarCitas: () => apiRequest<Cita[]>(BASE_URL, "/citas"),
  actualizarEstadoCita: (id: string, estado: EstadoCita) => apiRequest<Cita>(BASE_URL, `/citas/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }),
};
