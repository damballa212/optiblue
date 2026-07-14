import { useCategorias } from "../../hooks/useCategorias";
import { useProductos } from "../../hooks/useProductos";
import { AdviceBanner } from "./AdviceBanner";
import { CampaignRail } from "./CampaignRail";
import { FeaturedSelection } from "./FeaturedSelection";
import { Hero } from "./Hero";
import { LocationPreview } from "./LocationPreview";
import { ServiceProcess } from "./ServiceProcess";

export function PageHome() {
  const { productos, loading: productosLoading, error: productosError } = useProductos();
  const { categorias, loading: categoriasLoading, error: categoriasError } = useCategorias();
  const destacados = productos.filter((producto) => producto.destacado).slice(0, 3);
  const categoryLabel = (categoryId: string) => categorias.find((category) => category.id === categoryId)?.label ?? "Producto";

  return (
    <main>
      <Hero />
      <CampaignRail />
      <FeaturedSelection
        products={destacados}
        categoryLabel={categoryLabel}
        loading={productosLoading || categoriasLoading}
        error={productosError || categoriasError}
      />
      <ServiceProcess />
      <LocationPreview />
      <AdviceBanner />
    </main>
  );
}
