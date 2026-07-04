import { apiClient } from "./client";
import type { components } from "./schema";

export type CreateRecipePayload = components["schemas"]["CreateRecipeDto"];
export type CreatedRecipe = components["schemas"]["RecipeResponseDto"];

/**
 * Creates a recipe via POST /recipes using only backend-supported fields.
 * Throws when the request fails or returns an error body so callers can hand
 * the failure to the mutation layer.
 */
export async function createRecipe(payload: CreateRecipePayload): Promise<CreatedRecipe> {
  const { data, error, response } = await apiClient.POST("/recipes", {
    body: payload,
  });

  if (!response.ok || error || !data) {
    throw new Error("Recipe creation failed");
  }

  return data;
}