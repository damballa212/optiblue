import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { app } from "./styles/app.styles";
import { NavBar } from "./components/layout/NavBar";
import { Footer } from "./components/layout/Footer";
import { RouteMetadata } from "./components/layout/RouteMetadata";

const PageHome = lazy(() => import("./components/home/PageHome").then((module) => ({ default: module.PageHome })));
const PageProductos = lazy(() => import("./components/catalogo/PageProductos").then((module) => ({ default: module.PageProductos })));
const PageLentes = lazy(() => import("./components/lentes/PageLentes").then((module) => ({ default: module.PageLentes })));
const PageServicios = lazy(() => import("./components/servicios/PageServicios").then((module) => ({ default: module.PageServicios })));
const PageSedes = lazy(() => import("./components/sedes/PageSedes").then((module) => ({ default: module.PageSedes })));
const AdminRoutes = lazy(() => import("./components/admin/AdminRoutes"));

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
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteMetadata />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} aria-label="Cargando aplicación" />}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
