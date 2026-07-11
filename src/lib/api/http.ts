import { auth } from "../firebase";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Adjunta el ID token de Firebase Auth cuando hay sesión — las operaciones
// admin lo exigen (backend: core/auth.ts requireAdmin); las públicas
// (crear pedido/cita/cotización) lo ignoran si viene, así que es seguro
// llamarlo siempre desde el mismo helper.
export async function apiRequest<T>(baseUrl: string, path: string, options?: RequestInit): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error ?? "Error de red al comunicarse con el servidor");
  }
  return body.data as T;
}
