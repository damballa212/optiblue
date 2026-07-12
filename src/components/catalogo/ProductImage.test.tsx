// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProductImage } from "./ProductImage";

afterEach(cleanup);

describe("ProductImage", () => {
  it("renders the professional fallback when there is no image URL", () => {
    render(<ProductImage src={null} alt="Montura Classic" width={600} height={420} />);
    expect(screen.getByRole("img", { name: "Imagen pendiente de Montura Classic" })).toBeTruthy();
  });

  it("replaces a broken product image with the professional fallback", () => {
    render(<ProductImage src="https://invalid.example/product.jpg" alt="Montura Classic" width={600} height={420} />);
    fireEvent.error(screen.getByRole("img", { name: "Montura Classic" }));
    expect(screen.getByRole("img", { name: "Imagen pendiente de Montura Classic" })).toBeTruthy();
  });
});
