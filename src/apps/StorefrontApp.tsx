import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { NavBar } from "../components/layout/NavBar";
import { RouteMetadata } from "../components/layout/RouteMetadata";
import { InstallBanner } from "../components/shared/InstallBanner";
import { OfflineBanner } from "../components/shared/OfflineBanner";
import { UpdateToast } from "../components/shared/UpdateToast";
import { usePwaUpdate } from "../lib/pwa/usePwaUpdate";
import { app } from "../styles/app.styles";

const PageHome = lazy(() => import("../components/home/PageHome").then((module) => ({ default: module.PageHome })));
const PageProductos = lazy(() => import("../components/catalogo/PageProductos").then((module) => ({ default: module.PageProductos })));
const PageLentes = lazy(() => import("../components/lentes/PageLentes").then((module) => ({ default: module.PageLentes })));
const PageServicios = lazy(() => import("../components/servicios/PageServicios").then((module) => ({ default: module.PageServicios })));
const PageSedes = lazy(() => import("../components/sedes/PageSedes").then((module) => ({ default: module.PageSedes })));

function PublicSite() {
  return (
    <div style={app}>
      <NavBar />
      <Suspense fallback={<div style={{ minHeight: "60vh" }} aria-label="Cargando página" />}>
        <Routes>
          <Route path="/" element={<PageHome />} />
          <Route path="/catalogo" element={<PageProductos />} />
          <Route path="/catalogo/:productoId" element={<PageProductos />} />
          <Route path="/lentes" element={<PageLentes />} />
          <Route path="/servicios" element={<PageServicios />} />
          <Route path="/sedes" element={<PageSedes />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
      <InstallBanner />
    </div>
  );
}

export default function StorefrontApp() {
  const { needRefresh, applyUpdate } = usePwaUpdate();
  return (
    <BrowserRouter>
      <RouteMetadata />
      <OfflineBanner />
      <PublicSite />
      {needRefresh && <UpdateToast onUpdate={applyUpdate} />}
    </BrowserRouter>
  );
}
