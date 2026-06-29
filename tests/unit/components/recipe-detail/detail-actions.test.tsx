import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DetailActions } from "@/components/recipe-detail/detail-actions";

describe("DetailActions", () => {
  it("renders Back and Save buttons with accessible labels", () => {
    render(
      <DetailActions backLabel="Volver a Descubrir" saveLabel="Guardar receta" />,
    );

    expect(
      screen.getByRole("button", { name: "Volver a Descubrir" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Guardar receta" }),
    ).toBeInTheDocument();
  });
});
