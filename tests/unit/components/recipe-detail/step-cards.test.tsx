import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepCards } from "@/components/recipe-detail/step-cards";
import { mockRecipeDetail } from "@/tests/helpers/recipe-detail";

describe("StepCards", () => {
  it("renders the heading and an ordered list of numbered step cards", () => {
    render(<StepCards steps={mockRecipeDetail.steps} heading="Preparación" />);

    expect(
      screen.getByRole("heading", { name: "Preparación" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(
      mockRecipeDetail.steps.length,
    );
    expect(
      screen.getByText("Hornear 30 minutos hasta dorar."),
    ).toBeInTheDocument();
  });
});
