// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { WhatsAppComposer } from "./WhatsAppComposer";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AdminStatusBadge", () => {
  it("muestra texto y tono sin depender solo del color", () => {
    render(<AdminStatusBadge kind="cita" status="confirmada" />);
    const badge = screen.getByText("Confirmada");
    expect(badge.getAttribute("data-tone")).toBe("progress");
  });
});

describe("ConfirmDialog", () => {
  it("expone contexto y confirma de forma explicita", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        title="Eliminar producto"
        description="No se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={onConfirm}
        onCancel={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByText("No se puede deshacer.")).toBeTruthy();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("mantiene visible un error de borrado dentro del dialogo", () => {
    render(
      <ConfirmDialog
        title="Eliminar sede"
        description="No se puede deshacer."
        confirmLabel="Eliminar"
        error="La red no respondió."
        onConfirm={() => undefined}
        onCancel={() => undefined}
      />,
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "La red no respondió.",
    );
  });
});

describe("WhatsAppComposer", () => {
  it("abre el telefono del cliente con el mensaje editado", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(
      <WhatsAppComposer
        phone="+58 412-1234567"
        initialMessage="Mensaje original"
        onClose={() => undefined}
      />,
    );
    fireEvent.change(screen.getByLabelText("Mensaje propuesto"), {
      target: { value: "Mensaje editado" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Abrir WhatsApp" }));
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("584121234567"),
      "_blank",
    );
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("Mensaje%20editado"),
      "_blank",
    );
  });

  it("deshabilita WhatsApp cuando el telefono no es utilizable", () => {
    render(
      <WhatsAppComposer
        phone="sin numero"
        initialMessage="Mensaje"
        onClose={() => undefined}
      />,
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Abrir WhatsApp",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      screen.getByText(/teléfono del cliente no es utilizable/i),
    ).toBeTruthy();
  });
});
