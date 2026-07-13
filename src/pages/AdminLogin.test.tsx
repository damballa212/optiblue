// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AdminLogin } from "./AdminLogin";

vi.mock("../lib/auth/AuthContext", () => ({
  useAuth: () => ({ user: null, isAdmin: false, loading: false }),
}));

vi.mock("../lib/auth/firebaseAuth", () => ({ auth: {} }));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

afterEach(cleanup);

describe("AdminLogin", () => {
  it("enlaza al origen real del storefront", () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /volver al sitio público/i }).getAttribute("href"),
    ).toBe("https://optiblue-prod.web.app");
  });
});
