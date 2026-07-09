import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SEDES = [
  { id: 1, ciudad: "Caracas", direccion: "Av. Francisco de Miranda, Centro Comercial Lido, Local 24", telefono: "+58 412-555-0101", whatsapp: "58412555010", horario: "Lun–Sáb 9am–7pm", maps: "https://maps.google.com" },
  { id: 2, ciudad: "Valencia", direccion: "C.C. Sambil Valencia, Nivel Feria, Local 18", telefono: "+58 414-555-0202", whatsapp: "58414555020", horario: "Lun–Sáb 9am–7pm", maps: "https://maps.google.com" },
  { id: 3, ciudad: "Maracaibo", direccion: "Av. 5 de Julio, C.C. Costa Verde, Local 31", telefono: "+58 416-555-0303", whatsapp: "58416555030", horario: "Lun–Sáb 9am–6pm", maps: "https://maps.google.com" },
];

const INITIAL_PRODUCTS = [
  { id: 1, nombre: "Montura Classic Pro", categoria: "monturas", precio: 45, imagen: "👓", descripcion: "Marco acetato premium, ligero y duradero. Disponible en negro, tortuga y azul.", stock: 12, destacado: true },
  { id: 2, nombre: "Montura Slim Line", categoria: "monturas", precio: 38, imagen: "🕶", descripcion: "Armazón metálico ultra-delgado. Estilo minimalista para uso diario.", stock: 8, destacado: false },
  { id: 3, nombre: "Montura Kids Fun", categoria: "monturas", precio: 30, imagen: "👓", descripcion: "Flexible y resistente para niños. Colores vibrantes y ajuste seguro.", stock: 15, destacado: false },
  { id: 4, nombre: "Solar Aviator UV400", categoria: "solares", precio: 55, imagen: "🕶", descripcion: "Protección UV400 total. Lente polarizada, marco dorado.", stock: 10, destacado: true },
  { id: 5, nombre: "Solar Deportivo Xtreme", categoria: "solares", precio: 62, imagen: "🥽", descripcion: "Wrap-around para actividades al aire libre. Antideslizante.", stock: 6, destacado: false },
  { id: 6, nombre: "Solar Cat Eye", categoria: "solares", precio: 50, imagen: "🕶", descripcion: "Estilo retro femenino. Degradado espejo con protección total.", stock: 9, destacado: false },
  { id: 7, nombre: "Sport Running Elite", categoria: "deporte", precio: 70, imagen: "🥽", descripcion: "Para corredores. Lente intercambiable, ultra-ligero.", stock: 5, destacado: true },
  { id: 8, nombre: "Sport Ciclismo Pro", categoria: "deporte", precio: 80, imagen: "🥽", descripcion: "Aerodinámica, ventilación lateral, antivaho.", stock: 4, destacado: false },
];

const INITIAL_CITAS = [
  { id: 1, nombre: "Laura Pérez", telefono: "+58 412-111-2233", sede: "Caracas", fecha: "2025-07-10", hora: "10:00", motivo: "Examen de la vista", estado: "pendiente", nota: "" },
  { id: 2, nombre: "Carlos Gómez", telefono: "+58 414-222-3344", sede: "Valencia", fecha: "2025-07-11", hora: "14:30", motivo: "Adaptación de lentes", estado: "confirmada", nota: "" },
];

const INITIAL_COTIZACIONES = [
  { id: 1, nombre: "Ana Rodríguez", telefono: "+58 416-333-4455", sede: "Maracaibo", montura: "Montura Classic Pro", od: "-1.00", oi: "-0.75", astigmatismoOD: "-0.50", astigmatismoOI: "-0.25", extras: ["Filtro azul"], total: 95, estado: "pendiente", fecha: "2025-07-08" },
];

const CATEGORIAS = [
  { key: "todos", label: "Todo" },
  { key: "monturas", label: "Monturas" },
  { key: "solares", label: "Lentes de sol" },
  { key: "deporte", label: "Deporte" },
];

const EXTRAS_LENTES = [
  { key: "fotocromatico", label: "Fotocromático", precio: 20, desc: "Se oscurece con la luz solar" },
  { key: "filtroazul", label: "Filtro de luz azul", precio: 15, desc: "Protege de pantallas digitales" },
  { key: "antirreflejo", label: "Antirreflejo", precio: 10, desc: "Elimina reflejos molestos" },
  { key: "ultrafino", label: "Lente ultrafino", precio: 25, desc: "Índice 1.67, ideal para alta graduación" },
];

