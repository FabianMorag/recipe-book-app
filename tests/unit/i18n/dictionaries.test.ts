import { describe, expect, it } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { createTestTranslator } from "@/tests/helpers/i18n";

describe("i18n dictionaries", () => {
  it("has matching English values for every Spanish key", () => {
    const spanishKeys = Object.keys(dictionaries.es).toSorted();
    const englishKeys = Object.keys(dictionaries.en).toSorted();

    expect(englishKeys).toEqual(spanishKeys);
    expect(dictionaries.en["search.placeholder"]).toBe("Search recipes");
  });

  it("does not expose English-only keys", () => {
    const spanishKeys = new Set(Object.keys(dictionaries.es));
    const englishOnlyKeys = Object.keys(dictionaries.en).filter(
      (key) => !spanishKeys.has(key),
    );

    expect(englishOnlyKeys).toEqual([]);
  });
});

describe("recipeDetail translation keys", () => {
  const recipeDetailKeys = Object.keys(dictionaries.es).filter((key) =>
    key.startsWith("recipeDetail."),
  );

  it("includes the required Recipe Detail keys in Spanish", () => {
    expect(recipeDetailKeys).toContain("recipeDetail.back");
    expect(recipeDetailKeys).toContain("recipeDetail.save");
    expect(recipeDetailKeys).toContain("recipeDetail.ingredients");
    expect(recipeDetailKeys).toContain("recipeDetail.steps");
    expect(recipeDetailKeys).toContain("recipeDetail.aiHint.label");
    expect(dictionaries.es["recipeDetail.ingredients"]).toBe("Ingredientes");
    expect(dictionaries.es["recipeDetail.steps"]).toBe("Preparación");
    expect(dictionaries.es["recipeDetail.back"]).toBe("Volver a Descubrir");
  });

  it("resolves every Recipe Detail key in English", () => {
    const english = dictionaries.en as Record<string, string>;
    for (const key of recipeDetailKeys) {
      expect(english[key]).toBeDefined();
    }
    expect(dictionaries.en["recipeDetail.ingredients"]).toBe("Ingredients");
    expect(dictionaries.en["recipeDetail.steps"]).toBe("Steps");
    expect(dictionaries.en["recipeDetail.back"]).toBe("Back to Discover");
  });

  it("falls back to Spanish when an English Recipe Detail key is missing", () => {
    const t = createTestTranslator({
      locale: "en",
      dictionary: { es: { "recipeDetail.ingredients": "Ingredientes" }, en: {} },
    });
    expect(t("recipeDetail.ingredients")).toBe("Ingredientes");
  });
});

describe("createRecipe translation keys", () => {
  it("includes the required Create Recipe keys in Spanish", () => {
    expect(dictionaries.es["createRecipe.heading"]).toBeDefined();
    expect(dictionaries.es["createRecipe.title"]).toBe("Título");
    expect(dictionaries.es["createRecipe.description"]).toBe("Descripción");
    expect(dictionaries.es["createRecipe.status"]).toBeDefined();
    expect(dictionaries.es["createRecipe.statusDraft"]).toBeDefined();
    expect(dictionaries.es["createRecipe.statusPrivate"]).toBeDefined();
    expect(dictionaries.es["createRecipe.statusPublic"]).toBeDefined();
    expect(dictionaries.es["createRecipe.tags"]).toBeDefined();
    expect(dictionaries.es["createRecipe.ingredients"]).toBeDefined();
    expect(dictionaries.es["createRecipe.steps"]).toBeDefined();
    expect(dictionaries.es["createRecipe.aiHelper"]).toBeDefined();
    expect(dictionaries.es["createRecipe.boundaryNotice"]).toBeDefined();
    expect(dictionaries.es["createRecipe.submit"]).toBeDefined();
    expect(dictionaries.es["createRecipe.success"]).toBeDefined();
    expect(dictionaries.es["createRecipe.errorRequiredTitle"]).toBe(
      "El título es obligatorio",
    );
  });

  it("resolves every Create Recipe key in English", () => {
    const createRecipeKeys = Object.keys(dictionaries.es).filter((key) =>
      key.startsWith("createRecipe."),
    );
    const english = dictionaries.en as Record<string, string>;
    for (const key of createRecipeKeys) {
      expect(english[key]).toBeDefined();
    }
    expect(dictionaries.en["createRecipe.submit"]).toBe("Create Recipe");
    expect(dictionaries.en["createRecipe.errorRequiredTitle"]).toBe(
      "Title is required",
    );
  });
});
