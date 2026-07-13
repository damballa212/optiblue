import { useState } from "react";
import { Check, Circle, MessageCircle, XCircle } from "lucide-react";
import type { Cita, Cotizacion, Pedido } from "../../../types";
import { citasApi } from "../../../lib/api/citas";
import { cotizacionesApi } from "../../../lib/api/cotizaciones";
import { pedidosApi } from "../../../lib/api/pedidos";
import { ModalSurface } from "../../shared/ModalSurface";
import { useAdminOperations } from "../data/AdminOperationsContext";
import type { AdminEntityKind } from "../domain/attention";
import { ADMIN_STATUS_OPTIONS, getAdminStatusMeta } from "../domain/status";
import styles from "./AdminLayout.module.css";
import ui from "./AdminUi.module.css";
import polish from "./AdminPolish.module.css";
import { formatAdminEntityKind } from "../domain/presentation";

type StatusEntity = Pedido | Cita | Cotizacion;

interface StatusEditorProps {
  kind: AdminEntityKind;
  entity: StatusEntity;
  onClose: () => void;
  onChanged: (change: {
    previous: string;
    current: string;
    undo: () => Promise<void>;
  }) => void;
}

export function StatusEditor({
  kind,
  entity,
  onClose,
  onChanged,
}: StatusEditorProps) {
  const operations = useAdminOperations();
  const [selected, setSelected] = useState<string>(entity.estado);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: string) {
    if (kind === "pedido")
      await pedidosApi.actualizarEstadoPedido(
        entity.id,
        status as Pedido["estado"],
      );
    if (kind === "cita")
      await citasApi.actualizarEstadoCita(entity.id, status as Cita["estado"]);
    if (kind === "cotizacion")
      await cotizacionesApi.actualizarEstadoCotizacion(
        entity.id,
        status as Cotizacion["estado"],
      );
  }

  async function refresh() {
    if (kind === "pedido") await operations.refreshPedidos();
    if (kind === "cita") await operations.refreshCitas();
    if (kind === "cotizacion") await operations.refreshCotizaciones();
  }

  async function save() {
    if (selected === entity.estado) return onClose();
    setSaving(true);
    setError(null);
    try {
      const previous = entity.estado;
      await updateStatus(selected);
      await refresh();
      onChanged({
        previous,
        current: selected,
        undo: async () => {
          await updateStatus(previous);
          await refresh();
        },
      });
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo actualizar el estado",
      );
    } finally {
      setSaving(false);
    }
  }

  const options = ADMIN_STATUS_OPTIONS[kind] as readonly string[];
  return (
    <ModalSurface
      title="Cambiar estado"
      eyebrow={formatAdminEntityKind(kind)}
      onClose={() => !saving && onClose()}
      footer={
        <>
          <button
            type="button"
            className={ui.secondaryButton}
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={polish.primaryButton}
            onClick={save}
            disabled={saving || selected === entity.estado}
          >
            {saving ? "Guardando..." : "Guardar estado"}
          </button>
        </>
      }
    >
      <div className={styles.statusOptions}>
        {options.map((option) => {
          const meta = getAdminStatusMeta(kind, option as never);
          const Icon =
            meta.tone === "resolved"
              ? Check
              : meta.tone === "progress"
                ? MessageCircle
                : meta.tone === "closed"
                  ? XCircle
                  : Circle;
          return (
            <button
              type="button"
              key={option}
              className={selected === option ? styles.statusSelected : ""}
              onClick={() => setSelected(option)}
            >
              <Icon size={19} aria-hidden="true" />
              <span>
                <strong>{meta.label}</strong>
                <small>
                  {option === entity.estado
                    ? "Estado actual"
                    : "Seleccionar estado"}
                </small>
              </span>
              <i aria-hidden="true" />
            </button>
          );
        })}
      </div>
      {error && (
        <p className={styles.mutationError}>
          {error}{" "}
          <button type="button" onClick={save}>
            Reintentar
          </button>
        </p>
      )}
    </ModalSurface>
  );
}
