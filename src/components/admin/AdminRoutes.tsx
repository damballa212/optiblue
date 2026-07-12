import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../lib/auth/AuthContext";
import { RequireAdmin } from "../../lib/auth/RequireAdmin";
import { AdminLogin } from "../../pages/AdminLogin";
import { AdminShell } from "./AdminShell";
import { AdminOperationsProvider } from "./data/AdminOperationsContext";
import { AdminMorePage } from "./pages/AdminMorePage";
import { AdminCatalogPage } from "./pages/AdminCatalogPage";
import { AdminLocationsPage } from "./pages/AdminLocationsPage";
import { AdminTodayPage } from "./pages/AdminTodayPage";
import { AdminWorkPage } from "./pages/AdminWorkPage";

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          element={
            <RequireAdmin>
              <AdminOperationsProvider>
                <AdminShell />
              </AdminOperationsProvider>
            </RequireAdmin>
          }
        >
          <Route index element={<Navigate to="hoy" replace />} />
          <Route path="hoy" element={<AdminTodayPage />} />
          <Route path="pedidos" element={<AdminWorkPage kind="pedido" />} />
          <Route path="citas" element={<AdminWorkPage kind="cita" />} />
          <Route
            path="cotizaciones"
            element={<AdminWorkPage kind="cotizacion" />}
          />
          <Route path="catalogo" element={<AdminCatalogPage />} />
          <Route path="sedes" element={<AdminLocationsPage />} />
          <Route path="mas" element={<AdminMorePage />} />
          <Route path="*" element={<Navigate to="hoy" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
