import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BottomNav } from "@/components/discover/bottom-nav";

describe("BottomNav", () => {
  it("renders active Discover and disabled placeholders", () => {
    render(
      <BottomNav
        labels={{ discover: "Descubrir", create: "Crear", mine: "Mis recetas" }}
      />,
    );

    expect(screen.getByRole("button", { name: "Descubrir" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Crear" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Mis recetas" })).toBeDisabled();
  });
});
