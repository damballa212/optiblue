import {
  Clock3,
  Edit3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { sedesApi } from "../../../lib/api/sedes";
import type { Sede } from "../../../types";
import { ModalSurface } from "../../shared/ModalSurface";
import { useAdminOperations } from "../data/AdminOperationsContext";
import { validateLocationForm, type LocationFormValue } from "../domain/forms";
import { AdminDataState } from "../ui/AdminDataState";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import layout from "../ui/AdminLayout.module.css";
import ui from "../ui/AdminUi.module.css";
import styles from "../ui/AdminMaintenance.module.css";
import polish from "../ui/AdminPolish.module.css";

const EMPTY_LOCATION: LocationFormValue = {
  ciudad: "",
  direccion: "",
  telefono: "",
  whatsapp: "",
  horario: "",
  maps: "",
};
type LocationEditor = { mode: "new" } | { mode: "edit"; location: Sede };

export function AdminLocationsPage() {
  const { sedes, loading, errors } = useAdminOperations();
  const [editor, setEditor] = useState<LocationEditor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sede | null>(null);
  const [busy, setBusy] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  async function remove() {
    if (!deleteTarget) return;
    setBusy(true);
    setMutationError(null);
    try {
      await sedesApi.eliminarSede(deleteTarget.id);
      setDeleteTarget(null);
    } catch (cause) {
      setMutationError(
        cause instanceof Error ? cause.message : "No se pudo eliminar la sede.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={layout.page}>
      <div className={`${layout.pageTitle} ${polish.maintenanceTitle}`}>
        <div>
          <span>Mantenimiento</span>
          <h2>Sedes</h2>
          <p>Dirección, contacto, horario y mapa publicados</p>
        </div>
        <button
          className={styles.primaryAction}
          type="button"
          onClick={() => setEditor({ mode: "new" })}
        >
          <Plus aria-hidden="true" />
          Nueva sede
        </button>
      </div>
      {mutationError && (
        <p className={styles.pageError} role="alert">
          {mutationError}
        </p>
      )}
      {loading.sedes && (
        <AdminDataState kind="loading" title="Cargando sedes" message="" />
      )}
      {!loading.sedes && errors.sedes && (
        <AdminDataState
          kind="error"
          title="No pudimos cargar las sedes"
          message="La información existente no fue modificada."
        />
      )}
      {!loading.sedes && !errors.sedes && sedes.length === 0 && (
        <AdminDataState
          kind="empty"
          title="No hay sedes"
          message="Crea la primera sede para publicar sus datos de contacto."
          onRetry={() => setEditor({ mode: "new" })}
          actionLabel="Crear sede"
        />
      )}
      {!loading.sedes && !errors.sedes && sedes.length > 0 && (
        <div className={styles.locationList}>
          {sedes.map((location) => (
            <article className={styles.locationRow} key={location.id}>
              <div className={styles.locationIdentity}>
                <span>
                  <MapPin aria-hidden="true" />
                </span>
                <div>
                  <strong>{location.ciudad}</strong>
                  <p>{location.direccion}</p>
                </div>
              </div>
              <div className={styles.locationMeta}>
                <span>
                  <Phone aria-hidden="true" />
                  {location.telefono}
                </span>
                <span>
                  <MessageCircle aria-hidden="true" />
                  {location.whatsapp}
                </span>
                <span>
                  <Clock3 aria-hidden="true" />
                  {location.horario}
                </span>
              </div>
              <div className={styles.locationActions}>
                <a href={location.maps} target="_blank" rel="noreferrer">
                  <ExternalLink aria-hidden="true" />
                  Ver mapa
                </a>
                <button
                  type="button"
                  onClick={() => setEditor({ mode: "edit", location })}
                >
                  <Edit3 aria-hidden="true" />
                  Editar
                </button>
                <button
                  className={styles.deleteText}
                  type="button"
                  onClick={() => {
                    setMutationError(null);
                    setDeleteTarget(location);
                  }}
                >
                  <Trash2 aria-hidden="true" />
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {editor && (
        <LocationEditorModal editor={editor} onClose={() => setEditor(null)} />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title={`Eliminar sede de ${deleteTarget.ciudad}`}
          description="La sede dejará de aparecer como opción de contacto. Los registros históricos pueden conservar su referencia; esta acción no se puede deshacer."
          confirmLabel="Eliminar sede"
          onConfirm={remove}
          onCancel={() => !busy && setDeleteTarget(null)}
          busy={busy}
          error={mutationError}
        />
      )}
    </div>
  );
}

function LocationEditorModal({
  editor,
  onClose,
}: {
  editor: LocationEditor;
  onClose: () => void;
}) {
  const editing = editor.mode === "edit" ? editor.location : null;
  const [form, setForm] = useState<LocationFormValue>(
    editing
      ? {
          ciudad: editing.ciudad,
          direccion: editing.direccion,
          telefono: editing.telefono,
          whatsapp: editing.whatsapp,
          horario: editing.horario,
          maps: editing.maps,
        }
      : EMPTY_LOCATION,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof LocationFormValue, string>>
  >({});
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const set = (key: keyof LocationFormValue, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function save() {
    const nextErrors = validateLocationForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    setApiError(null);
    const input = {
      ciudad: form.ciudad.trim(),
      direccion: form.direccion.trim(),
      telefono: form.telefono.trim(),
      whatsapp: form.whatsapp.trim(),
      horario: form.horario.trim(),
      maps: form.maps.trim(),
    };
    try {
      if (editing) await sedesApi.actualizarSede(editing.id, input);
      else await sedesApi.crearSede(input);
      onClose();
    } catch (cause) {
      setApiError(
        cause instanceof Error ? cause.message : "No se pudo guardar la sede.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalSurface
      title={editing ? `Editar ${editing.ciudad}` : "Nueva sede"}
      eyebrow="Sedes"
      onClose={() => !busy && onClose()}
      wide
      footer={
        <>
          <button
            type="button"
            className={ui.secondaryButton}
            onClick={onClose}
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={save}
            disabled={busy}
          >
            {busy ? "Guardando..." : "Guardar sede"}
          </button>
        </>
      }
    >
      <div className={styles.formGrid}>
        <Field label="Ciudad" error={errors.ciudad}>
          <input
            value={form.ciudad}
            onChange={(event) => set("ciudad", event.target.value)}
            autoFocus
          />
        </Field>
        <Field label="Teléfono" error={errors.telefono}>
          <input
            inputMode="tel"
            value={form.telefono}
            onChange={(event) => set("telefono", event.target.value)}
          />
        </Field>
        <Field
          className={styles.fullField}
          label="Dirección"
          error={errors.direccion}
        >
          <textarea
            rows={3}
            value={form.direccion}
            onChange={(event) => set("direccion", event.target.value)}
          />
        </Field>
        <Field label="WhatsApp" error={errors.whatsapp}>
          <input
            inputMode="tel"
            value={form.whatsapp}
            onChange={(event) => set("whatsapp", event.target.value)}
          />
        </Field>
        <Field label="Horario" error={errors.horario}>
          <input
            value={form.horario}
            onChange={(event) => set("horario", event.target.value)}
          />
        </Field>
        <Field
          className={styles.fullField}
          label="Link de Google Maps"
          error={errors.maps}
        >
          <input
            inputMode="url"
            value={form.maps}
            onChange={(event) => set("maps", event.target.value)}
            placeholder="https://..."
          />
        </Field>
      </div>
      {apiError && (
        <p className={styles.formError} role="alert">
          {apiError}
        </p>
      )}
    </ModalSurface>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span>{label}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  );
}