const SERVICIOS = [
  { icon: "👁", nombre: "Examen visual completo", desc: "Evaluación refractiva, fondo de ojo y presión intraocular con equipos de última generación.", precio: "Desde $15" },
  { icon: "🔬", nombre: "Topografía corneal", desc: "Mapeo detallado de la córnea para diagnóstico preciso y adaptación de lentes de contacto.", precio: "Desde $25" },
  { icon: "👶", nombre: "Optometría pediátrica", desc: "Evaluación especializada para niños desde los 6 meses. Detección temprana de ambliopía.", precio: "Desde $18" },
  { icon: "📋", nombre: "Adaptación de lentes de contacto", desc: "Selección y adaptación personalizada de lentes de contacto blandas y rígidas.", precio: "Desde $20" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const WA_NUM = "58412555010";

function buildWAMessage(tipo, data) {
  if (tipo === "reserva") {
    return encodeURIComponent(`Hola OptiBlue! Me interesa reservar: *${data.nombre}*\nSede: ${data.sede || "por confirmar"}\nPrecio: $${data.precio}`);
  }
  if (tipo === "cotizacion") {
    let msg = `Hola OptiBlue! Quiero cotizar lentes adaptados:\n*Montura:* ${data.montura}\n*OD:* ${data.od || "—"}  *OI:* ${data.oi || "—"}\n*Astigmatismo OD:* ${data.astOD || "—"}  *OI:* ${data.astOI || "—"}\n*Extras:* ${data.extras.length ? data.extras.join(", ") : "Ninguno"}\n*Total estimado:* $${data.total}\n*Sede preferida:* ${data.sede}`;
    return encodeURIComponent(msg);
  }
  if (tipo === "cita") {
    return encodeURIComponent(`Hola OptiBlue! Quisiera agendar una cita para examen de la vista.\n*Sede:* ${data.sede}\n*Montura de interés:* ${data.montura}`);
  }
}

function openWA(msg) {
  window.open(`https://wa.me/${WA_NUM}?text=${msg}`, "_blank");
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  // Layout
  app: { fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#f8fafc", color: "#1e293b" },
  // Nav
  nav: { background: "#0f3460", color: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 },
  navLogo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  navLogoCircle: { width: 36, height: 36, background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  navBrand: { fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#fff" },
  navBrandBlue: { color: "#60a5fa" },
  navLinks: { display: "flex", gap: 6, alignItems: "center" },
  navLink: (active) => ({ background: active ? "#2563eb" : "transparent", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 14, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "background 0.15s" }),
  adminBtn: { background: "#1e40af", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  // Hero
  hero: { background: "linear-gradient(135deg, #0f3460 0%, #1e40af 60%, #2563eb 100%)", color: "#fff", padding: "64px 24px 48px", textAlign: "center" },
  heroTag: { display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "4px 14px", fontSize: 12, marginBottom: 16, fontWeight: 500 },
  heroH1: { fontSize: 36, fontWeight: 800, marginBottom: 14, lineHeight: 1.2 },
  heroSub: { fontSize: 16, opacity: 0.85, marginBottom: 28, maxWidth: 520, margin: "0 auto 28px" },
  heroBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  btnHeroP: { background: "#fff", color: "#1e40af", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  btnHeroS: { background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer" },
  // Sections
  section: { maxWidth: 1100, margin: "0 auto", padding: "48px 24px" },
  sectionTag: { fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  sectionH2: { fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 8 },
  sectionSub: { fontSize: 15, color: "#64748b", marginBottom: 32 },
  // Cards
  card: { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", transition: "box-shadow 0.2s" },
  cardImg: { fontSize: 52, textAlign: "center", padding: "28px 0 12px", background: "#f0f7ff" },
  cardBody: { padding: "14px 16px 16px" },
  cardCat: { fontSize: 11, color: "#2563eb", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 },
  cardName: { fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 },
  cardDesc: { fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.5 },
  cardPrice: { fontSize: 20, fontWeight: 800, color: "#1e40af", marginBottom: 10 },
  grid: (cols) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${cols}px, 1fr))`, gap: 20 }),
  // Buttons
  btnPrimary: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  btnGhost: { background: "#f0f7ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 9, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 8 },
  btnWA: { background: "#25D366", color: "#fff", border: "none", borderRadius: 9, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  // Filtros
  filterRow: { display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" },
  filterBtn: (active) => ({ background: active ? "#2563eb" : "#fff", color: active ? "#fff" : "#475569", border: `1px solid ${active ? "#2563eb" : "#e2e8f0"}`, borderRadius: 99, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }),
  // Lentes adaptados
  adaptBox: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px", marginBottom: 16 },
  adaptTitle: { fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 4 },
  adaptSub: { fontSize: 14, color: "#64748b", marginBottom: 20 },
  formRow: { display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" },
  formGroup: { display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 120 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: { border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#0f172a", outline: "none", background: "#f8fafc" },
  select: { border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#0f172a", background: "#f8fafc" },
  extraCard: (sel) => ({ border: `1.5px solid ${sel ? "#2563eb" : "#e2e8f0"}`, background: sel ? "#eff6ff" : "#fff", borderRadius: 10, padding: "12px", cursor: "pointer", transition: "all 0.15s" }),
  extraName: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  extraDesc: { fontSize: 12, color: "#64748b" },
  extraPrice: { fontSize: 13, fontWeight: 700, color: "#2563eb", marginTop: 4 },
  cotizTotal: { background: "#eff6ff", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cotizNum: { fontSize: 24, fontWeight: 800, color: "#1e40af" },
  // Sedes
  sedeCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px", display: "flex", flexDirection: "column", gap: 10 },
  sedeCity: { fontSize: 18, fontWeight: 800, color: "#0f172a" },
  sedeRow: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#475569" },
  sedeIcon: { fontSize: 16, flexShrink: 0, marginTop: 1 },
  // Servicios
  servCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px" },
  servIcon: { fontSize: 36, marginBottom: 12 },
  servName: { fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 },
  servDesc: { fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 10 },
  servPrice: { fontSize: 14, fontWeight: 700, color: "#2563eb" },
  // Admin
  adminSidebar: { width: 220, background: "#0f172a", color: "#fff", minHeight: "100vh", padding: "20px 0", flexShrink: 0 },
  adminMain: { flex: 1, background: "#f8fafc", minHeight: "100vh", overflow: "auto" },
  adminHeader: { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  adminContent: { padding: 28 },
  sideItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", background: active ? "#1e40af" : "transparent", color: active ? "#fff" : "#94a3b8", fontSize: 14, fontWeight: active ? 600 : 400, borderLeft: active ? "3px solid #60a5fa" : "3px solid transparent", transition: "all 0.15s" }),
  // Tables
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" },
  th: { background: "#f1f5f9", padding: "12px 14px", fontSize: 12, fontWeight: 700, color: "#475569", textAlign: "left", textTransform: "uppercase", letterSpacing: 0.5 },
  td: { padding: "13px 14px", fontSize: 14, color: "#334155", borderTop: "1px solid #f1f5f9" },
  badge: (color) => { const c = { verde: ["#d1fae5","#065f46"], azul: ["#dbeafe","#1e40af"], amarillo: ["#fef3c7","#92400e"], rojo: ["#fee2e2","#991b1b"] }[color] || ["#f1f5f9","#475569"]; return { background: c[0], color: c[1], borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 700 }; },
  // Stat cards
  statCard: { background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px 22px" },
  statNum: { fontSize: 28, fontWeight: 800, color: "#1e40af" },
  statLabel: { fontSize: 13, color: "#64748b", marginTop: 2 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28 },
  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(15,20,50,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal: { background: "#fff", borderRadius: 16, padding: 28, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 18 },
  // Forms admin
  formGroupFull: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 },
};

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function NavBar({ page, setPage, onAdmin }) {
  const links = [
    { key: "home", label: "Inicio" },
    { key: "productos", label: "Catálogo" },
    { key: "lentes", label: "Lentes adaptados" },
    { key: "servicios", label: "Oftalmología" },
    { key: "sedes", label: "Sedes" },
  ];
  return (
    <nav style={S.nav}>
      <div style={S.navLogo} onClick={() => setPage("home")}>
        <div style={S.navLogoCircle}>👁</div>
        <span style={S.navBrand}>Opti<span style={S.navBrandBlue}>Blue</span></span>
      </div>
      <div style={S.navLinks}>
        {links.map(l => (
          <button key={l.key} style={S.navLink(page === l.key)} onClick={() => setPage(l.key)}>{l.label}</button>
        ))}
        <button style={S.adminBtn} onClick={onAdmin}>⚙ Panel</button>
      </div>
    </nav>
  );
}

function Hero({ setPage }) {
  return (
    <div style={S.hero}>
      <div style={S.heroTag}>3 sedes en Venezuela 🇻🇪</div>
      <h1 style={S.heroH1}>Ve el mundo con claridad.<br />Estilo que te define.</h1>
      <p style={S.heroSub}>Monturas premium, lentes adaptados a tu graduación y atención oftalmológica de primera en Caracas, Valencia y Maracaibo.</p>
      <div style={S.heroBtns}>
        <button style={S.btnHeroP} onClick={() => setPage("productos")}>Ver catálogo</button>
        <button style={S.btnHeroS} onClick={() => setPage("lentes")}>Cotizar mis lentes</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 44, flexWrap: "wrap" }}>
        {[["👓", "+500 modelos"], ["🏆", "15 años de experiencia"], ["📍", "3 ciudades"], ["⭐", "4.9 en Google"]].map(([ic, t]) => (
          <div key={t} style={{ textAlign: "center", opacity: 0.9 }}>
            <div style={{ fontSize: 24 }}>{ic}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p, onReservar }) {
  const cats = { monturas: "Montura", solares: "Lente solar", deporte: "Deporte" };
  return (
    <div style={S.card}>
      <div style={S.cardImg}>{p.imagen}</div>
      <div style={S.cardBody}>
        <div style={S.cardCat}>{cats[p.categoria]}</div>
        <div style={S.cardName}>{p.nombre}</div>
        <div style={S.cardDesc}>{p.descripcion}</div>
        <div style={S.cardPrice}>${p.precio}</div>
        <button style={S.btnPrimary} onClick={() => onReservar(p)}>📅 Reservar</button>
        <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>Te redirigimos a WhatsApp</div>
      </div>
    </div>
  );
}

function ReservaModal({ producto, onClose }) {
  const [sede, setSede] = useState(SEDES[0].ciudad);
  function confirmar() {
    const msg = buildWAMessage("reserva", { nombre: producto.nombre, precio: producto.precio, sede });
    openWA(msg);
    onClose();
  }
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalTitle}>📅 Reservar — {producto.nombre}</div>
        <div style={{ fontSize: 22, textAlign: "center", padding: "16px 0" }}>{producto.imagen}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1e40af", textAlign: "center", marginBottom: 20 }}>${producto.precio}</div>
        <div style={S.formGroupFull}>
          <label style={S.label}>Elige tu sede</label>
          <select style={S.select} value={sede} onChange={e => setSede(e.target.value)}>
            {SEDES.map(s => <option key={s.id} value={s.ciudad}>{s.ciudad} — {s.direccion.slice(0, 35)}…</option>)}
          </select>
        </div>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Al continuar te redirigiremos a WhatsApp para coordinar tu reserva con la sede seleccionada.</p>
        <button style={S.btnWA} onClick={confirmar}>💬 Continuar por WhatsApp</button>
        <button style={{ ...S.btnGhost, marginTop: 10 }} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

function PageProductos({ products }) {
  const [cat, setCat] = useState("todos");
  const [modal, setModal] = useState(null);
  const filtered = cat === "todos" ? products : products.filter(p => p.categoria === cat);
  return (
    <div style={S.section}>
      <div style={S.sectionTag}>Catálogo</div>
      <h2 style={S.sectionH2}>Encuentra tu estilo</h2>
      <p style={S.sectionSub}>Explora nuestra colección de monturas, lentes de sol y equipos deportivos.</p>
      <div style={S.filterRow}>
        {CATEGORIAS.map(c => <button key={c.key} style={S.filterBtn(cat === c.key)} onClick={() => setCat(c.key)}>{c.label}</button>)}
      </div>
      {filtered.length === 0 ? <p style={{ color: "#94a3b8" }}>No hay productos en esta categoría.</p> : (
        <div style={S.grid(220)}>
          {filtered.map(p => <ProductCard key={p.id} p={p} onReservar={setModal} />)}
        </div>
      )}
      {modal && <ReservaModal producto={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

function PageLentes({ products }) {
  const monturas = products.filter(p => p.categoria === "monturas");
  const [montura, setMontura] = useState(monturas[0]?.id || "");
  const [od, setOd] = useState("");
  const [oi, setOi] = useState("");
  const [astOD, setAstOD] = useState("");
  const [astOI, setAstOI] = useState("");
  const [extras, setExtras] = useState([]);
  const [sede, setSede] = useState(SEDES[0].ciudad);
  const [step, setStep] = useState(1);

  const monObj = monturas.find(m => m.id === Number(montura));
  const extrasTotal = extras.reduce((s, k) => s + (EXTRAS_LENTES.find(e => e.key === k)?.precio || 0), 0);
  const total = (monObj?.precio || 0) + extrasTotal + 10;

  function toggleExtra(k) {
    setExtras(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  }
  function enviarWA() {
    const extrasLabels = extras.map(k => EXTRAS_LENTES.find(e => e.key === k)?.label || k);
    const msg = buildWAMessage("cotizacion", { montura: monObj?.nombre, od, oi, astOD, astOI, extras: extrasLabels, total, sede });
    openWA(msg);
  }
  function citaWA() {
    const msg = buildWAMessage("cita", { sede, montura: monObj?.nombre });
    openWA(msg);
  }

  const gradSteps = ["", "0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00", "2.25", "2.50", "2.75", "3.00", "3.50", "4.00", "4.50", "5.00", "5.50", "6.00"];

  return (
    <div style={S.section}>
      <div style={S.sectionTag}>Lentes adaptados</div>
      <h2 style={S.sectionH2}>Cotiza tus lentes con tu graduación</h2>
      <p style={S.sectionSub}>Completa los datos, elige los extras y te enviamos tu cotización por WhatsApp.</p>

      {/* Steps indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
        {["1. Montura y graduación", "2. Extras", "3. Sede y cotización"].map((s, i) => (
          <button key={i} onClick={() => setStep(i + 1)} style={{ flex: 1, padding: "10px 6px", fontSize: 13, fontWeight: step === i + 1 ? 700 : 400, background: step === i + 1 ? "#2563eb" : "transparent", color: step === i + 1 ? "#fff" : "#64748b", border: "none", cursor: "pointer", transition: "all 0.15s" }}>{s}</button>
        ))}
      </div>

      {step === 1 && (
        <div style={S.adaptBox}>
          <div style={S.adaptTitle}>Elige tu montura</div>
          <div style={S.adaptSub}>Selecciona la montura que deseas usar con tus lentes graduados.</div>
          <div style={S.formGroupFull}>
            <label style={S.label}>Montura</label>
            <select style={S.select} value={montura} onChange={e => setMontura(e.target.value)}>
              {monturas.map(m => <option key={m.id} value={m.id}>{m.nombre} — ${m.precio}</option>)}
            </select>
          </div>
          <div style={{ ...S.adaptTitle, marginTop: 20 }}>Tu graduación</div>
          <div style={{ ...S.adaptSub }}>Ingresa los valores de tu última receta. Si no tienes astigmatismo, déjalo en blanco.</div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Miopía / Hipermetropía OD</label>
              <select style={S.select} value={od} onChange={e => setOd(e.target.value)}>
                <option value="">Sin corrección</option>
                {gradSteps.slice(1).map(g => <option key={`-${g}`} value={`-${g}`}>-{g}</option>)}
                {gradSteps.slice(1).map(g => <option key={`+${g}`} value={`+${g}`}>+{g}</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Miopía / Hipermetropía OI</label>
              <select style={S.select} value={oi} onChange={e => setOi(e.target.value)}>
                <option value="">Sin corrección</option>
                {gradSteps.slice(1).map(g => <option key={`-${g}`} value={`-${g}`}>-{g}</option>)}
                {gradSteps.slice(1).map(g => <option key={`+${g}`} value={`+${g}`}>+{g}</option>)}
              </select>
            </div>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Astigmatismo OD (cilindro)</label>
              <select style={S.select} value={astOD} onChange={e => setAstOD(e.target.value)}>
                <option value="">Sin astigmatismo</option>
                {gradSteps.slice(1).map(g => <option key={g} value={`-${g}`}>-{g}</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Astigmatismo OI (cilindro)</label>
              <select style={S.select} value={astOI} onChange={e => setAstOI(e.target.value)}>
                <option value="">Sin astigmatismo</option>
                {gradSteps.slice(1).map(g => <option key={g} value={`-${g}`}>-{g}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button style={{ ...S.btnGhost, width: "auto" }} onClick={citaWA}>📅 No tengo receta — agendar examen</button>
            <button style={{ ...S.btnPrimary, width: "auto", padding: "10px 22px" }} onClick={() => setStep(2)}>Continuar →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={S.adaptBox}>
          <div style={S.adaptTitle}>Personaliza tus lentes</div>
          <div style={S.adaptSub}>Agrega tratamientos opcionales a tu lente.</div>
          <div style={S.grid(220)}>
            {EXTRAS_LENTES.map(e => (
              <div key={e.key} style={S.extraCard(extras.includes(e.key))} onClick={() => toggleExtra(e.key)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={S.extraName}>{e.label}</div>
                  <div style={{ fontSize: 18 }}>{extras.includes(e.key) ? "✅" : "⬜"}</div>
                </div>
                <div style={S.extraDesc}>{e.desc}</div>
                <div style={S.extraPrice}>+${e.precio}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <button style={{ ...S.btnGhost, width: "auto" }} onClick={() => setStep(1)}>← Atrás</button>
            <button style={{ ...S.btnPrimary, width: "auto", padding: "10px 22px" }} onClick={() => setStep(3)}>Continuar →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={S.adaptBox}>
          <div style={S.adaptTitle}>Tu cotización</div>
          <div style={S.adaptSub}>Revisa el resumen y elige dónde retirar.</div>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 14, color: "#334155" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
              <div><b>Montura:</b></div><div>{monObj?.nombre}</div>
              <div><b>OD:</b></div><div>{od || "Sin corrección"}</div>
              <div><b>OI:</b></div><div>{oi || "Sin corrección"}</div>
              {astOD && <><div><b>Astig. OD:</b></div><div>{astOD}</div></>}
              {astOI && <><div><b>Astig. OI:</b></div><div>{astOI}</div></>}
              <div><b>Extras:</b></div><div>{extras.length ? extras.map(k => EXTRAS_LENTES.find(e => e.key === k)?.label).join(", ") : "Ninguno"}</div>
            </div>
          </div>
          <div style={S.cotizTotal}>
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Montura ${monObj?.precio} + lente base $10 + extras ${extrasTotal}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Total estimado</div>
            </div>
            <div style={S.cotizNum}>${total}</div>
          </div>
          <div style={S.formGroupFull}>
            <label style={S.label}>Sede de entrega</label>
            <select style={S.select} value={sede} onChange={e => setSede(e.target.value)}>
              {SEDES.map(s => <option key={s.id} value={s.ciudad}>{s.ciudad}</option>)}
            </select>
          </div>
          <button style={S.btnWA} onClick={enviarWA}>💬 Enviar cotización por WhatsApp</button>
          <button style={{ ...S.btnGhost, marginTop: 10 }} onClick={citaWA}>📅 Agendar examen visual primero</button>
          <button style={{ ...S.btnGhost, marginTop: 8 }} onClick={() => setStep(2)}>← Atrás</button>
        </div>
      )}
    </div>
  );
}

function PageServicios() {
  function reservarServicio(s) {
    const msg = encodeURIComponent(`Hola OptiBlue! Quisiera agendar: *${s.nombre}*`);
    openWA(msg);
  }
  return (
    <div style={S.section}>
      <div style={S.sectionTag}>Oftalmología</div>
      <h2 style={S.sectionH2}>Servicios especializados</h2>
      <p style={S.sectionSub}>Atención oftalmológica con tecnología de vanguardia y profesionales certificados.</p>
      <div style={S.grid(240)}>
        {SERVICIOS.map(s => (
          <div key={s.nombre} style={S.servCard}>
            <div style={S.servIcon}>{s.icon}</div>
            <div style={S.servName}>{s.nombre}</div>
            <div style={S.servDesc}>{s.desc}</div>
            <div style={S.servPrice}>{s.precio}</div>
            <button style={{ ...S.btnPrimary, marginTop: 12 }} onClick={() => reservarServicio(s)}>📅 Agendar cita</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageSedes() {
  return (
    <div style={S.section}>
      <div style={S.sectionTag}>Dónde encontrarnos</div>
      <h2 style={S.sectionH2}>Nuestras 3 sedes</h2>
      <p style={S.sectionSub}>Visítanos en Caracas, Valencia o Maracaibo. Agenda por WhatsApp desde cualquier sede.</p>
      <div style={S.grid(300)}>
        {SEDES.map(s => (
          <div key={s.id} style={S.sedeCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📍</div>
              <div style={S.sedeCity}>{s.ciudad}</div>
            </div>
            <div style={S.sedeRow}><span style={S.sedeIcon}>🏢</span><span>{s.direccion}</span></div>
            <div style={S.sedeRow}><span style={S.sedeIcon}>📞</span><span>{s.telefono}</span></div>
            <div style={S.sedeRow}><span style={S.sedeIcon}>🕐</span><span>{s.horario}</span></div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button style={{ ...S.btnWA, fontSize: 13, padding: "9px 14px" }} onClick={() => openWA(encodeURIComponent(`Hola! Estoy interesado en la sede de ${s.ciudad}`))}>💬 WhatsApp</button>
              <button style={{ ...S.btnGhost, fontSize: 13 }} onClick={() => window.open(s.maps, "_blank")}>🗺 Ver mapa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageHome({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={S.section}>
          <div style={S.sectionTag}>Lo más buscado</div>
          <h2 style={S.sectionH2}>Productos destacados</h2>
          <p style={S.sectionSub}>Nuestra selección de temporada.</p>
          <div style={S.grid(220)}>
            {INITIAL_PRODUCTS.filter(p => p.destacado).map(p => (
              <ProductCard key={p.id} p={p} onReservar={(pr) => { alert(`Abriendo WhatsApp para reservar ${pr.nombre}`); }} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button style={{ ...S.btnPrimary, width: "auto", padding: "12px 28px" }} onClick={() => setPage("productos")}>Ver catálogo completo →</button>
          </div>
        </div>
      </div>
      <div style={{ background: "#f0f7ff" }}>
        <div style={S.section}>
          <div style={S.sectionTag}>Oftalmología</div>
          <h2 style={S.sectionH2}>Cuida tu salud visual</h2>
          <p style={S.sectionSub}>Contamos con especialistas y equipos modernos en todas nuestras sedes.</p>
          <div style={S.grid(240)}>
            {SERVICIOS.slice(0, 2).map(s => (
              <div key={s.nombre} style={S.servCard}>
                <div style={S.servIcon}>{s.icon}</div>
                <div style={S.servName}>{s.nombre}</div>
                <div style={S.servDesc}>{s.desc}</div>
                <div style={S.servPrice}>{s.precio}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button style={{ ...S.btnGhost, width: "auto", padding: "10px 24px" }} onClick={() => setPage("servicios")}>Ver todos los servicios →</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────

function AdminPanel({ products, setProducts, citas, setCitas, cotizaciones, setCotizaciones, onExit }) {
  const [seccion, setSeccion] = useState("dashboard");
  const [modal, setModal] = useState(null);

  const sections = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "productos", icon: "👓", label: "Productos" },
    { key: "citas", icon: "📅", label: "Citas" },
    { key: "cotizaciones", icon: "💰", label: "Cotizaciones" },
    { key: "sedes", icon: "📍", label: "Sedes" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={S.adminSidebar}>
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #1e293b", marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>👁 OptiBlue</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Panel de administración</div>
        </div>
        {sections.map(s => (
          <div key={s.key} style={S.sideItem(seccion === s.key)} onClick={() => setSeccion(s.key)}>
            <span>{s.icon}</span><span>{s.label}</span>
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "20px" }}>
          <button onClick={onExit} style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", width: "100%" }}>← Ver sitio</button>
        </div>
      </div>

      <div style={S.adminMain}>
        <div style={S.adminHeader}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{sections.find(s => s.key === seccion)?.label}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>OptiBlue · Panel de gestión</div>
          </div>
        </div>
        <div style={S.adminContent}>
          {seccion === "dashboard" && <AdminDash products={products} citas={citas} cotizaciones={cotizaciones} />}
          {seccion === "productos" && <AdminProductos products={products} setProducts={setProducts} />}
          {seccion === "citas" && <AdminCitas citas={citas} setCitas={setCitas} />}
          {seccion === "cotizaciones" && <AdminCotizaciones cotizaciones={cotizaciones} setCotizaciones={setCotizaciones} />}
          {seccion === "sedes" && <AdminSedes />}
        </div>
      </div>
    </div>
  );
}

function AdminDash({ products, citas, cotizaciones }) {
  const stats = [
    { num: products.length, label: "Productos activos" },
    { num: citas.length, label: "Citas registradas" },
    { num: cotizaciones.length, label: "Cotizaciones" },
    { num: citas.filter(c => c.estado === "pendiente").length, label: "Citas pendientes" },
  ];
  return (
    <>
      <div style={S.statGrid}>
        {stats.map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statNum}>{s.num}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ ...S.card, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Citas recientes</div>
          {citas.slice(0, 3).map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
              <div><div style={{ fontWeight: 600 }}>{c.nombre}</div><div style={{ fontSize: 12, color: "#64748b" }}>{c.sede} · {c.fecha}</div></div>
              <span style={S.badge(c.estado === "confirmada" ? "verde" : "amarillo")}>{c.estado}</span>
            </div>
          ))}
        </div>
        <div style={{ ...S.card, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Cotizaciones recientes</div>
          {cotizaciones.slice(0, 3).map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
              <div><div style={{ fontWeight: 600 }}>{c.nombre}</div><div style={{ fontSize: 12, color: "#64748b" }}>{c.montura}</div></div>
              <div style={{ fontWeight: 800, color: "#1e40af" }}>${c.total}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminProductos({ products, setProducts }) {
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [nuevo, setNuevo] = useState(false);

  function abrirEditar(p) { setForm({ ...p }); setEditando(p.id); setNuevo(false); }
  function abrirNuevo() { setForm({ nombre: "", categoria: "monturas", precio: "", imagen: "👓", descripcion: "", stock: 0, destacado: false }); setEditando("new"); setNuevo(true); }
  function guardar() {
    if (nuevo) {
      setProducts(prev => [...prev, { ...form, id: Date.now(), precio: Number(form.precio), stock: Number(form.stock) }]);
    } else {
      setProducts(prev => prev.map(p => p.id === editando ? { ...form, precio: Number(form.precio), stock: Number(form.stock) } : p));
    }
    setEditando(null);
  }
  function eliminar(id) { if (window.confirm("¿Eliminar producto?")) setProducts(prev => prev.filter(p => p.id !== id)); }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={{ ...S.btnPrimary, width: "auto", padding: "10px 20px" }} onClick={abrirNuevo}>+ Nuevo producto</button>
      </div>
      <table style={S.table}>
        <thead><tr>
          <th style={S.th}>Producto</th><th style={S.th}>Categoría</th><th style={S.th}>Precio</th><th style={S.th}>Stock</th><th style={S.th}>Destac.</th><th style={S.th}>Acciones</th>
        </tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={S.td}><span style={{ fontSize: 20, marginRight: 8 }}>{p.imagen}</span>{p.nombre}</td>
              <td style={S.td}><span style={S.badge("azul")}>{p.categoria}</span></td>
              <td style={S.td}><b>${p.precio}</b></td>
              <td style={S.td}>{p.stock}</td>
              <td style={S.td}>{p.destacado ? "⭐" : "—"}</td>
              <td style={S.td}>
                <button onClick={() => abrirEditar(p)} style={{ background: "#eff6ff", color: "#1e40af", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", marginRight: 6, fontSize: 13 }}>Editar</button>
                <button onClick={() => eliminar(p.id)} style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 13 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div style={S.overlay} onClick={() => setEditando(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>{nuevo ? "Nuevo producto" : "Editar producto"}</div>
            {[["nombre", "Nombre"], ["descripcion", "Descripción"], ["imagen", "Emoji / ícono"], ["precio", "Precio ($)"], ["stock", "Stock"]].map(([k, l]) => (
              <div key={k} style={S.formGroupFull}>
                <label style={S.label}>{l}</label>
                <input style={S.input} value={form[k] || ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={S.formGroupFull}>
              <label style={S.label}>Categoría</label>
              <select style={S.select} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                <option value="monturas">Monturas</option>
                <option value="solares">Lentes de sol</option>
                <option value="deporte">Deporte</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <input type="checkbox" checked={!!form.destacado} onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))} />
              <label style={S.label}>Producto destacado (aparece en el inicio)</label>
            </div>
            <button style={S.btnPrimary} onClick={guardar}>Guardar</button>
            <button style={{ ...S.btnGhost, marginTop: 8 }} onClick={() => setEditando(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
}

function AdminCitas({ citas, setCitas }) {
  const estados = ["pendiente", "confirmada", "completada", "cancelada"];
  const colores = { pendiente: "amarillo", confirmada: "azul", completada: "verde", cancelada: "rojo" };

  function cambiarEstado(id, estado) { setCitas(prev => prev.map(c => c.id === id ? { ...c, estado } : c)); }
  function eliminar(id) { if (window.confirm("¿Eliminar cita?")) setCitas(prev => prev.filter(c => c.id !== id)); }

  return (
    <table style={S.table}>
      <thead><tr>
        <th style={S.th}>Paciente</th><th style={S.th}>Sede</th><th style={S.th}>Fecha / Hora</th><th style={S.th}>Motivo</th><th style={S.th}>Estado</th><th style={S.th}>Acciones</th>
      </tr></thead>
      <tbody>
        {citas.map(c => (
          <tr key={c.id}>
            <td style={S.td}><div style={{ fontWeight: 600 }}>{c.nombre}</div><div style={{ fontSize: 12, color: "#64748b" }}>{c.telefono}</div></td>
            <td style={S.td}>{c.sede}</td>
            <td style={S.td}>{c.fecha} · {c.hora}</td>
            <td style={S.td}>{c.motivo}</td>
            <td style={S.td}>
              <select value={c.estado} onChange={e => cambiarEstado(c.id, e.target.value)} style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px", fontSize: 13 }}>
                {estados.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </td>
            <td style={S.td}>
              <button onClick={() => openWA(encodeURIComponent(`Hola ${c.nombre}! Te confirmamos tu cita en OptiBlue ${c.sede} el ${c.fecha} a las ${c.hora}.`))} style={{ background: "#d1fae5", color: "#065f46", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", marginRight: 6, fontSize: 12 }}>💬 WA</button>
              <button onClick={() => eliminar(c.id)} style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>Eliminar</button>
            </td>
          </tr>
        ))}
        {citas.length === 0 && <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "#94a3b8" }}>No hay citas registradas.</td></tr>}
      </tbody>
    </table>
  );
}

function AdminCotizaciones({ cotizaciones, setCotizaciones }) {
  const colores = { pendiente: "amarillo", contactado: "azul", cerrada: "verde" };
  function cambiarEstado(id, estado) { setCotizaciones(prev => prev.map(c => c.id === id ? { ...c, estado } : c)); }
  return (
    <table style={S.table}>
      <thead><tr>
        <th style={S.th}>Cliente</th><th style={S.th}>Montura</th><th style={S.th}>Graduación</th><th style={S.th}>Extras</th><th style={S.th}>Total</th><th style={S.th}>Estado</th><th style={S.th}>WA</th>
      </tr></thead>
      <tbody>
        {cotizaciones.map(c => (
          <tr key={c.id}>
            <td style={S.td}><div style={{ fontWeight: 600 }}>{c.nombre}</div><div style={{ fontSize: 12, color: "#64748b" }}>{c.telefono}</div></td>
            <td style={S.td}>{c.montura}</td>
            <td style={S.td} style={{ fontSize: 12 }}>OD {c.od || "—"} / OI {c.oi || "—"}</td>
            <td style={S.td}>{c.extras?.join(", ") || "—"}</td>
            <td style={S.td}><b style={{ color: "#1e40af" }}>${c.total}</b></td>
            <td style={S.td}>
              <select value={c.estado} onChange={e => cambiarEstado(c.id, e.target.value)} style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 8px", fontSize: 13 }}>
                {["pendiente", "contactado", "cerrada"].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </td>
            <td style={S.td}>
              <button onClick={() => openWA(encodeURIComponent(`Hola ${c.nombre}! Te contactamos de OptiBlue por tu cotización de ${c.montura} por $${c.total}.`))} style={{ background: "#d1fae5", color: "#065f46", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>💬</button>
            </td>
          </tr>
        ))}
        {cotizaciones.length === 0 && <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#94a3b8" }}>No hay cotizaciones.</td></tr>}
      </tbody>
    </table>
  );
}

function AdminSedes() {
  return (
    <div style={S.grid(280)}>
      {SEDES.map(s => (
        <div key={s.id} style={{ ...S.card, padding: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>📍 {s.ciudad}</div>
          <div style={{ fontSize: 14, color: "#475569", marginBottom: 4 }}>{s.direccion}</div>
          <div style={{ fontSize: 14, color: "#475569", marginBottom: 4 }}>📞 {s.telefono}</div>
          <div style={{ fontSize: 14, color: "#475569", marginBottom: 12 }}>🕐 {s.horario}</div>
          <button style={{ ...S.btnWA, fontSize: 13 }} onClick={() => openWA(encodeURIComponent(`Hola! Consulta desde sede ${s.ciudad}`))}>💬 Probar WhatsApp</button>
        </div>
      ))}
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "40px 24px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>👁 OptiBlue</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>Tu óptica de confianza en Venezuela. Tecnología, estilo y salud visual en un solo lugar.</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Catálogo</div>
            {["Monturas", "Lentes de sol", "Deporte", "Lentes adaptados"].map(l => (
              <div key={l} style={{ fontSize: 13, marginBottom: 6, cursor: "pointer" }} onClick={() => setPage(l === "Lentes adaptados" ? "lentes" : "productos")}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Sedes</div>
            {SEDES.map(s => <div key={s.id} style={{ fontSize: 13, marginBottom: 6 }}>📍 {s.ciudad}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Contacto</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>💬 WhatsApp disponible</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>📅 Citas en línea</div>
            <div style={{ fontSize: 13 }}>Lun–Sáb 9am–7pm</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 16, fontSize: 12, textAlign: "center" }}>
          © 2025 OptiBlue · Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [adminMode, setAdminMode] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [citas, setCitas] = useState(INITIAL_CITAS);
  const [cotizaciones, setCotizaciones] = useState(INITIAL_COTIZACIONES);

  if (adminMode) {
    return (
      <div style={S.app}>
        <AdminPanel products={products} setProducts={setProducts} citas={citas} setCitas={setCitas} cotizaciones={cotizaciones} setCotizaciones={setCotizaciones} onExit={() => setAdminMode(false)} />
      </div>
    );
  }

  return (
    <div style={S.app}>
      <NavBar page={page} setPage={setPage} onAdmin={() => setAdminMode(true)} />
      {page === "home" && <PageHome setPage={setPage} />}
      {page === "productos" && <PageProductos products={products} />}
      {page === "lentes" && <PageLentes products={products} />}
      {page === "servicios" && <PageServicios />}
      {page === "sedes" && <PageSedes />}
      <Footer setPage={setPage} />
    </div>
  );
}
