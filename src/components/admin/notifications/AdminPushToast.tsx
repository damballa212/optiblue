import { Bell, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePushForeground } from "../../../lib/push/usePushForeground";
import { getAdminNotificationRoute } from "../../../lib/push/notification";
import { useAdminOperations } from "../data/AdminOperationsContext";
import styles from "./AdminPushToast.module.css";

// Con la app en primer plano, FCM no muestra una notificación del sistema —
// este toast es el único aviso visible para ese caso.
export function AdminPushToast() {
  const { notificacion, descartar } = usePushForeground();
  const operations = useAdminOperations();
  const navigate = useNavigate();

  useEffect(() => {
    if (notificacion?.tipo === "pedido") void operations.refreshPedidos();
    if (notificacion?.tipo === "cita") void operations.refreshCitas();
    if (notificacion?.tipo === "cotizacion") void operations.refreshCotizaciones();
  }, [
    notificacion,
    operations.refreshPedidos,
    operations.refreshCitas,
    operations.refreshCotizaciones,
  ]);

  if (!notificacion) {
    return null;
  }

  return (
    <div className={styles.toast} role="status">
      <Bell size={18} aria-hidden="true" />
      <div className={styles.body}>
        <strong>{notificacion.title}</strong>
        {notificacion.body && <p>{notificacion.body}</p>}
      </div>
      {notificacion.tipo && (
        <button
          type="button"
          className={styles.open}
          onClick={() => {
            navigate(getAdminNotificationRoute(notificacion.tipo!));
            descartar();
          }}
        >
          Ver
        </button>
      )}
      <button type="button" className={styles.dismiss} onClick={descartar} aria-label="Cerrar notificación">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
