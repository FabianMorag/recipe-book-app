import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IngredientList } from "@/components/recipe-detail/ingredient-list";
import { mockRecipeDetail } from "@/tests/helpers/recipe-detail";

describe("IngredientList", () => {
  it("renders the heading, servings count, and ingredient items", () => {
    render(
      <IngredientList
        ingredients={mockRecipeDetail.ingredients}
        heading="Ingredientes"
        servings={mockRecipeDetail.servings}
        servingsLabel="Porciones"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Ingredientes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Porciones: 4")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(
      mockRecipeDetail.ingredients.length,
    );
    expect(screen.getByText("500 g de choclo")).toBeInTheDocument();
  });
});
