import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { API_BASE_URL } from "@/lib/api/client";
import {
  PUBLIC_RECIPES_STALE_TIME_MS,
  usePublicRecipes,
} from "@/lib/api/use-public-recipes";
import type { PublicRecipeDto } from "@/lib/api/public-recipes";
import type { ReactNode } from "react";

const recipes: PublicRecipeDto[] = [
  {
    id: "recipe_1",
    title: "Tarta de manzana",
    description: "Postre simple",
    status: "PUBLIC",
    createdAt: "2026-06-28T10:00:00.000Z",
  },
];

const server = setupServer();

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("usePublicRecipes", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("returns mapped public recipes from GET /recipes/public", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => HttpResponse.json(recipes)),
    );

    const { result } = renderHook(() => usePublicRecipes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0]).toMatchObject({
      id: "recipe_1",
      title: "Tarta de manzana",
      category: "Postres",
    });
  });

  it("returns an empty array for an empty backend response", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => HttpResponse.json([])),
    );

    const { result } = renderHook(() => usePublicRecipes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("surfaces server errors and keeps refetch available", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => new HttpResponse(null, { status: 500 })),
    );

    const { result } = renderHook(() => usePublicRecipes(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(typeof result.current.refetch).toBe("function");
  });

  it("turns a slow response into a timeout error", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, async () => {
        await delay(80);
        return HttpResponse.json(recipes);
      }),
    );

    const { result } = renderHook(() => usePublicRecipes({ timeoutMs: 10 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain("timed out");
  });

  it("keeps successful public recipes fresh for the configured stale time", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => HttpResponse.json(recipes)),
    );

    const { result } = renderHook(() => usePublicRecipes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(PUBLIC_RECIPES_STALE_TIME_MS).toBe(60 * 1000);
    expect(result.current.isStale).toBe(false);
  });
});
