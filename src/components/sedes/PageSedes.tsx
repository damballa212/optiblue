import { SEDES } from "../../data";
import { openWA } from "../../lib/whatsapp";
import { section, sectionTag, sectionH2, sectionSub, grid, btnWA, btnGhost } from "../../styles/shared";
import * as S from "./PageSedes.styles";

export function PageSedes() {
  return (
    <div style={section}>
      <div style={sectionTag}>Dónde encontrarnos</div>
      <h2 style={sectionH2}>Nuestras 3 sedes</h2>
      <p style={sectionSub}>Visítanos en Caracas, Valencia o Maracaibo. Agenda por WhatsApp desde cualquier sede.</p>
      <div style={grid(300)}>
        {SEDES.map((s) => (
          <div key={s.id} style={S.sedeCard}>
            <div style={S.sedeHeader}>
              <div style={S.sedeIconBadge}>📍</div>
              <div style={S.sedeCity}>{s.ciudad}</div>
            </div>
            <div style={S.sedeRow}>
              <span style={S.sedeIcon}>🏢</span>
              <span>{s.direccion}</span>
            </div>
            <div style={S.sedeRow}>
              <span style={S.sedeIcon}>📞</span>
              <span>{s.telefono}</span>
            </div>
            <div style={S.sedeRow}>
              <span style={S.sedeIcon}>🕐</span>
              <span>{s.horario}</span>
            </div>
            <div style={S.sedeActions}>
              <button style={{ ...btnWA, fontSize: 13, padding: "9px 14px" }} onClick={() => openWA(encodeURIComponent(`Hola! Estoy interesado en la sede de ${s.ciudad}`), s.ciudad)}>
                💬 WhatsApp
              </button>
              <button style={{ ...btnGhost, fontSize: 13 }} onClick={() => window.open(s.maps, "_blank")}>
                🗺 Ver mapa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
