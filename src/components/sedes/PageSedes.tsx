import { useSedes } from "../../hooks/useSedes";
import { openWA } from "../../lib/whatsapp";
import { section, sectionTag, sectionH2, sectionSub, grid, btnWA, btnGhost } from "../../styles/shared";
import * as S from "./PageSedes.styles";
import { StatusBlock } from "../shared/StatusBlock";

export function PageSedes() {
  const { sedes, loading, error } = useSedes();

  return (
    <div style={section}>
      <div style={sectionTag}>Dónde encontrarnos</div>
      <h2 style={sectionH2}>{sedes.length > 0 ? `Nuestras ${sedes.length} sedes` : "Nuestras sedes"}</h2>
      <p style={sectionSub}>Visítanos en cualquiera de nuestras sedes. Agenda por WhatsApp desde cualquiera de ellas.</p>
      {loading && <StatusBlock kind="loading" title="Cargando sedes" message="Estamos consultando direcciones, horarios y contactos." />}
      {!loading && error && <StatusBlock kind="error" title="No pudimos cargar las sedes" message="Revisa la conexión o intenta de nuevo en unos minutos." />}
      {!loading && !error && sedes.length === 0 && <StatusBlock kind="empty" title="Sedes pendientes" message="Todavía no hay sedes publicadas en el sistema." />}
      {!loading && !error && sedes.length > 0 && (
        <div style={grid(300)}>
          {sedes.map((s) => (
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
                <button style={{ ...btnWA, fontSize: 13, padding: "9px 14px" }} onClick={() => openWA(encodeURIComponent(`Hola! Estoy interesado en la sede de ${s.ciudad}`), s.whatsapp)}>
                  💬 WhatsApp
                </button>
                <button style={{ ...btnGhost, fontSize: 13 }} onClick={() => window.open(s.maps, "_blank")}>
                  🗺 Ver mapa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
