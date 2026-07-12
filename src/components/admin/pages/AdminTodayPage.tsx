import {
  CalendarDays,
  ChevronRight,
  FileText,
  Filter,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Cita, Cotizacion, Pedido } from "../../../types";
import { useAdminOperations } from "../data/AdminOperationsContext";
import { buildAttentionItems, type AdminEntityKind } from "../domain/attention";
import { AdminDataState } from "../ui/AdminDataState";
import { AdminEntityDetail } from "../ui/AdminEntityDetail";
import styles from "../ui/AdminLayout.module.css";

export function AdminTodayPage() {
  const operations = useAdminOperations();
  const [selected, setSelected] = useState<{
    kind: AdminEntityKind;
    entity: Pedido | Cita | Cotizacion;
  } | null>(null);
  const items = useMemo(() => buildAttentionItems(operations), [operations]);
  const counts = {
    pedidos: operations.pedidos.filter((item) => item.estado === "pendiente")
      .length,
    citas: operations.citas.filter((item) => item.estado === "pendiente")
      .length,
    cotizaciones: operations.cotizaciones.filter(
      (item) => item.estado === "pendiente",
    ).length,
  };
  const loading =
    operations.loading.pedidos ||
    operations.loading.citas ||
    operations.loading.cotizaciones;
  const errorMessages = [
    operations.errors.pedidos,
    operations.errors.citas,
    operations.errors.cotizaciones,
  ].filter(Boolean);
  const refreshedEntity = selected
    ? (selected.kind === "pedido"
        ? operations.pedidos
        : selected.kind === "cita"
          ? operations.citas
          : operations.cotizaciones
      ).find((item) => item.id === selected.entity.id)
    : null;
  const IconFor = (kind: AdminEntityKind) =>
    kind === "pedido" ? ShoppingBag : kind === "cita" ? CalendarDays : FileText;

  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        <div>
          <span>Bandeja de atención</span>
          <h2>Qué requiere atención</h2>
          <p>{items.length} elementos en estados accionables</p>
        </div>
        <button
          type="button"
          onClick={() => void operations.refreshAll()}
          disabled={loading}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Actualizar
        </button>
      </div>
      <section className={styles.summaryGrid}>
        <div>
          <strong>{counts.pedidos}</strong>
          <span>Pedidos</span>
        </div>
        <div>
          <strong>{counts.citas}</strong>
          <span>Citas</span>
        </div>
        <div>
          <strong>{counts.cotizaciones}</strong>
          <span>Cotizaciones</span>
        </div>
      </section>
      {errorMessages.length > 0 && (
        <AdminDataState
          kind="error"
          title="Algunos datos no se cargaron"
          message={errorMessages.join(" · ")}
          onRetry={() => void operations.refreshAll()}
        />
      )}
      <div className={styles.listHeading}>
        <strong>Siguiente por atender</strong>
        <span>
          <Filter size={14} aria-hidden="true" />
          Prioridad verificada
        </span>
      </div>
      {loading && items.length === 0 ? (
        <AdminDataState kind="loading" title="Cargando pendientes" message="" />
      ) : items.length === 0 ? (
        <AdminDataState
          kind="empty"
          title="No hay elementos pendientes"
          message="Pedidos, citas y cotizaciones accionables aparecerán aquí."
        />
      ) : (
        <section className={styles.attentionList}>
          {items.map((item) => {
            const Icon = IconFor(item.kind);
            return (
              <button
                type="button"
                key={`${item.kind}-${item.id}`}
                onClick={() =>
                  setSelected({ kind: item.kind, entity: item.entity })
                }
              >
                <span className={styles.entityIcon}>
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className={styles.attentionCopy}>
                  <strong>{item.clientName}</strong>
                  <small>
                    {item.locationLabel} · {item.contextLabel}
                  </small>
                  <b>
                    {item.nextActionLabel}
                    {item.dateLabel ? ` · ${item.dateLabel}` : ""}
                  </b>
                </span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            );
          })}
        </section>
      )}
      {selected && (
        <AdminEntityDetail
          kind={selected.kind}
          entity={refreshedEntity ?? selected.entity}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
