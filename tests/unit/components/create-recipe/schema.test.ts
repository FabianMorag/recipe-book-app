import { describe, expect, it } from "vitest";
import {
  createRecipeSchema,
  defaultCreateRecipeValues,
  type CreateRecipeFormValues,
} from "@/components/create-recipe/schema";

describe("createRecipeSchema", () => {
  it("rejects an empty title with a path on title", () => {
    const result = createRecipeSchema.safeParse({
      ...defaultCreateRecipeValues,
      title: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const titleIssue = result.error.issues.find((issue) =>
        issue.path.includes("title"),
      );
      expect(titleIssue).toBeDefined();
    }
  });

  it("rejects a whitespace-only title", () => {
    const result = createRecipeSchema.safeParse({
      ...defaultCreateRecipeValues,
      title: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid payload with required title and a status", () => {
    const result = createRecipeSchema.safeParse({
      title: "Paella",
      description: "Traditional",
      status: "PUBLIC",
      tags: [{ value: "arroz" }],
      ingredients: [{ value: "arroz" }, { value: "azafrán" }],
      steps: [{ value: "Sofreír" }],
      aiHelperEnabled: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Paella");
      expect(result.data.status).toBe("PUBLIC");
      expect(result.data.ingredients).toHaveLength(2);
    }
  });

  it("rejects an invalid status value", () => {
    const result = createRecipeSchema.safeParse({
      title: "Paella",
      status: "ARCHIVED",
      tags: [],
      ingredients: [],
      steps: [],
      aiHelperEnabled: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const statusIssue = result.error.issues.find((issue) =>
        issue.path.includes("status"),
      );
      expect(statusIssue).toBeDefined();
    }
  });

  it("accepts optional description and local array shapes", () => {
    const result = createRecipeSchema.safeParse({
      title: "Charquicán",
      status: "DRAFT",
      tags: [{ value: "chileno" }, { value: "invierno" }],
      ingredients: [{ value: "papas" }],
      steps: [{ value: "Cocer papas" }, { value: "Servir" }],
      aiHelperEnabled: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toHaveLength(2);
      expect(result.data.steps).toHaveLength(2);
      expect(result.data.aiHelperEnabled).toBe(true);
    }
  });

  it("exposes default values with DRAFT status and empty local arrays", () => {
    const base: CreateRecipeFormValues = defaultCreateRecipeValues;
    expect(base.status).toBe("DRAFT");
    expect(base.tags).toEqual([{ value: "" }]);
    expect(base.ingredients).toEqual([{ value: "" }]);
    expect(base.steps).toEqual([{ value: "" }]);
    expect(base.aiHelperEnabled).toBe(false);
    expect(base.title).toBe("");
  });
});