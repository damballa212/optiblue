import { describe, expect, it } from "vitest";
import { hasConfiguredValue, isSpecificMapUrl } from "./locationAvailability";

describe("location availability", () => {
  it("rejects empty and explicitly pending values", () => {
    expect(hasConfiguredValue("")).toBe(false);
    expect(hasConfiguredValue("Por definir con el cliente")).toBe(false);
    expect(hasConfiguredValue("Por confirmar")).toBe(false);
  });

  it("accepts configured contact values", () => {
    expect(hasConfiguredValue("Lun-Sab 9am-6pm")).toBe(true);
    expect(hasConfiguredValue("0412-0000000")).toBe(true);
  });

  it("rejects generic map homepages and malformed URLs", () => {
    expect(isSpecificMapUrl("https://maps.google.com")).toBe(false);
    expect(isSpecificMapUrl("https://maps.google.com/")).toBe(false);
    expect(isSpecificMapUrl("not-a-url")).toBe(false);
  });

  it("accepts map links that identify a place or query", () => {
    expect(isSpecificMapUrl("https://maps.app.goo.gl/abc123")).toBe(true);
    expect(isSpecificMapUrl("https://maps.google.com/?q=Barinas")).toBe(true);
  });
});
