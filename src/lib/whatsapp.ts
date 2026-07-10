import { SEDES } from "../data/sedes";

const DEFAULT_WHATSAPP = SEDES[0].whatsapp;

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
        `Hola OptiBlue! Quisiera agendar una cita para examen de la vista.\n*Sede:* ${payload.sede}\n*Montura de interés:* ${payload.montura}`,
      );
  }
}

/**
 * Resolves the WhatsApp number for a given sede name.
 * Each sede owns its own number (SEDES[].whatsapp) instead of a single
 * hardcoded number for the whole app, so messages route to the right branch.
 */
export function getSedeWhatsapp(ciudad?: string): string {
  if (!ciudad) return DEFAULT_WHATSAPP;
  const sede = SEDES.find((s) => s.ciudad === ciudad);
  return sede?.whatsapp ?? DEFAULT_WHATSAPP;
}

export function openWA(msg: string, ciudad?: string): void {
  const numero = getSedeWhatsapp(ciudad);
  window.open(`https://wa.me/${numero}?text=${msg}`, "_blank");
}
