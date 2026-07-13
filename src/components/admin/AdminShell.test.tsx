// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminShell } from "./AdminShell";

const operations = vi.hoisted(() => ({
  pedidos: [],
  citas: [],
  cotizaciones: [],
}));

vi.mock("./data/AdminOperationsContext", () => ({
  useAdminOperations: () => operations,
}));

vi.mock("./notifications/AdminPushToast", () => ({
  AdminPushToast: () => null,
}));

vi.mock("../../lib/push/deviceToken", () => ({
  deactivateAdminPush: vi.fn(),
  reconcileAdminPushToken: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../lib/auth/firebaseAuth", () => ({ auth: {} }));

beforeEach(() => {
  HTMLElement.prototype.scrollTo = vi.fn();
});

afterEach(cleanup);

describe("AdminShell", () => {
  it.each(["catalogo", "sedes"])(
    "mantiene Más como tab actual en /admin/%s",
    (route) => {
      render(
        <MemoryRouter initialEntries={[`/admin/${route}`]}>
          <Routes>
            <Route path="/admin" element={<AdminShell />}>
              <Route path={route} element={<div />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      const mobileNav = screen.getByRole("navigation", {
        name: "Navegación administrativa móvil",
      });
      expect(within(mobileNav).getByRole("link", { name: "Más" }).getAttribute("aria-current"))
        .toBe("page");
    },
  );
});
