export type EstadoCita = "pendiente" | "confirmada" | "completada" | "cancelada";

export interface Cita {
  id: string;
  nombre: string;
  telefono: string;
  sedeId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
  nota: string;
}
