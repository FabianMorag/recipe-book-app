import type { components } from "@/lib/api/schema";
import type { CreateRecipeFormValues } from "./schema";

/**
 * Backend create payload. Currently only title, description, and status are
 * persisted by POST /recipes. Tags, ingredients, steps, and AI helper state are
 * intentionally excluded; see components/create-recipe/api-gaps.md for the full
 * backend catch-up list.
 */
export type CreateRecipePayload = components["schemas"]["CreateRecipeDto"];

/**
 * Maps the full Create Recipe form state to the backend-supported create payload.
 * Local-only/future fields are dropped here to prevent them leaking into the
 * mutation body.
 */
export function toCreateRecipePayload(
  form: CreateRecipeFormValues,
): CreateRecipePayload {
  const trimmedDescription = form.description?.trim();
  return {
    title: form.title.trim(),
    description: trimmedDescription ? trimmedDescription : undefined,
    status: form.status,
  };
}