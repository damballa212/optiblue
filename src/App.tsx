import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth/AuthContext";
import { RequireAdmin } from "./lib/auth/RequireAdmin";
import { AdminLogin } from "./pages/AdminLogin";
import { app } from "./styles/app.styles";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { Footer } from "./components/layout/Footer";
import { PageHome } from "./components/home/PageHome";
import { PageProductos } from "./components/catalogo/PageProductos";
import { PageLentes } from "./components/lentes/PageLentes";
import { PageServicios } from "./components/servicios/PageServicios";
import { PageSedes } from "./components/sedes/PageSedes";
import { AdminPanel } from "./components/admin/AdminPanel";

const PAGE_PATHS: Record<PageKey, string> = {
  home: "/",
  productos: "/catalogo",
  lentes: "/lentes",
  servicios: "/servicios",
  sedes: "/sedes",
};

function PublicSite() {
  const navigate = useNavigate();
  const setPage = (key: PageKey) => navigate(PAGE_PATHS[key]);

  return (
    <div style={app}>
      <NavBar setPage={setPage} />
      <Routes>
        <Route path="/" element={<PageHome setPage={setPage} />} />
        <Route path="/catalogo" element={<PageProductos />} />
        <Route path="/lentes" element={<PageLentes />} />
        <Route path="/servicios" element={<PageServicios />} />
        <Route path="/sedes" element={<PageSedes />} />
      </Routes>
      <Footer setPage={setPage} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <div style={app}>
                  <AdminPanel />
                </div>
              </RequireAdmin>
            }
          />
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
