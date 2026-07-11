import type { Sede } from "../../types";

const BASE_URL = import.meta.env.VITE_SEDES_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiSedes";

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

export type SedeInput = Omit<Sede, "id">;

export const sedesApi = {
  crearSede: (input: SedeInput) => request<Sede>("/sedes", { method: "POST", body: JSON.stringify(input) }),
  actualizarSede: (id: string, input: SedeInput) => request<Sede>(`/sedes/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  eliminarSede: (id: string) => request<null>(`/sedes/${id}`, { method: "DELETE" }),
};
