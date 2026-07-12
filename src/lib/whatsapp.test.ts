import { describe, expect, it } from "vitest";
import { buildWAMessage } from "./whatsapp";

describe("buildWAMessage cita", () => {
  it("describes an appointment request instead of a confirmed booking", () => {
    const message = decodeURIComponent(buildWAMessage({ tipo: "cita", sede: "Barinas" }));

    expect(message).toContain("solicitar una cita");
    expect(message).not.toContain("agendar una cita");
    expect(message).not.toContain("undefined");
  });
});
