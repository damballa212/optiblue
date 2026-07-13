import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RouteMetadata } from "../components/layout/RouteMetadata";
import { OfflineBanner } from "../components/shared/OfflineBanner";
import { UpdateToast } from "../components/shared/UpdateToast";
import { usePwaUpdate } from "../lib/pwa/usePwaUpdate";

const AdminRoutes = lazy(() => import("../components/admin/AdminRoutes"));

export default function PanelApp() {
  const { needRefresh, applyUpdate } = usePwaUpdate();
  useEffect(() => {
    document.body.classList.add("panel-app");
    return () => document.body.classList.remove("panel-app");
  }, []);
  return (
    <BrowserRouter>
      <RouteMetadata />
      <OfflineBanner />
      <Suspense fallback={<div style={{ minHeight: "100dvh" }} aria-label="Cargando aplicación" />}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<Navigate to="/admin/hoy" replace />} />
        </Routes>
      </Suspense>
      {needRefresh && <UpdateToast onUpdate={applyUpdate} />}
    </BrowserRouter>
  );
}
