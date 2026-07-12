import { Check, MessageCircle, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { Cita, Cotizacion, Pedido } from "../../../types";
import { useAdminOperations } from "../data/AdminOperationsContext";
import type { AdminEntityKind } from "../domain/attention";
import { buildAdminWhatsAppMessage } from "../domain/whatsapp";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { ResponsiveDetailSurface } from "./ResponsiveDetailSurface";
import { StatusEditor } from "./StatusEditor";
import { WhatsAppComposer } from "./WhatsAppComposer";
import styles from "./AdminLayout.module.css";
import ui from "./AdminUi.module.css";

interface AdminEntityDetailProps {
  kind: AdminEntityKind;
  entity: Pedido | Cita | Cotizacion;
  onClose: () => void;
}

export function AdminEntityDetail({
  kind,
  entity,
  onClose,
}: AdminEntityDetailProps) {
  const { productNames, locationNames } = useAdminOperations();
  const [composerOpen, setComposerOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [lastChange, setLastChange] = useState<{
    current: string;
    undo: () => Promise<void>;
  } | null>(null);
  const [undoing, setUndoing] = useState(false);
  const [undoError, setUndoError] = useState<string | null>(null);
  const location = locationNames.get(entity.sedeId) ?? "Sede no disponible";
  const product =
    "productoId" in entity
      ? (productNames.get(entity.productoId) ?? "Producto no disponible")
      : "";

  const message = useMemo(() => {
    if (kind === "pedido")
      return buildAdminWhatsAppMessage({
        kind,
        entity: entity as Pedido,
        location,
        product,
      });
    if (kind === "cita")
      return buildAdminWhatsAppMessage({
        kind,
        entity: entity as Cita,
        location,
      });
    return buildAdminWhatsAppMessage({
      kind,
      entity: entity as Cotizacion,
      location,
      product,
    });
  }, [kind, entity, location, product]);

  async function undo() {
    if (!lastChange) return;
    setUndoing(true);
    setUndoError(null);
    try {
      await lastChange.undo();
      setLastChange(null);
    } catch (cause) {
      setUndoError(
        cause instanceof Error ? cause.message : "No se pudo deshacer",
      );
    } finally {
      setUndoing(false);
    }
  }

  return (
    <>
      <ResponsiveDetailSurface
        title={entity.nombre}
        eyebrow={kind}
        onClose={onClose}
        footer={
          <>
            <button
              type="button"
              className={ui.whatsappButton}
              onClick={() => setComposerOpen(true)}
            >
              <MessageCircle size={17} aria-hidden="true" />
              Preparar WhatsApp
            </button>
            <button
              type="button"
              className={ui.secondaryButton}
              onClick={() => setStatusOpen(true)}
            >
              Cambiar estado
            </button>
          </>
        }
      >
        <div className={styles.detailSummary}>
          <div>
            <span>Telefono</span>
            <strong>{entity.telefono}</strong>
          </div>
          <div>
            <span>Sede</span>
            <strong>{location}</strong>
          </div>
          <AdminStatusBadge
            kind={kind as never}
            status={entity.estado as never}
          />
        </div>
        <dl className={styles.detailFields}>
          {kind === "pedido" && (
            <>
              <div>
                <dt>Producto</dt>
                <dd>{product}</dd>
              </div>
              <div>
                <dt>Precio registrado</dt>
                <dd>${(entity as Pedido).precio}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{entity.fecha}</dd>
              </div>
            </>
          )}
          {kind === "cita" && (
            <>
              <div>
                <dt>Fecha y hora preferidas</dt>
                <dd>
                  {entity.fecha} · {(entity as Cita).hora}
                </dd>
              </div>
              <div>
                <dt>Motivo</dt>
                <dd>{(entity as Cita).motivo || "No indicado"}</dd>
              </div>
              <div>
                <dt>Nota</dt>
                <dd>{(entity as Cita).nota || "Sin nota"}</dd>
              </div>
            </>
          )}
          {kind === "cotizacion" && (
            <>
              <div>
                <dt>Producto / montura</dt>
                <dd>{product}</dd>
              </div>
              <div className={styles.doubleField}>
                <span>
                  <dt>Ojo derecho</dt>
                  <dd>
                    {(entity as Cotizacion).od || "No indicado"} · Ast.{" "}
                    {(entity as Cotizacion).astigmatismoOD || "No indicado"}
                  </dd>
                </span>
                <span>
                  <dt>Ojo izquierdo</dt>
                  <dd>
                    {(entity as Cotizacion).oi || "No indicado"} · Ast.{" "}
                    {(entity as Cotizacion).astigmatismoOI || "No indicado"}
                  </dd>
                </span>
              </div>
              <div>
                <dt>Extras</dt>
                <dd>
                  {(entity as Cotizacion).extras.length
                    ? (entity as Cotizacion).extras.join(", ")
                    : "Ninguno"}
                </dd>
              </div>
              <div>
                <dt>Total registrado</dt>
                <dd>${(entity as Cotizacion).total}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{entity.fecha}</dd>
              </div>
            </>
          )}
        </dl>
        {lastChange && (
          <div className={styles.successToast} role="status" aria-live="polite">
            <Check aria-hidden="true" />
            <div>
              <strong>Estado actualizado</strong>
              <span>Ahora figura como {lastChange.current}.</span>
            </div>
            <button type="button" onClick={undo} disabled={undoing}>
              <RotateCcw size={14} aria-hidden="true" />
              {undoing ? "Deshaciendo..." : "Deshacer"}
            </button>
          </div>
        )}
        {undoError && <p className={styles.mutationError}>{undoError}</p>}
      </ResponsiveDetailSurface>
      {composerOpen && (
        <WhatsAppComposer
          phone={entity.telefono}
          initialMessage={message}
          onClose={() => setComposerOpen(false)}
        />
      )}
      {statusOpen && (
        <StatusEditor
          kind={kind}
          entity={entity}
          onClose={() => setStatusOpen(false)}
          onChanged={(change) =>
            setLastChange({ current: change.current, undo: change.undo })
          }
        />
      )}
    </>
  );
}
