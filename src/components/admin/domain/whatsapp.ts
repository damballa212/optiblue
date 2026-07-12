import type { Cita, Cotizacion, Pedido } from "../../../types";

type AdminMessageInput =
  | { kind: "pedido"; entity: Pedido; location: string; product: string }
  | { kind: "cita"; entity: Cita; location: string }
  | { kind: "cotizacion"; entity: Cotizacion; location: string; product: string };

export function buildAdminWhatsAppMessage(input: AdminMessageInput): string {
  if (input.kind === "pedido") {
    return `Hola ${input.entity.nombre}, te escribimos de OptiBlue sobre tu pedido de ${input.product} para la sede ${input.location}. ¿Podemos ayudarte a continuar?`;
  }
  if (input.kind === "cita") {
    return `Hola ${input.entity.nombre}, te escribimos de OptiBlue sobre tu solicitud de cita en ${input.location} para el ${input.entity.fecha} a las ${input.entity.hora}. La fecha y hora estan sujetas a confirmacion. ¿Podemos ayudarte a coordinarla?`;
  }
  const extras = input.entity.extras.length ? input.entity.extras.join(", ") : "Ninguno";
  return `Hola ${input.entity.nombre}, te escribimos de OptiBlue sobre tu cotizacion de ${input.product} para la sede ${input.location}. Total registrado: $${input.entity.total}. Extras: ${extras}. ¿Podemos ayudarte a continuar?`;
}
