import { useState, useEffect } from "react";
import type { Producto } from "../../types";
import { useSedes } from "../../hooks/useSedes";
import { pedidosApi } from "../../lib/api/pedidos";
import { buildWAMessage, openWA, getSedeWhatsapp } from "../../lib/whatsapp";
import { overlay, modal, modalTitle, formGroupFull, label, input, select, btnWA, btnGhost } from "../../styles/shared";
import { colors } from "../../styles/tokens";

interface ReservaModalProps {
  producto: Producto;
  onClose: () => void;
}

export function ReservaModal({ producto, onClose }: ReservaModalProps) {
  const { sedes } = useSedes();
  const [sede, setSede] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  useEffect(() => {
    if (!sede && sedes.length > 0) setSede(sedes[0].ciudad);
  }, [sede, sedes]);

  async function confirmar() {
    if (!nombre.trim() || !telefono.trim()) {
      setError("Completa tu nombre y teléfono para continuar.");
      return;
    }
    const sedeObj = sedes.find((s) => s.ciudad === sede);
    if (!sedeObj) {
      setError("Elige una sede.");
      return;
    }

    setEnviando(true);
    setError(null);
    setConfirmacion(null);
    try {
      // Se registra el pedido en Firestore ANTES de abrir WhatsApp — es el
      // "carrito" del MVP: sin esto, el back office no tiene forma de saber
      // quién pidió qué (ver decisión 2026-07-10).
      await pedidosApi.crearPedido({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        sedeId: sedeObj.id,
        productoId: producto.id,
        precio: producto.precio,
        fecha: new Date().toISOString().slice(0, 10),
      });
      const msg = buildWAMessage({ tipo: "reserva", nombre: producto.nombre, precio: producto.precio, sede });
      const whatsappAbierto = openWA(msg, getSedeWhatsapp(sedes, sede));
      if (whatsappAbierto) {
        onClose();
      } else {
        setConfirmacion("Tu reserva quedó registrada. Esta sede todavía no tiene WhatsApp real configurado; el equipo debe contactarte con el teléfono que dejaste.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo registrar tu reserva. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
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
        {error && <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        {confirmacion && <p style={{ color: colors.blue700, fontSize: 13, marginBottom: 12 }}>{confirmacion}</p>}
        {!confirmacion && (
          <>
          <div style={formGroupFull}>
            <label style={label}>Tu nombre</label>
            <input style={input} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" />
          </div>
          <div style={formGroupFull}>
            <label style={label}>Tu teléfono</label>
            <input style={input} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+58 412-000-0000" />
          </div>
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
          <p style={{ fontSize: 13, color: colors.slate500, marginBottom: 20 }}>Primero registramos tu solicitud para que el equipo pueda hacer seguimiento. Si la sede tiene WhatsApp configurado, se abrirá el chat para coordinar.</p>
          <button style={btnWA} onClick={confirmar} disabled={enviando}>
            {enviando ? "Registrando…" : "Registrar solicitud"}
          </button>
          </>
        )}
        <button style={{ ...btnGhost, marginTop: 10 }} onClick={onClose} disabled={enviando}>
          {confirmacion ? "Cerrar" : "Cancelar"}
        </button>
      </div>
    </div>
  );
}
