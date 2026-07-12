import { Info, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ModalSurface } from "../../shared/ModalSurface";
import { normalizeWhatsappNumber, openWA } from "../../../lib/whatsapp";
import styles from "./AdminUi.module.css";

interface WhatsAppComposerProps {
  phone: string;
  initialMessage: string;
  onClose: () => void;
}

export function WhatsAppComposer({
  phone,
  initialMessage,
  onClose,
}: WhatsAppComposerProps) {
  const [message, setMessage] = useState(initialMessage);
  const usablePhone = normalizeWhatsappNumber(phone);

  function openConversation() {
    if (!usablePhone) return;
    openWA(encodeURIComponent(message), phone);
  }

  return (
    <ModalSurface
      title="Preparar WhatsApp"
      eyebrow="Contacto"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Volver al detalle
          </button>
          <button
            type="button"
            className={styles.whatsappButton}
            onClick={openConversation}
            disabled={!usablePhone}
          >
            <MessageCircle size={17} aria-hidden="true" />
            Abrir WhatsApp
          </button>
        </>
      }
    >
      <div className={styles.composer}>
        <div className={styles.phoneTarget}>
          <MessageCircle aria-hidden="true" />
          <div>
            <strong>Teléfono del cliente</strong>
            <span>{usablePhone ?? "No utilizable"}</span>
          </div>
        </div>
        <label htmlFor="admin-whatsapp-message">Mensaje propuesto</label>
        <textarea
          id="admin-whatsapp-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={9}
        />
        <p className={usablePhone ? styles.infoNote : styles.inlineError}>
          <Info size={16} aria-hidden="true" />
          {usablePhone
            ? "Abrir WhatsApp no cambia el estado. Actualízalo de forma explícita después del contacto."
            : "El teléfono del cliente no es utilizable para WhatsApp."}
        </p>
      </div>
    </ModalSurface>
  );
}
