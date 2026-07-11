import type { Cita, EstadoCita } from "../../types";

const BASE_URL = import.meta.env.VITE_CITAS_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiCitas";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error ?? "Error de red al comunicarse con el servidor");
  }
  return body.data as T;
}

export type CitaInput = Omit<Cita, "id" | "estado" | "nota">;

export const citasApi = {
  crearCita: (input: CitaInput) => request<Cita>("/citas", { method: "POST", body: JSON.stringify(input) }),
  // /citas no es de lectura pública en Firestore, el admin lee vía esta Function.
  listarCitas: () => request<Cita[]>("/citas"),
  actualizarEstadoCita: (id: string, estado: EstadoCita) => request<Cita>(`/citas/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }),
};
