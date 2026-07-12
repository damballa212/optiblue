import type { Pedido, EstadoPedido } from "../../types";
import { apiRequest } from "./http";

const BASE_URL = import.meta.env.VITE_PEDIDOS_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:5001/demo-optiblue/us-central1/apiPedidos";

export type PedidoInput = Omit<Pedido, "id" | "estado">;

export const pedidosApi = {
  // Público: cualquier visitante registra su pedido antes de ir a WhatsApp.
  crearPedido: (input: PedidoInput) => apiRequest<Pedido>(BASE_URL, "/pedidos", { method: "POST", body: JSON.stringify(input) }),
  // Back office: requiere sesión admin (backend: core/auth.ts).
  listarPedidos: () => apiRequest<Pedido[]>(BASE_URL, "/pedidos", undefined, true),
  actualizarEstadoPedido: (id: string, estado: EstadoPedido) => apiRequest<Pedido>(BASE_URL, `/pedidos/${id}`, { method: "PATCH", body: JSON.stringify({ estado }) }, true),
};
