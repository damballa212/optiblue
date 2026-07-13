import { Bell, BellOff, ShieldAlert, Smartphone } from "lucide-react";
import { useState } from "react";
import { notificacionesApi } from "../../../lib/api/notificaciones";
import { solicitarPermisoYToken } from "../../../lib/push/fcm";
import { detectarSoportePush } from "../../../lib/push/support";
import {
  deactivateAdminPush,
  readAdminPushToken,
  storeAdminPushToken,
} from "../../../lib/push/deviceToken";
import styles from "./PushSettings.module.css";

export function PushSettings() {
  const soporte = detectarSoportePush();
  const [permisoDenegado, setPermisoDenegado] = useState(
    () => soporte === "soportado" && "Notification" in window && Notification.permission === "denied",
  );
  const [token, setToken] = useState<string | null>(readAdminPushToken);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activar() {
    setCargando(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const nuevoToken = await solicitarPermisoYToken(registration);
      if (!nuevoToken) {
        setPermisoDenegado(true);
        return;
      }
      await notificacionesApi.registrarToken({ token: nuevoToken, userAgent: navigator.userAgent });
      storeAdminPushToken(nuevoToken);
      setToken(nuevoToken);
      setPermisoDenegado(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo activar las notificaciones.");
    } finally {
      setCargando(false);
    }
  }

  async function desactivar() {
    if (!token) return;
    setCargando(true);
    setError(null);
    try {
      await deactivateAdminPush();
      setToken(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo desactivar las notificaciones.");
    } finally {
      setCargando(false);
    }
  }

  if (soporte === "no-soportado") {
    return (
      <section className={styles.card}>
        <h3>
          <BellOff size={18} aria-hidden="true" /> Notificaciones
        </h3>
        <p>Este navegador no soporta notificaciones push.</p>
      </section>
    );
  }

  if (soporte === "requiere-instalacion") {
    return (
      <section className={styles.card}>
        <h3>
          <Smartphone size={18} aria-hidden="true" /> Notificaciones
        </h3>
        <p>
          En iPhone o iPad, instala primero "OptiBlue Panel": toca Compartir → "Añadir a pantalla de inicio", ábrelo
          desde ahí y vuelve a esta pantalla para activarlas.
        </p>
      </section>
    );
  }

  if (permisoDenegado) {
    return (
      <section className={styles.card}>
        <h3>
          <ShieldAlert size={18} aria-hidden="true" /> Notificaciones
        </h3>
        <p>Bloqueaste las notificaciones para este sitio. Actívalas desde los ajustes del navegador y recarga.</p>
      </section>
    );
  }

  return (
    <section className={styles.card}>
      <h3>
        <Bell size={18} aria-hidden="true" /> Notificaciones
      </h3>
      <p>Recibe un aviso en este dispositivo cuando entre un pedido, cita o cotización nuevos.</p>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {token ? (
        <button type="button" className={styles.secondary} onClick={desactivar} disabled={cargando}>
          {cargando ? "Desactivando..." : "Desactivar notificaciones"}
        </button>
      ) : (
        <button type="button" className={styles.primary} onClick={activar} disabled={cargando}>
          {cargando ? "Activando..." : "Activar notificaciones"}
        </button>
      )}
    </section>
  );
}
