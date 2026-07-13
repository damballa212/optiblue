import { describe, expect, it } from "vitest";
import { getAdminNotificationRoute, parseAdminNotification } from "./notification";

describe("notificaciones admin", () => {
  it("conserva tipo e id de un payload operativo", () => {
    expect(
      parseAdminNotification({
        notification: { title: "Nuevo pedido", body: "Laura · Barinas" },
        data: { tipo: "pedido", id: "ped-1" },
      }),
    ).toEqual({
      title: "Nuevo pedido",
      body: "Laura · Barinas",
      tipo: "pedido",
      id: "ped-1",
    });
  });

  it("descarta tipos desconocidos sin perder el aviso", () => {
    expect(
      parseAdminNotification({
        notification: { title: "Aviso" },
        data: { tipo: "desconocido", id: "x" },
      }),
    ).toEqual({ title: "Aviso", body: "" });
  });

  it("mapea cada tipo a su lista", () => {
    expect(getAdminNotificationRoute("pedido")).toBe("/admin/pedidos");
    expect(getAdminNotificationRoute("cita")).toBe("/admin/citas");
    expect(getAdminNotificationRoute("cotizacion")).toBe("/admin/cotizaciones");
  });
});
