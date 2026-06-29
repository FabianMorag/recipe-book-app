import { describe, expect, it } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";

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
