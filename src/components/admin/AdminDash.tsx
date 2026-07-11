import { useProductos } from "../../hooks/useProductos";
import { useCitas } from "../../hooks/useCitas";
import { useCotizaciones } from "../../hooks/useCotizaciones";
import { useSedes } from "../../hooks/useSedes";
import { statGrid, statCard, statNum, statLabel, card, badge } from "../../styles/shared";
import * as S from "./AdminDash.styles";

export function AdminDash() {
  const { productos } = useProductos();
  const { citas } = useCitas();
  const { cotizaciones } = useCotizaciones();
  const { sedes } = useSedes();

  const sedeCiudad = (id: string) => sedes.find((s) => s.id === id)?.ciudad ?? "—";
  const productoNombre = (id: string) => productos.find((p) => p.id === id)?.nombre ?? "—";

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
                  {sedeCiudad(c.sedeId)} · {c.fecha}
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
                <div style={S.rowMeta}>{productoNombre(c.productoId)}</div>
              </div>
              <div style={S.rowTotal}>${c.total}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
