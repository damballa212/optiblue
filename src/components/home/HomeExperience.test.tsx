// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import type { Producto } from "../../types";
import { CampaignRail } from "./CampaignRail";
import { FeaturedSelection } from "./FeaturedSelection";
import { Hero } from "./Hero";

const product: Producto = {
  id: "classic-pro",
  nombre: "Montura Classic Pro",
  categoriaId: "monturas",
  precio: 45,
  imagenUrl: null,
  descripcion: "Marco acetato premium",
  stock: 8,
  destacado: true,
};

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
  HTMLElement.prototype.scrollBy = vi.fn();
});

afterEach(cleanup);

describe("Optical Portal Home", () => {
  it("mantiene el hero semántico y enlaza a los flujos productivos existentes", () => {
    render(<MemoryRouter><Hero /></MemoryRouter>);

    expect(screen.getByRole("heading", { level: 1, name: "Monturas, lentes adaptados y atención visual." })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Ver catálogo/ }).getAttribute("href")).toBe("/catalogo");
    expect(screen.getByRole("link", { name: /Cotizar mis lentes/ }).getAttribute("href")).toBe("/lentes");
  });

  it("expone cuatro accesos V1 sin inventar promociones", () => {
    render(<MemoryRouter><CampaignRail /></MemoryRouter>);

    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByRole("link", { name: /Empezar cotización/ }).getAttribute("href")).toBe("/lentes");
    expect(screen.getByRole("link", { name: /Ver sedes/ }).getAttribute("href")).toBe("/sedes");
    expect(screen.getByRole("link", { name: /Solicitar cita/ }).getAttribute("href")).toBe("/servicios");
    expect(screen.getByRole("link", { name: /Abrir catálogo/ }).getAttribute("href")).toBe("/catalogo");
  });

  it("presenta un único destacado con sus campos reales y sin controles falsos", () => {
    render(
      <MemoryRouter>
        <FeaturedSelection products={[product]} categoryLabel={() => "Monturas"} loading={false} error={null} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: product.nombre })).toBeTruthy();
    expect(screen.getByText(product.descripcion)).toBeTruthy();
    expect(screen.getByText("$45")).toBeTruthy();
    expect(screen.getByText("Con stock")).toBeTruthy();
    expect(screen.getByRole("img", { name: `Imagen pendiente de ${product.nombre}` })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Ver producto/ }).getAttribute("href")).toBe(`/catalogo/${product.id}`);
    expect(screen.queryByRole("button", { name: "Producto siguiente" })).toBeNull();
  });

  it("habilita navegación de rail cuando Firestore entrega varios destacados", () => {
    const second = { ...product, id: "second", nombre: "Segunda montura" };
    render(
      <MemoryRouter>
        <FeaturedSelection products={[product, second]} categoryLabel={() => "Monturas"} loading={false} error={null} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Producto anterior" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Producto siguiente" })).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});
