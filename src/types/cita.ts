export type EstadoCita = "pendiente" | "confirmada" | "completada" | "cancelada";

export interface Cita {
  id: number;
  nombre: string;
  telefono: string;
  sede: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
  nota: string;
}
