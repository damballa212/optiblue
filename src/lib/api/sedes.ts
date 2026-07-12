import type { Sede } from "../../types";
import { apiRequest } from "./http";

const BASE_URL = import.meta.env.VITE_SEDES_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiSedes";

export type SedeInput = Omit<Sede, "id">;

export const sedesApi = {
  crearSede: (input: SedeInput) => apiRequest<Sede>(BASE_URL, "/sedes", { method: "POST", body: JSON.stringify(input) }, true),
  actualizarSede: (id: string, input: SedeInput) => apiRequest<Sede>(BASE_URL, `/sedes/${id}`, { method: "PUT", body: JSON.stringify(input) }, true),
  eliminarSede: (id: string) => apiRequest<null>(BASE_URL, `/sedes/${id}`, { method: "DELETE" }, true),
};
