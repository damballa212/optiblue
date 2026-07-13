import { CalendarSearch, Check, CheckCircle2, ChevronLeft, ChevronRight, Circle, FileText, Glasses } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategorias } from "../../hooks/useCategorias";
import { useConfiguracionCotizacion } from "../../hooks/useConfiguracionCotizacion";
import { useOnline } from "../../hooks/useOnline";
import { useProductos } from "../../hooks/useProductos";
import { useSedes } from "../../hooks/useSedes";
import { cotizacionesApi } from "../../lib/api/cotizaciones";
import { buildWAMessage, getSedeWhatsapp, openWA } from "../../lib/whatsapp";
import { AgendarCitaModal } from "../shared/AgendarCitaModal";
import { DataState } from "../shared/DataState";
import { OptionalGooglePrefill } from "../shared/OptionalGooglePrefill";
import { calcularTotalPreview, extrasActivos } from "./cotizacionPricing";
import form from "../shared/PublicForm.module.css";
import styles from "./PageLentes.module.css";

const GRAD_STEPS = ["", "0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00", "2.25", "2.50", "2.75", "3.00", "3.50", "4.00", "4.50", "5.00", "5.50", "6.00"];
const STEP_LABELS = ["Montura y graduación", "Extras", "Sede y cotización"];

function GraduationSelect({ id, label, value, onChange, astigmatism = false }: { id: string; label: string; value: string; onChange: (value: string) => void; astigmatism?: boolean }) {
  return <div className={form.field}><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={(event) => onChange(event.target.value)}><option value="">{astigmatism ? "Sin astigmatismo" : "Sin corrección"}</option>{GRAD_STEPS.slice(1).map((step) => <option key={`-${step}`} value={`-${step}`}>-{step}</option>)}{!astigmatism && GRAD_STEPS.slice(1).map((step) => <option key={`+${step}`} value={`+${step}`}>+{step}</option>)}</select></div>;
}

