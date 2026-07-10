import { SEDES } from "../../data";
import { openWA } from "../../lib/whatsapp";
import { grid, card, btnWA } from "../../styles/shared";
import { colors } from "../../styles/tokens";

export function AdminSedes() {
  return (
    <div style={grid(280)}>
      {SEDES.map((s) => (
        <div key={s.id} style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>📍 {s.ciudad}</div>
          <div style={{ fontSize: 14, color: colors.slate600, marginBottom: 4 }}>{s.direccion}</div>
          <div style={{ fontSize: 14, color: colors.slate600, marginBottom: 4 }}>📞 {s.telefono}</div>
          <div style={{ fontSize: 14, color: colors.slate600, marginBottom: 12 }}>🕐 {s.horario}</div>
          <button style={{ ...btnWA, fontSize: 13 }} onClick={() => openWA(encodeURIComponent(`Hola! Consulta desde sede ${s.ciudad}`), s.ciudad)}>
            💬 Probar WhatsApp
          </button>
        </div>
      ))}
    </div>
  );
}
