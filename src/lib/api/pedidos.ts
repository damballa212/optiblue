import type { Pedido, EstadoPedido } from "../../types";

const BASE_URL = import.meta.env.VITE_PEDIDOS_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiPedidos";

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

export type PedidoInput = Omit<Pedido, "id" | "estado">;

export const pedidosApi = {
  // Público: cualquier visitante registra su pedido antes de ir a WhatsApp.
  crearPedido: (input: PedidoInput) => request<Pedido>("/pedidos", { method: "POST", body: JSON.stringify(input) }),
  // Back office: /pedidos no es de lectura pública en Firestore (contiene
  // teléfono del cliente), así que el admin lee vía esta Function, no con
  // onSnapshot directo como en catálogo/sedes.
  listarPedidos: () => request<Pedido[]>("/pedidos"),
  actualizarEstadoPedido: (id: string, estado: EstadoPedido) => request<Pedido>(`/pedidos/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }),
};
