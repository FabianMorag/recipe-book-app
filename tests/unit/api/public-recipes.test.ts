import { describe, expect, it } from "vitest";
import {
  mapPublicRecipe,
  mapPublicRecipeDetail,
  mapPublicRecipes,
} from "@/lib/api/public-recipes";
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

describe("mapPublicRecipeDetail", () => {
  it("adds detail-only mocked fields while preserving summary fields", () => {
    const detail = mapPublicRecipeDetail(backendRecipe, 0);

    expect(detail).toMatchObject(backendRecipe);
    expect(detail.image.alt).toBe("Foto de Tarta de manzana");
    expect(detail.author.name).toBe("Cocina Pública");
    expect(detail.category).toBe("Postres");

    expect(detail.ingredients.length).toBeGreaterThan(0);
    expect(detail.steps.length).toBeGreaterThan(0);
    expect(detail.servings).toBeGreaterThan(0);
    expect(detail.tags.length).toBeGreaterThan(0);
    expect(detail.shared).toBe(true);
    expect(detail.aiHint.length).toBeGreaterThan(0);
  });

  it("derives the shared flag from the recipe status by default", () => {
    expect(mapPublicRecipeDetail(backendRecipe, 0).shared).toBe(true);
    expect(
      mapPublicRecipeDetail({ ...backendRecipe, status: "DRAFT" }, 0).shared,
    ).toBe(false);
  });

  it("lets real backend detail fields win over mocked values", () => {
    const detail = mapPublicRecipeDetail(
      {
        ...backendRecipe,
        servings: 6,
        ingredients: ["Harina", "Huevos"],
        tags: ["casero", "rápido"],
      },
      0,
    );

    expect(detail.servings).toBe(6);
    expect(detail.ingredients).toEqual(["Harina", "Huevos"]);
    expect(detail.tags).toEqual(["casero", "rápido"]);
    // remaining missing fields still receive mock values
    expect(detail.steps.length).toBeGreaterThan(0);
    expect(detail.aiHint.length).toBeGreaterThan(0);
  });
});
