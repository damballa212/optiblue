// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Cotizacion } from "../../../types";
import { AdminWorkPage } from "./AdminWorkPage";

const operations = vi.hoisted(() => ({
  pedidos: [],
  citas: [],
  cotizaciones: [] as Cotizacion[],
  productos: [],
  sedes: [],
  loading: { pedidos: false, citas: false, cotizaciones: false, productos: false, sedes: false },
  errors: { pedidos: null, citas: null, cotizaciones: null, productos: null, sedes: null },
  productNames: new Map<string, string>(),
  locationNames: new Map<string, string>(),
  refreshPedidos: vi.fn(),
  refreshCitas: vi.fn(),
  refreshCotizaciones: vi.fn(),
  refreshAll: vi.fn(),
}));

vi.mock("../data/AdminOperationsContext", () => ({
  useAdminOperations: () => operations,
}));

afterEach(() => {
  cleanup();
  operations.cotizaciones = [];
  operations.productNames = new Map();
  operations.locationNames = new Map();
});

function renderPage(entry = "/admin/cotizaciones") {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/admin/cotizaciones" element={<AdminWorkPage kind="cotizacion" />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminWorkPage", () => {
  it("muestra un solo heading y un empty state honesto sin registros", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Cotizaciones");
    expect(screen.getByText("0 registros")).toBeTruthy();
    expect(screen.getByText("Todavía no hay cotizaciones")).toBeTruthy();
    expect(screen.queryByText(/limpia los filtros/i)).toBeNull();
  });

  it("usa el empty state de filtros cuando existen datos sin coincidencias", () => {
    operations.cotizaciones = [
      {
        id: "cot-1",
        nombre: "Laura",
        telefono: "584120000000",
        sedeId: "sede-1",
        productoId: "prod-1",
        od: "",
        oi: "",
        astigmatismoOD: "",
        astigmatismoOI: "",
        extras: [],
        total: 20,
        fecha: "2026-07-12",
        estado: "pendiente",
      },
    ];
    renderPage("/admin/cotizaciones?q=nadie");
    expect(screen.getByText("0 de 1 registros")).toBeTruthy();
    expect(screen.getByText("No hay resultados con estos filtros")).toBeTruthy();
    expect(screen.getByRole("button", { name: /limpiar filtros/i })).toBeTruthy();
  });
});
