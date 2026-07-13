// Espejo de src/types/notificacion.ts en optiblue-backend (Zod).
export interface RegistrarTokenInput {
  token: string;
  userAgent?: string;
}

export interface DesregistrarTokenInput {
  token: string;
}
