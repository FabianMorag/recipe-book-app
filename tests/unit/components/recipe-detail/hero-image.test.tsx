import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroImage } from "@/components/recipe-detail/hero-image";
import { mockRecipeDetail } from "@/tests/helpers/recipe-detail";

describe("HeroImage", () => {
  it("renders the recipe image with the title as descriptive alt text", () => {
    render(<HeroImage recipe={mockRecipeDetail} />);

    expect(
      screen.getByRole("img", { name: "Pastel de Choclo" }),
    ).toBeInTheDocument();
  });
});
