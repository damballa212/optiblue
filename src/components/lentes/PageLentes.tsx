import { useState, useEffect } from "react";
import { EXTRAS_LENTES } from "../../data";
import { useProductos } from "../../hooks/useProductos";
import { useCategorias } from "../../hooks/useCategorias";
import { useSedes } from "../../hooks/useSedes";
import { buildWAMessage, openWA, getSedeWhatsapp } from "../../lib/whatsapp";
import { section, sectionTag, sectionH2, sectionSub, grid, formGroupFull, label, select, btnPrimary, btnGhost, btnWA } from "../../styles/shared";
import * as S from "./PageLentes.styles";

const GRAD_STEPS = ["", "0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00", "2.25", "2.50", "2.75", "3.00", "3.50", "4.00", "4.50", "5.00", "5.50", "6.00"];

const STEP_LABELS = ["1. Montura y graduación", "2. Extras", "3. Sede y cotización"];

const LENTE_BASE = 10;

export function PageLentes() {
  const { productos } = useProductos();
  const { categorias } = useCategorias();
  const monturasCategoriaId = categorias.find((c) => c.key === "monturas")?.id;
  const monturas = productos.filter((p) => p.categoriaId === monturasCategoriaId);
  const [montura, setMontura] = useState<string>("");

  // La lista de monturas llega asíncrono (Firestore); una vez disponible,
  // preseleccionamos la primera si el usuario todavía no eligió ninguna.
  useEffect(() => {
    if (!montura && monturas.length > 0) setMontura(monturas[0].id);
  }, [montura, monturas]);
  const [od, setOd] = useState("");
  const [oi, setOi] = useState("");
  const [astOD, setAstOD] = useState("");
  const [astOI, setAstOI] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const { sedes } = useSedes();
  const [sede, setSede] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!sede && sedes.length > 0) setSede(sedes[0].ciudad);
  }, [sede, sedes]);

  const monObj = monturas.find((m) => m.id === montura);
  const extrasTotal = extras.reduce((sum, k) => sum + (EXTRAS_LENTES.find((e) => e.key === k)?.precio ?? 0), 0);
  const total = (monObj?.precio ?? 0) + extrasTotal + LENTE_BASE;

  function toggleExtra(k: string) {
    setExtras((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  function enviarWA() {
    const extrasLabels = extras.map((k) => EXTRAS_LENTES.find((e) => e.key === k)?.label ?? k);
    const msg = buildWAMessage({ tipo: "cotizacion", montura: monObj?.nombre, od, oi, astOD, astOI, extras: extrasLabels, total, sede });
    openWA(msg, getSedeWhatsapp(sedes, sede));
  }

  function citaWA() {
    const msg = buildWAMessage({ tipo: "cita", sede, montura: monObj?.nombre });
    openWA(msg, getSedeWhatsapp(sedes, sede));
  }

  return (
    <div style={section}>
      <div style={sectionTag}>Lentes adaptados</div>
      <h2 style={sectionH2}>Cotiza tus lentes con tu graduación</h2>
      <p style={sectionSub}>Completa los datos, elige los extras y te enviamos tu cotización por WhatsApp.</p>

      <div style={S.stepsWrap}>
        {STEP_LABELS.map((s, i) => (
          <button key={s} onClick={() => setStep(i + 1)} style={S.stepBtn(step === i + 1)}>
            {s}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div style={S.adaptBox}>
          <div style={S.adaptTitle}>Elige tu montura</div>
          <div style={S.adaptSub}>Selecciona la montura que deseas usar con tus lentes graduados.</div>
          <div style={formGroupFull}>
            <label style={label}>Montura</label>
            <select style={select} value={montura} onChange={(e) => setMontura(e.target.value)}>
              {monturas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} — ${m.precio}
                </option>
              ))}
            </select>
          </div>
          <div style={{ ...S.adaptTitle, marginTop: 20 }}>Tu graduación</div>
          <div style={S.adaptSub}>Ingresa los valores de tu última receta. Si no tienes astigmatismo, déjalo en blanco.</div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={label}>Miopía / Hipermetropía OD</label>
              <select style={select} value={od} onChange={(e) => setOd(e.target.value)}>
                <option value="">Sin corrección</option>
                {GRAD_STEPS.slice(1).map((g) => (
                  <option key={`-${g}`} value={`-${g}`}>
                    -{g}
                  </option>
                ))}
                {GRAD_STEPS.slice(1).map((g) => (
                  <option key={`+${g}`} value={`+${g}`}>
                    +{g}
                  </option>
                ))}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={label}>Miopía / Hipermetropía OI</label>
              <select style={select} value={oi} onChange={(e) => setOi(e.target.value)}>
                <option value="">Sin corrección</option>
                {GRAD_STEPS.slice(1).map((g) => (
                  <option key={`-${g}`} value={`-${g}`}>
                    -{g}
                  </option>
                ))}
                {GRAD_STEPS.slice(1).map((g) => (
                  <option key={`+${g}`} value={`+${g}`}>
                    +{g}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={label}>Astigmatismo OD (cilindro)</label>
              <select style={select} value={astOD} onChange={(e) => setAstOD(e.target.value)}>
                <option value="">Sin astigmatismo</option>
                {GRAD_STEPS.slice(1).map((g) => (
                  <option key={g} value={`-${g}`}>
                    -{g}
                  </option>
                ))}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={label}>Astigmatismo OI (cilindro)</label>
              <select style={select} value={astOI} onChange={(e) => setAstOI(e.target.value)}>
                <option value="">Sin astigmatismo</option>
                {GRAD_STEPS.slice(1).map((g) => (
                  <option key={g} value={`-${g}`}>
                    -{g}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={S.actionsRow}>
            <button style={{ ...btnGhost, width: "auto" }} onClick={citaWA}>
              📅 No tengo receta — agendar examen
            </button>
            <button style={{ ...btnPrimary, width: "auto", padding: "10px 22px" }} onClick={() => setStep(2)}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={S.adaptBox}>
          <div style={S.adaptTitle}>Personaliza tus lentes</div>
          <div style={S.adaptSub}>Agrega tratamientos opcionales a tu lente.</div>
          <div style={grid(220)}>
            {EXTRAS_LENTES.map((e) => (
              <div key={e.key} style={S.extraCard(extras.includes(e.key))} onClick={() => toggleExtra(e.key)}>
                <div style={S.extraHeader}>
                  <div style={S.extraName}>{e.label}</div>
                  <div style={{ fontSize: 18 }}>{extras.includes(e.key) ? "✅" : "⬜"}</div>
                </div>
                <div style={S.extraDesc}>{e.desc}</div>
                <div style={S.extraPrice}>+${e.precio}</div>
              </div>
            ))}
          </div>
          <div style={S.actionsRowTop}>
            <button style={{ ...btnGhost, width: "auto" }} onClick={() => setStep(1)}>
              ← Atrás
            </button>
            <button style={{ ...btnPrimary, width: "auto", padding: "10px 22px" }} onClick={() => setStep(3)}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={S.adaptBox}>
          <div style={S.adaptTitle}>Tu cotización</div>
          <div style={S.adaptSub}>Revisa el resumen y elige dónde retirar.</div>
          <div style={S.resumenBox}>
            <div style={S.resumenGrid}>
              <div>
                <b>Montura:</b>
              </div>
              <div>{monObj?.nombre}</div>
              <div>
                <b>OD:</b>
              </div>
              <div>{od || "Sin corrección"}</div>
              <div>
                <b>OI:</b>
              </div>
              <div>{oi || "Sin corrección"}</div>
              {astOD && (
                <>
                  <div>
                    <b>Astig. OD:</b>
                  </div>
                  <div>{astOD}</div>
                </>
              )}
              {astOI && (
                <>
                  <div>
                    <b>Astig. OI:</b>
                  </div>
                  <div>{astOI}</div>
                </>
              )}
              <div>
                <b>Extras:</b>
              </div>
              <div>{extras.length ? extras.map((k) => EXTRAS_LENTES.find((e) => e.key === k)?.label).join(", ") : "Ninguno"}</div>
            </div>
          </div>
          <div style={S.cotizTotal}>
            <div>
              <div style={S.cotizBreakdown}>
                Montura ${monObj?.precio} + lente base ${LENTE_BASE} + extras ${extrasTotal}
              </div>
              <div style={S.cotizLabel}>Total estimado</div>
            </div>
            <div style={S.cotizNum}>${total}</div>
          </div>
          <div style={formGroupFull}>
            <label style={label}>Sede de entrega</label>
            <select style={select} value={sede} onChange={(e) => setSede(e.target.value)}>
              {sedes.map((s) => (
                <option key={s.id} value={s.ciudad}>
                  {s.ciudad}
                </option>
              ))}
            </select>
          </div>
          <button style={btnWA} onClick={enviarWA}>
            💬 Enviar cotización por WhatsApp
          </button>
          <button style={{ ...btnGhost, marginTop: 10 }} onClick={citaWA}>
            📅 Agendar examen visual primero
          </button>
          <button style={{ ...btnGhost, marginTop: 8 }} onClick={() => setStep(2)}>
            ← Atrás
          </button>
        </div>
      )}
    </div>
  );
}
