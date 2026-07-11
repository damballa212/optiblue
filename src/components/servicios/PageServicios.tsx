import type { Servicio } from "../../types";
import { SERVICIOS } from "../../data";
import { useSedes } from "../../hooks/useSedes";
import { openWA, getSedeWhatsapp } from "../../lib/whatsapp";
import { section, sectionTag, sectionH2, sectionSub, grid, btnPrimary } from "../../styles/shared";
import * as S from "./PageServicios.styles";

export function PageServicios() {
  const { sedes } = useSedes();

  function reservarServicio(s: Servicio) {
    const msg = encodeURIComponent(`Hola OptiBlue! Quisiera agendar: *${s.nombre}*`);
    openWA(msg, getSedeWhatsapp(sedes));
  }

  return (
    <div style={section}>
      <div style={sectionTag}>Oftalmología</div>
      <h2 style={sectionH2}>Servicios especializados</h2>
      <p style={sectionSub}>Atención oftalmológica con tecnología de vanguardia y profesionales certificados.</p>
      <div style={grid(240)}>
        {SERVICIOS.map((s) => (
          <div key={s.nombre} style={S.servCard}>
            <div style={S.servIcon}>{s.icon}</div>
            <div style={S.servName}>{s.nombre}</div>
            <div style={S.servDesc}>{s.desc}</div>
            <div style={S.servPrice}>{s.precio}</div>
            <button style={{ ...btnPrimary, marginTop: 12 }} onClick={() => reservarServicio(s)}>
              📅 Agendar cita
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