export function PageLentes() {
  const [searchParams] = useSearchParams();
  const { productos, loading: productosLoading, error: productosError } = useProductos();
  const { categorias, loading: categoriasLoading } = useCategorias();
  const { sedes } = useSedes();
  const { configuracion, loading: configLoading, error: configError } = useConfiguracionCotizacion();
  const online = useOnline();
  const monturasCategoriaId = categorias.find((category) => category.key === "monturas")?.id;
  const monturas = productos.filter((product) => product.categoriaId === monturasCategoriaId);
  const [montura, setMontura] = useState("");
  const [od, setOd] = useState("");
  const [oi, setOi] = useState("");
  const [astOD, setAstOD] = useState("");
  const [astOI, setAstOI] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [sede, setSede] = useState("");
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);
  const [mostrarCita, setMostrarCita] = useState(false);

  useEffect(() => {
    if (montura || monturas.length === 0) return;
    const requestedProduct = searchParams.get("producto");
    setMontura(monturas.some((item) => item.id === requestedProduct) ? requestedProduct! : monturas[0].id);
  }, [montura, monturas, searchParams]);

  useEffect(() => {
    if (!sede && sedes.length > 0) setSede(sedes[0].ciudad);
  }, [sede, sedes]);

  const selectedFrame = monturas.find((item) => item.id === montura);
  const extrasDisponibles = extrasActivos(configuracion);
  const lenteBase = configuracion?.lenteBase ?? 0;
  const extrasTotal = extras.reduce((sum, key) => sum + (extrasDisponibles.find((extra) => extra.key === key)?.precio ?? 0), 0);
  // Total de vista previa — el total real y autoritativo lo calcula el
  // backend y es el que se usa en la confirmación y el mensaje de WhatsApp.
  const total = calcularTotalPreview(configuracion, selectedFrame?.precio ?? 0, extras);

  function toggleExtra(key: string) {
    setExtras((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  async function registerQuote() {
    if (!online) {
      setError("Necesitas conexión a internet para registrar la cotización.");
      return;
    }
    if (!nombre.trim() || !telefono.trim() || !selectedFrame) {
      setError("Completa nombre, teléfono y montura para continuar.");
      return;
    }
    const selectedLocation = sedes.find((item) => item.ciudad === sede);
    if (!selectedLocation) {
      setError("Elige una sede.");
      return;
    }
    if (!configuracion) {
      setError("No se pudo cargar la configuración de precios. Intenta de nuevo.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      // Se envía sin "total": lo calcula el backend a partir del producto real
      // y la configuración vigente (nunca lo que el cliente traiga en memoria).
      const creada = await cotizacionesApi.crearCotizacion({ nombre: nombre.trim(), telefono: telefono.trim(), sedeId: selectedLocation.id, productoId: selectedFrame.id, od, oi, astigmatismoOD: astOD, astigmatismoOI: astOI, extras, fecha: new Date().toISOString().slice(0, 10) });
      const extraLabels = extras.map((key) => extrasDisponibles.find((extra) => extra.key === key)?.label ?? key);
      // Usa el total devuelto por el backend, no el de vista previa: si la
      // configuración cambió entre que se cargó la página y el envío, el
      // total autoritativo prevalece.
      const message = buildWAMessage({ tipo: "cotizacion", montura: selectedFrame.nombre, od, oi, astOD, astOI, extras: extraLabels, total: creada.total, sede });
      const opened = openWA(message, getSedeWhatsapp(sedes, sede));
      setConfirmacion(opened ? "Cotización registrada. Se abrió WhatsApp para continuar con la sede." : "Cotización registrada. La sede todavía no tiene WhatsApp real configurado; el equipo debe contactarte al teléfono indicado.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo registrar la cotización. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const citaAgendada = (info: { sede: string }) => openWA(buildWAMessage({ tipo: "cita", sede: info.sede, montura: selectedFrame?.nombre }), getSedeWhatsapp(sedes, info.sede));
  // La config de precios se necesita desde el paso de extras en adelante, así
  // que bloquea todo el wizard igual que productos/categorías — no se puede
  // avanzar a extras ni al resumen sin ella (evita mostrar/cobrar un total
  // que el backend luego recalcularía distinto).
  const loading = productosLoading || categoriasLoading || configLoading;

  return (
    <main className={styles.page}>
      <header className={styles.hero}><span>Lentes adaptados</span><h1>Cotiza con tu fórmula, paso a paso.</h1><p>Selecciona una montura disponible, registra la graduación y revisa el total estimado antes de elegir sede.</p></header>
      <section className={styles.wizard}>
        <nav className={styles.steps} aria-label="Pasos de cotización">{STEP_LABELS.map((label, index) => <button key={label} type="button" onClick={() => setStep(index + 1)} className={step === index + 1 ? styles.activeStep : ""}><span>{index + 1}</span>{label}</button>)}</nav>
        {loading && <DataState kind="loading" title="Cargando monturas" message="Consultando el catálogo disponible." />}
        {!loading && (productosError || configError) && <DataState kind="error" title="No pudimos cargar la cotización" message={productosError ?? configError ?? "Intenta de nuevo en unos minutos."} />}
        {!loading && !productosError && !configError && monturas.length === 0 && <DataState kind="empty" title="No hay monturas disponibles" message="El catálogo actual no contiene monturas para cotizar." />}

        {!loading && !productosError && !configError && monturas.length > 0 && step === 1 && <div className={styles.panel}>
          <div className={styles.panelHeading}><span className={styles.panelIcon}><Glasses aria-hidden="true" /></span><div><h2>Montura y graduación</h2><p>Usa los valores de tu receta más reciente. Los campos en blanco se registran sin corrección.</p></div></div>
          <div className={`${form.field} ${form.full}`}><label htmlFor="frame">Montura</label><select id="frame" value={montura} onChange={(event) => setMontura(event.target.value)}>{monturas.map((item) => <option key={item.id} value={item.id}>{item.nombre} — ${item.precio}</option>)}</select></div>
          <div className={form.grid}><GraduationSelect id="od" label="Miopía / Hipermetropía OD" value={od} onChange={setOd} /><GraduationSelect id="oi" label="Miopía / Hipermetropía OI" value={oi} onChange={setOi} /><GraduationSelect id="ast-od" label="Astigmatismo OD" value={astOD} onChange={setAstOD} astigmatism /><GraduationSelect id="ast-oi" label="Astigmatismo OI" value={astOI} onChange={setAstOI} astigmatism /></div>
          <div className={styles.panelActions}><button className={styles.secondaryButton} type="button" onClick={() => setMostrarCita(true)}><CalendarSearch size={17} /> No tengo receta</button><button className={styles.primaryButton} type="button" onClick={() => setStep(2)}>Continuar <ChevronRight size={17} /></button></div>
        </div>}

        {!loading && step === 2 && <div className={styles.panel}>
          <div className={styles.panelHeading}><span className={styles.panelIcon}><Check aria-hidden="true" /></span><div><h2>Extras de lentes</h2><p>Selecciona únicamente los tratamientos que quieres incluir en la estimación.</p></div></div>
          <div className={styles.extras}>{extrasDisponibles.map((extra) => { const selected = extras.includes(extra.key); return <button key={extra.key} type="button" className={selected ? styles.extraSelected : ""} onClick={() => toggleExtra(extra.key)}>{selected ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}<span><strong>{extra.label}</strong><small>{extra.descripcion}</small></span><b>+${extra.precio}</b></button>; })}</div>
          <div className={styles.panelActions}><button className={styles.secondaryButton} type="button" onClick={() => setStep(1)}><ChevronLeft size={17} /> Atrás</button><button className={styles.primaryButton} type="button" onClick={() => setStep(3)}>Continuar <ChevronRight size={17} /></button></div>
        </div>}

        {!loading && step === 3 && <div className={styles.panel}>
          <div className={styles.panelHeading}><span className={styles.panelIcon}><FileText aria-hidden="true" /></span><div><h2>Sede y cotización</h2><p>Revisa el resumen y registra tus datos antes de continuar por WhatsApp.</p></div></div>
          <div className={styles.quoteLayout}>
            <div className={styles.summary}><h3>Resumen</h3><dl><div><dt>Montura</dt><dd>{selectedFrame?.nombre}</dd></div><div><dt>OD</dt><dd>{od || "Sin corrección"}</dd></div><div><dt>OI</dt><dd>{oi || "Sin corrección"}</dd></div><div><dt>Extras</dt><dd>{extras.length ? extras.map((key) => extrasDisponibles.find((extra) => extra.key === key)?.label).join(", ") : "Ninguno"}</dd></div></dl><div className={styles.total}><span>Montura ${selectedFrame?.precio} + lente base ${lenteBase} + extras ${extrasTotal}</span><strong>${total}</strong><small>Total estimado</small></div></div>
            <div className={styles.formSide}>
              {!online && !confirmacion && <p className={form.error} role="alert">Sin conexión: necesitas internet para registrar la cotización.</p>}
              {error && <p className={form.error} role="alert">{error}</p>}
              {confirmacion ? <div className={styles.confirmation}><CheckCircle2 aria-hidden="true" /><div><h3>Cotización registrada</h3><p>{confirmacion}</p></div></div> : <>
                <p className={form.notice}>Pedimos nombre y teléfono para registrar la cotización antes de abrir WhatsApp.</p>
                <div className={form.field}><label htmlFor="quote-name">Nombre</label><input id="quote-name" value={nombre} onChange={(event) => setNombre(event.target.value)} autoComplete="name" placeholder="Escribe tu nombre" /></div>
                <div className={form.field}><label htmlFor="quote-phone">Teléfono</label><input id="quote-phone" value={telefono} onChange={(event) => setTelefono(event.target.value)} autoComplete="tel" inputMode="tel" placeholder="Número de contacto" /></div>
                <div className={form.field}><label htmlFor="quote-location">Sede de entrega</label><select id="quote-location" value={sede} onChange={(event) => setSede(event.target.value)}><option value="">Selecciona una sede</option>{sedes.map((item) => <option key={item.id} value={item.ciudad}>{item.ciudad}</option>)}</select></div>
                <OptionalGooglePrefill onName={setNombre} />
                <button className={styles.registerButton} type="button" onClick={registerQuote} disabled={enviando || !online}>{enviando ? "Registrando..." : <>Registrar cotización <ChevronRight size={17} /></>}</button>
              </>}
            </div>
          </div>
          <div className={styles.panelActions}><button className={styles.secondaryButton} type="button" onClick={() => setStep(2)} disabled={enviando}><ChevronLeft size={17} /> Atrás</button><button className={styles.secondaryButton} type="button" onClick={() => setMostrarCita(true)} disabled={enviando}><CalendarSearch size={17} /> Solicitar examen primero</button></div>
        </div>}
      </section>
      {mostrarCita && <AgendarCitaModal motivo="Evaluación visual" onClose={() => setMostrarCita(false)} onAgendada={citaAgendada} />}
    </main>
  );
}
