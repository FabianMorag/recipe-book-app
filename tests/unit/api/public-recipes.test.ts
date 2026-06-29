import { describe, expect, it } from "vitest";
import { mapPublicRecipe, mapPublicRecipes } from "@/lib/api/public-recipes";
import type { PublicRecipeDto } from "@/lib/api/public-recipes";

const backendRecipe: PublicRecipeDto = {
  id: "recipe_1",
  title: "Tarta de manzana",
  description: "Postre simple",
  status: "PUBLIC",
  createdAt: "2026-06-28T10:00:00.000Z",
};

describe("public recipe mapper", () => {
  it("adds isolated view metadata while preserving backend fields", () => {
    const recipe = mapPublicRecipe(backendRecipe, 0);

    expect(recipe).toMatchObject(backendRecipe);
    expect(recipe.image.alt).toBe("Foto de Tarta de manzana");
    expect(recipe.author.name).toBe("Cocina Pública");
    expect(recipe.author.avatarInitials).toBe("CP");
    expect(recipe.category).toBe("Postres");
  });

  it("maps empty arrays without fabricating recipes", () => {
    expect(mapPublicRecipes([])).toEqual([]);
  });

  it("rotates mocked categories for different inputs", () => {
    const recipes = mapPublicRecipes([
      backendRecipe,
      { ...backendRecipe, id: "recipe_2", title: "Sopa verde" },
    ]);

    expect(recipes).toHaveLength(2);
    expect(recipes[0].category).not.toBe(recipes[1].category);
  });
});
