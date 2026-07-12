import {
  CalendarDays,
  ChevronRight,
  FileText,
  Filter,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Cita, Cotizacion, Pedido } from "../../../types";
import { ModalSurface } from "../../shared/ModalSurface";
import { useAdminOperations } from "../data/AdminOperationsContext";
import type { AdminEntityKind } from "../domain/attention";
import { filterAdminRecords } from "../domain/filters";
import { ADMIN_STATUS_OPTIONS } from "../domain/status";
import { AdminDataState } from "../ui/AdminDataState";
import { AdminEntityDetail } from "../ui/AdminEntityDetail";
import { AdminStatusBadge } from "../ui/AdminStatusBadge";
import styles from "../ui/AdminLayout.module.css";

interface AdminWorkPageProps {
  kind: AdminEntityKind;
}
type WorkEntity = Pedido | Cita | Cotizacion;

export function AdminWorkPage({ kind }: AdminWorkPageProps) {
  const operations = useAdminOperations();
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("todos");
  const [sedeId, setSedeId] = useState("todas");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const records: WorkEntity[] =
    kind === "pedido"
      ? operations.pedidos
      : kind === "cita"
        ? operations.citas
        : operations.cotizaciones;
  const filtered = useMemo(
    () => filterAdminRecords(records, { query, estado, sedeId }),
    [records, query, estado, sedeId],
  );
  const selected = selectedId
    ? records.find((item) => item.id === selectedId)
    : null;
  const loading =
    operations.loading[
      kind === "pedido" ? "pedidos" : kind === "cita" ? "citas" : "cotizaciones"
    ];
  const error =
    operations.errors[
      kind === "pedido" ? "pedidos" : kind === "cita" ? "citas" : "cotizaciones"
    ];
  const refresh =
    kind === "pedido"
      ? operations.refreshPedidos
      : kind === "cita"
        ? operations.refreshCitas
        : operations.refreshCotizaciones;
  const title =
    kind === "pedido" ? "Pedidos" : kind === "cita" ? "Citas" : "Cotizaciones";
  const Icon =
    kind === "pedido" ? ShoppingBag : kind === "cita" ? CalendarDays : FileText;
  const locationLabel = (id: string) =>
    operations.locationNames.get(id) ?? "Sede no disponible";
  const contextLabel = (entity: WorkEntity) =>
    kind === "pedido"
      ? (operations.productNames.get((entity as Pedido).productoId) ??
        "Producto no disponible")
      : kind === "cita"
        ? (entity as Cita).motivo || "Motivo no indicado"
        : (operations.productNames.get((entity as Cotizacion).productoId) ??
          "Producto no disponible");
  const statusBadge = (entity: WorkEntity) =>
    kind === "pedido" ? (
      <AdminStatusBadge kind="pedido" status={(entity as Pedido).estado} />
    ) : kind === "cita" ? (
      <AdminStatusBadge kind="cita" status={(entity as Cita).estado} />
    ) : (
      <AdminStatusBadge
        kind="cotizacion"
        status={(entity as Cotizacion).estado}
      />
    );

  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        <div>
          <span>Operación</span>
          <h2>{title}</h2>
          <p>
            {filtered.length} de {records.length} registros
          </p>
        </div>
      </div>
      <div className={styles.workToolbar}>
        <label>
          <Search size={17} aria-hidden="true" />
          <span className={styles.srOnly}>Buscar</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cliente o teléfono"
          />
        </label>
        <button type="button" onClick={() => setFiltersOpen(true)}>
          <Filter size={17} aria-hidden="true" />
          <span>Filtros</span>
        </button>
      </div>
      {(estado !== "todos" || sedeId !== "todas") && (
        <div className={styles.activeFilters}>
          <span>{estado !== "todos" ? estado : "Todos los estados"}</span>
          <span>
            {sedeId !== "todas" ? locationLabel(sedeId) : "Todas las sedes"}
          </span>
          <button
            type="button"
            onClick={() => {
              setEstado("todos");
              setSedeId("todas");
            }}
          >
            <X size={14} aria-hidden="true" />
            Limpiar
          </button>
        </div>
      )}
      {error && records.length > 0 && (
        <AdminDataState
          kind="error"
          title="No se pudo actualizar la lista"
          message="Se conservan los últimos datos disponibles."
          onRetry={() => void refresh()}
        />
      )}
      {loading && records.length === 0 ? (
        <AdminDataState
          kind="loading"
          title={`Cargando ${title.toLowerCase()}`}
          message=""
        />
      ) : error && records.length === 0 ? (
        <AdminDataState
          kind="error"
          title={`No pudimos cargar ${title.toLowerCase()}`}
          message={error}
          onRetry={() => void refresh()}
        />
      ) : filtered.length === 0 ? (
        <AdminDataState
          kind="empty"
          title="No hay resultados con estos filtros"
          message="Limpia los filtros o prueba otra búsqueda."
          onRetry={() => {
            setQuery("");
            setEstado("todos");
            setSedeId("todas");
          }}
          actionLabel="Limpiar filtros"
        />
      ) : (
        <>
          <section className={styles.mobileRecords}>
            {filtered.map((entity) => (
              <button
                type="button"
                key={entity.id}
                onClick={() => setSelectedId(entity.id)}
              >
                <span className={styles.entityIcon}>
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span>
                  <strong>{entity.nombre}</strong>
                  <small>
                    {contextLabel(entity)} · {locationLabel(entity.sedeId)} ·{" "}
                    {entity.fecha}
                  </small>
                  {statusBadge(entity)}
                </span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            ))}
          </section>
          <div className={styles.desktopTableWrap}>
            <table className={styles.desktopTable}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contexto</th>
                  <th>Sede / fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entity) => (
                  <tr key={entity.id} onClick={() => setSelectedId(entity.id)}>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedId(entity.id)}
                      >
                        <strong>{entity.nombre}</strong>
                        <small>{entity.telefono}</small>
                      </button>
                    </td>
                    <td>{contextLabel(entity)}</td>
                    <td>
                      {locationLabel(entity.sedeId)}
                      <small>
                        {entity.fecha}
                        {kind === "cita" ? ` · ${(entity as Cita).hora}` : ""}
                      </small>
                    </td>
                    <td>{statusBadge(entity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {filtersOpen && (
        <ModalSurface
          title={`Filtrar ${title.toLowerCase()}`}
          eyebrow="Lista"
          onClose={() => setFiltersOpen(false)}
          footer={
            <>
              <button
                className={styles.filterClear}
                type="button"
                onClick={() => {
                  setEstado("todos");
                  setSedeId("todas");
                }}
              >
                Limpiar
              </button>
              <button
                className={styles.filterApply}
                type="button"
                onClick={() => setFiltersOpen(false)}
              >
                Ver resultados
              </button>
            </>
          }
        >
          <div className={styles.filterForm}>
            <label>
              Estado
              <select
                value={estado}
                onChange={(event) => setEstado(event.target.value)}
              >
                <option value="todos">Todos</option>
                {(ADMIN_STATUS_OPTIONS[kind] as readonly string[]).map(
                  (option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label>
              Sede
              <select
                value={sedeId}
                onChange={(event) => setSedeId(event.target.value)}
              >
                <option value="todas">Todas</option>
                {operations.sedes.map((sede) => (
                  <option value={sede.id} key={sede.id}>
                    {sede.ciudad}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </ModalSurface>
      )}
      {selected && (
        <AdminEntityDetail
          kind={kind}
          entity={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
