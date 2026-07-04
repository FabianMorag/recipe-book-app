import { describe, expect, it } from "vitest";
import { toCreateRecipePayload } from "@/components/create-recipe/submit-boundary";
import type { CreateRecipeFormValues } from "@/components/create-recipe/schema";

const baseForm: CreateRecipeFormValues = {
  title: "Paella",
  description: "Traditional rice dish",
  status: "PUBLIC",
  tags: [{ value: "arroz" }, { value: "mariscos" }],
  ingredients: [{ value: "arroz" }, { value: "azafrán" }],
  steps: [{ value: "Sofreír" }, { value: "Agregar caldo" }],
  aiHelperEnabled: true,
};

describe("toCreateRecipePayload", () => {
  it("returns only backend-supported keys", () => {
    const payload = toCreateRecipePayload(baseForm);
    expect(Object.keys(payload).sort()).toEqual(["description", "status", "title"]);
  });

  it("excludes tags, ingredients, steps, and aiHelperEnabled", () => {
    const payload = toCreateRecipePayload(baseForm);
    expect(payload).not.toHaveProperty("tags");
    expect(payload).not.toHaveProperty("ingredients");
    expect(payload).not.toHaveProperty("steps");
    expect(payload).not.toHaveProperty("aiHelperEnabled");
  });

  it("trims the title and forwards the status enum", () => {
    const payload = toCreateRecipePayload({
      ...baseForm,
      title: "  Paella  ",
      status: "DRAFT",
    });
    expect(payload.title).toBe("Paella");
    expect(payload.status).toBe("DRAFT");
  });

  it("maps an empty description to undefined so it is dropped from the request body", () => {
    const payload = toCreateRecipePayload({
      ...baseForm,
      description: "   ",
    });
    expect(payload.description).toBeUndefined();
  });

  it("preserves a populated description", () => {
    const payload = toCreateRecipePayload({
      ...baseForm,
      description: "Plato tradicional",
    });
    expect(payload.description).toBe("Plato tradicional");
  });
});