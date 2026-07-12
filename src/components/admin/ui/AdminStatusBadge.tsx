import type {
  EstadoCita,
  EstadoCotizacion,
  EstadoPedido,
} from "../../../types";
import type { AdminEntityKind } from "../domain/attention";
import { getAdminStatusMeta } from "../domain/status";
import styles from "./AdminUi.module.css";

type StatusProps =
  | { kind: "pedido"; status: EstadoPedido }
  | { kind: "cita"; status: EstadoCita }
  | { kind: "cotizacion"; status: EstadoCotizacion };

export function AdminStatusBadge(props: StatusProps) {
  const meta = getAdminStatusMeta(
    props.kind as AdminEntityKind,
    props.status as never,
  );
  return (
    <span
      className={`${styles.status} ${styles[meta.tone]}`}
      data-tone={meta.tone}
    >
      <i aria-hidden="true" />
      {meta.label}
    </span>
  );
}
