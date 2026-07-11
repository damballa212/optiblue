// El "carrito" del MVP: se registra en Firestore justo antes de redirigir a
// WhatsApp (sin carrito acumulativo multi-producto). El back office marca
// después si se pagó/compró o no — ver decisión 2026-07-10 en Obsidian.
export type EstadoPedido = "pendiente" | "pagado" | "no_pagado";

export interface Pedido {
  id: string;
  nombre: string;
  telefono: string;
  sedeId: string;
  productoId: string;
  precio: number;
  estado: EstadoPedido;
  fecha: string;
}
