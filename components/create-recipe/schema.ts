import { z } from "zod";

export const recipeStatuses = ["DRAFT", "PRIVATE", "PUBLIC"] as const;
export type RecipeStatus = (typeof recipeStatuses)[number];

/**
 * Stable, locale-agnostic error codes emitted by the schema. The form layer
 * maps these codes (or the field presence) to dictionary keys, so user-facing
 * copy always comes from the i18n dictionaries instead of being baked into the
 * schema. Adding a new title validation just means adding a code here and a
 * matching dictionary key + form mapping.
 */
export const createRecipeFieldErrors = {
  titleRequired: "title.required",
} as const;

/**
 * Local-only form field: tags, ingredients, and steps live in client form state
 * only and are intentionally excluded from the backend payload.
 */
const localOnlyField = z.object({ value: z.string() });

/**
 * Form-level shape. Local-only fields (tags, ingredients, steps, aiHelperEnabled)
 * stay in client form state and are intentionally excluded from the backend payload.
 */
export const createRecipeSchema = z.object({
  title: z.string().trim().min(1, createRecipeFieldErrors.titleRequired),
  description: z.string().optional(),
  status: z.enum(recipeStatuses),
  tags: z.array(localOnlyField),
  ingredients: z.array(localOnlyField),
  steps: z.array(localOnlyField),
  aiHelperEnabled: z.boolean(),
});

export type CreateRecipeFormValues = z.infer<typeof createRecipeSchema>;

export const defaultCreateRecipeValues: CreateRecipeFormValues = {
  title: "",
  description: "",
  status: "DRAFT",
  tags: [{ value: "" }],
  ingredients: [{ value: "" }],
  steps: [{ value: "" }],
  aiHelperEnabled: false,
};