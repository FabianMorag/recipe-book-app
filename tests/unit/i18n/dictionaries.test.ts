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
