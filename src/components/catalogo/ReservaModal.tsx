import { useState, useEffect } from "react";
import type { Producto } from "../../types";
import { useSedes } from "../../hooks/useSedes";
import { buildWAMessage, openWA, getSedeWhatsapp } from "../../lib/whatsapp";
import { overlay, modal, modalTitle, formGroupFull, label, select, btnWA, btnGhost } from "../../styles/shared";
import { colors } from "../../styles/tokens";

interface ReservaModalProps {
  producto: Producto;
  onClose: () => void;
}

export function ReservaModal({ producto, onClose }: ReservaModalProps) {
  const { sedes } = useSedes();
  const [sede, setSede] = useState("");

  useEffect(() => {
    if (!sede && sedes.length > 0) setSede(sedes[0].ciudad);
  }, [sede, sedes]);

  function confirmar() {
    const msg = buildWAMessage({ tipo: "reserva", nombre: producto.nombre, precio: producto.precio, sede });
    openWA(msg, getSedeWhatsapp(sedes, sede));
    onClose();
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalTitle}>📅 Reservar — {producto.nombre}</div>
        {producto.imagenUrl ? (
          <img src={producto.imagenUrl} alt={producto.nombre} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
        ) : (
          <div style={{ fontSize: 22, textAlign: "center", padding: "16px 0" }}>👓</div>
        )}
        <div style={{ fontSize: 18, fontWeight: 800, color: colors.blue700, textAlign: "center", marginBottom: 20 }}>${producto.precio}</div>
        <div style={formGroupFull}>
          <label style={label}>Elige tu sede</label>
          <select style={select} value={sede} onChange={(e) => setSede(e.target.value)}>
            {sedes.map((s) => (
              <option key={s.id} value={s.ciudad}>
                {s.ciudad} — {s.direccion.slice(0, 35)}…
              </option>
            ))}
          </select>
        </div>
        <p style={{ fontSize: 13, color: colors.slate500, marginBottom: 20 }}>Al continuar te redirigiremos a WhatsApp para coordinar tu reserva con la sede seleccionada.</p>
        <button style={btnWA} onClick={confirmar}>
          💬 Continuar por WhatsApp
        </button>
        <button style={{ ...btnGhost, marginTop: 10 }} onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
