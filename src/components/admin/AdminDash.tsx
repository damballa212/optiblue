import type { Cita, Cotizacion } from "../../types";
import { useProductos } from "../../hooks/useProductos";
import { statGrid, statCard, statNum, statLabel, card, badge } from "../../styles/shared";
import * as S from "./AdminDash.styles";

interface AdminDashProps {
  citas: Cita[];
  cotizaciones: Cotizacion[];
}

export function AdminDash({ citas, cotizaciones }: AdminDashProps) {
  const { productos } = useProductos();
  const stats = [
    { num: productos.length, label: "Productos activos" },
    { num: citas.length, label: "Citas registradas" },
    { num: cotizaciones.length, label: "Cotizaciones" },
    { num: citas.filter((c) => c.estado === "pendiente").length, label: "Citas pendientes" },
  ];

  return (
    <>
      <div style={statGrid}>
        {stats.map((s) => (
          <div key={s.label} style={statCard}>
            <div style={statNum}>{s.num}</div>
            <div style={statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={S.dashGrid}>
        <div style={{ ...card, padding: 20 }}>
          <div style={S.panelTitle}>Citas recientes</div>
          {citas.slice(0, 3).map((c) => (
            <div key={c.id} style={S.listRow}>
              <div>
                <div style={S.rowName}>{c.nombre}</div>
                <div style={S.rowMeta}>
                  {c.sede} · {c.fecha}
                </div>
              </div>
              <span style={badge(c.estado === "confirmada" ? "verde" : "amarillo")}>{c.estado}</span>
            </div>
          ))}
        </div>
        <div style={{ ...card, padding: 20 }}>
          <div style={S.panelTitle}>Cotizaciones recientes</div>
          {cotizaciones.slice(0, 3).map((c) => (
            <div key={c.id} style={S.listRow}>
              <div>
                <div style={S.rowName}>{c.nombre}</div>
                <div style={S.rowMeta}>{c.montura}</div>
              </div>
              <div style={S.rowTotal}>${c.total}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
