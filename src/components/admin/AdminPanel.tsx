import { useState } from "react";
import * as S from "./Admin.styles";
import { AdminDash } from "./AdminDash";
import { AdminProductos } from "./AdminProductos";
import { AdminPedidos } from "./AdminPedidos";
import { AdminCitas } from "./AdminCitas";
import { AdminCotizaciones } from "./AdminCotizaciones";
import { AdminSedes } from "./AdminSedes";

type Seccion = "dashboard" | "productos" | "pedidos" | "citas" | "cotizaciones" | "sedes";

interface AdminPanelProps {
  onExit: () => void;
}

const SECTIONS: { key: Seccion; icon: string; label: string }[] = [
  { key: "dashboard", icon: "📊", label: "Dashboard" },
  { key: "productos", icon: "👓", label: "Productos" },
  { key: "pedidos", icon: "🛒", label: "Pedidos" },
  { key: "citas", icon: "📅", label: "Citas" },
  { key: "cotizaciones", icon: "💰", label: "Cotizaciones" },
  { key: "sedes", icon: "📍", label: "Sedes" },
];

export function AdminPanel({ onExit }: AdminPanelProps) {
  const [seccion, setSeccion] = useState<Seccion>("dashboard");

  return (
    <div style={S.adminLayout}>
      <div style={S.adminSidebar}>
        <div style={S.sidebarBrandBlock}>
          <div style={S.sidebarBrand}>👁 OptiBlue</div>
          <div style={S.sidebarSubtitle}>Panel de administración</div>
        </div>
        {SECTIONS.map((s) => (
          <div key={s.key} style={S.sideItem(seccion === s.key)} onClick={() => setSeccion(s.key)}>
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </div>
        ))}
        <div style={S.sidebarExitWrap}>
          <button onClick={onExit} style={S.sidebarExit}>
            ← Ver sitio
          </button>
        </div>
      </div>

      <div style={S.adminMain}>
        <div style={S.adminHeader}>
          <div>
            <div style={S.headerTitle}>{SECTIONS.find((s) => s.key === seccion)?.label}</div>
            <div style={S.headerSubtitle}>OptiBlue · Panel de gestión</div>
          </div>
        </div>
        <div style={S.adminContent}>
          {seccion === "dashboard" && <AdminDash />}
          {seccion === "productos" && <AdminProductos />}
          {seccion === "pedidos" && <AdminPedidos />}
          {seccion === "citas" && <AdminCitas />}
          {seccion === "cotizaciones" && <AdminCotizaciones />}
          {seccion === "sedes" && <AdminSedes />}
        </div>
      </div>
    </div>
  );
}
