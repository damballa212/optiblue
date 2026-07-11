import { useState } from "react";
import type { Producto } from "../../types";
import { SERVICIOS } from "../../data";
import { useProductos } from "../../hooks/useProductos";
import { useCategorias } from "../../hooks/useCategorias";
import type { PageKey } from "../layout/NavBar";
import { section, sectionTag, sectionH2, sectionSub, grid, btnPrimary, btnGhost } from "../../styles/shared";
import * as S from "./PageHome.styles";
import { Hero } from "./Hero";
import { ProductCard } from "../catalogo/ProductCard";
import { ReservaModal } from "../catalogo/ReservaModal";
import { StatusBlock } from "../shared/StatusBlock";
import * as Serv from "../servicios/PageServicios.styles";

interface PageHomeProps {
  setPage: (page: PageKey) => void;
}

export function PageHome({ setPage }: PageHomeProps) {
  const [modal, setModal] = useState<Producto | null>(null);
  const { productos, loading: productosLoading, error: productosError } = useProductos();
  const { categorias, loading: categoriasLoading, error: categoriasError } = useCategorias();
  const destacados = productos.filter((p) => p.destacado);
  const categoriaLabel = (categoriaId: string) => categorias.find((c) => c.id === categoriaId)?.label ?? "Producto";
  const catalogoLoading = productosLoading || categoriasLoading;
  const catalogoError = productosError || categoriasError;

  return (
    <>
      <Hero setPage={setPage} />
      <div style={S.destacadosWrap}>
        <div style={section}>
          <div style={sectionTag}>Lo más buscado</div>
          <h2 style={sectionH2}>Productos destacados</h2>
          <p style={sectionSub}>Nuestra selección de temporada.</p>
          {catalogoLoading && <StatusBlock kind="loading" title="Cargando productos" message="Estamos consultando el catálogo disponible." />}
          {!catalogoLoading && catalogoError && <StatusBlock kind="error" title="No pudimos cargar los destacados" message="Revisa la conexión o intenta de nuevo en unos minutos." />}
          {!catalogoLoading && !catalogoError && destacados.length === 0 && <StatusBlock kind="empty" title="Destacados pendientes" message="El catálogo está activo, pero todavía no hay productos marcados como destacados." />}
          {!catalogoLoading && !catalogoError && destacados.length > 0 && (
            <div style={grid(220)}>
              {destacados.map((p) => (
                <ProductCard key={p.id} p={p} categoriaLabel={categoriaLabel(p.categoriaId)} onReservar={setModal} />
              ))}
            </div>
          )}
          <div style={S.ctaCenter}>
            <button style={{ ...btnPrimary, width: "auto", padding: "12px 28px" }} onClick={() => setPage("productos")}>
              Ver catálogo completo →
            </button>
          </div>
        </div>
      </div>
      <div style={S.serviciosWrap}>
        <div style={section}>
          <div style={sectionTag}>Oftalmología</div>
          <h2 style={sectionH2}>Cuida tu salud visual</h2>
          <p style={sectionSub}>Contamos con especialistas y equipos modernos en todas nuestras sedes.</p>
          <div style={grid(240)}>
            {SERVICIOS.slice(0, 2).map((s) => (
              <div key={s.nombre} style={Serv.servCard}>
                <div style={Serv.servIcon}>{s.icon}</div>
                <div style={Serv.servName}>{s.nombre}</div>
                <div style={Serv.servDesc}>{s.desc}</div>
                <div style={Serv.servPrice}>{s.precio}</div>
              </div>
            ))}
          </div>
          <div style={S.ctaCenterSecondary}>
            <button style={{ ...btnGhost, width: "auto", padding: "10px 24px" }} onClick={() => setPage("servicios")}>
              Ver todos los servicios →
            </button>
          </div>
        </div>
      </div>
      {modal && <ReservaModal producto={modal} onClose={() => setModal(null)} />}
    </>
  );
}
