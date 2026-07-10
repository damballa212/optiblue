import { useState } from "react";
import { INITIAL_PRODUCTS, INITIAL_CITAS, INITIAL_COTIZACIONES } from "./data";
import { app } from "./styles/app.styles";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { Footer } from "./components/layout/Footer";
import { PageHome } from "./components/home/PageHome";
import { PageProductos } from "./components/catalogo/PageProductos";
import { PageLentes } from "./components/lentes/PageLentes";
import { PageServicios } from "./components/servicios/PageServicios";
import { PageSedes } from "./components/sedes/PageSedes";
import { AdminPanel } from "./components/admin/AdminPanel";

export default function App() {
  const [page, setPage] = useState<PageKey>("home");
  const [adminMode, setAdminMode] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [citas, setCitas] = useState(INITIAL_CITAS);
  const [cotizaciones, setCotizaciones] = useState(INITIAL_COTIZACIONES);

  if (adminMode) {
    return (
      <div style={app}>
        <AdminPanel products={products} setProducts={setProducts} citas={citas} setCitas={setCitas} cotizaciones={cotizaciones} setCotizaciones={setCotizaciones} onExit={() => setAdminMode(false)} />
      </div>
    );
  }

  return (
    <div style={app}>
      <NavBar page={page} setPage={setPage} onAdmin={() => setAdminMode(true)} />
      {page === "home" && <PageHome setPage={setPage} />}
      {page === "productos" && <PageProductos products={products} />}
      {page === "lentes" && <PageLentes products={products} />}
      {page === "servicios" && <PageServicios />}
      {page === "sedes" && <PageSedes />}
      <Footer setPage={setPage} />
    </div>
  );
}
