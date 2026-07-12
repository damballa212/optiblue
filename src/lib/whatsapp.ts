import type { Sede } from "../types";

export type WAMessagePayload =
  | { tipo: "reserva"; nombre: string; precio: number; sede?: string }
  | {
      tipo: "cotizacion";
      montura?: string;
      od: string;
      oi: string;
      astOD: string;
      astOI: string;
      extras: string[];
      total: number;
      sede: string;
    }
  | { tipo: "cita"; sede: string; montura?: string };

export function buildWAMessage(payload: WAMessagePayload): string {
  switch (payload.tipo) {
    case "reserva":
      return encodeURIComponent(
        `Hola OptiBlue! Me interesa reservar: *${payload.nombre}*\nSede: ${payload.sede || "por confirmar"}\nPrecio: $${payload.precio}`,
      );
    case "cotizacion":
      return encodeURIComponent(
        `Hola OptiBlue! Quiero cotizar lentes adaptados:\n*Montura:* ${payload.montura}\n*OD:* ${payload.od || "—"}  *OI:* ${payload.oi || "—"}\n*Astigmatismo OD:* ${payload.astOD || "—"}  *OI:* ${payload.astOI || "—"}\n*Extras:* ${payload.extras.length ? payload.extras.join(", ") : "Ninguno"}\n*Total estimado:* $${payload.total}\n*Sede preferida:* ${payload.sede}`,
      );
    case "cita":
      return encodeURIComponent(
        `Hola OptiBlue! Quisiera solicitar una cita para examen de la vista.\n*Sede:* ${payload.sede}${payload.montura ? `\n*Montura de interés:* ${payload.montura}` : ""}`,
      );
  }
}

/**
 * Resuelve el número de WhatsApp de una sede por nombre de ciudad.
 * `sedes` ya no es un mock estático — viene de Firestore (useSedes()) y se
 * pasa explícito acá, así este helper no depende de dónde vinieron los datos.
 */
export function getSedeWhatsapp(sedes: Sede[], ciudad?: string): string {
  const fallback = sedes[0]?.whatsapp ?? "";
  if (!ciudad) return fallback;
  return sedes.find((s) => s.ciudad === ciudad)?.whatsapp ?? fallback;
}

export function normalizeWhatsappNumber(whatsappNumber: string): string | null {
  if (!whatsappNumber || /por definir/i.test(whatsappNumber)) return null;
  const digits = whatsappNumber.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function openWA(msg: string, whatsappNumber: string): boolean {
  const normalized = normalizeWhatsappNumber(whatsappNumber);
  if (!normalized) return false;
  window.open(`https://wa.me/${normalized}?text=${msg}`, "_blank");
  return true;
}
