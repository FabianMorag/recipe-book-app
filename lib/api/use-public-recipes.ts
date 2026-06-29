"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { mapPublicRecipes, type PublicRecipeDto } from "./public-recipes";

const PUBLIC_RECIPES_QUERY_KEY = ["public-recipes"] as const;
export const PUBLIC_RECIPES_STALE_TIME_MS = 60 * 1000;
const DEFAULT_TIMEOUT_MS = 5000;

export function usePublicRecipes({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  return useQuery({
    queryKey: PUBLIC_RECIPES_QUERY_KEY,
    queryFn: () => fetchPublicRecipes(timeoutMs),
    staleTime: PUBLIC_RECIPES_STALE_TIME_MS,
  });
}

export async function fetchPublicRecipes(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const { data, error, response } = await apiClient.GET("/recipes/public", {
      signal: controller.signal,
    });

    if (controller.signal.aborted) {
      throw new Error("Public recipes request timed out");
    }

    if (!response.ok) {
      throw new Error("Public recipes request failed");
    }

    if (error) {
      throw new Error("Public recipes request failed");
    }

    return mapPublicRecipes((data ?? []) as PublicRecipeDto[]);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Public recipes request timed out");
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
