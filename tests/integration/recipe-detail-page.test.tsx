import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import RecipeDetailRoute from "@/app/recipes/[id]/page";
import { API_BASE_URL } from "@/lib/api/client";
import { I18nProvider } from "@/lib/i18n/provider";
import type { PublicRecipeDto } from "@/lib/api/public-recipes";

const recipes: PublicRecipeDto[] = [
  {
    id: "recipe_1",
    title: "Pastel de Choclo",
    description: "Receta chilena",
    status: "PUBLIC",
    createdAt: "2026-06-28T10:00:00.000Z",
  },
];

const server = setupServer();

async function renderRoute(id: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const page = await RecipeDetailRoute({ params: Promise.resolve({ id }) });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{page}</I18nProvider>
    </QueryClientProvider>,
  );
}

describe("Recipe Detail route", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders detail fields surfaced from the mapped public recipe", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    await renderRoute("recipe_1");

    expect(
      await screen.findByRole("img", { name: "Pastel de Choclo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pastel de Choclo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ingredientes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Preparación" }),
    ).toBeInTheDocument();
    expect(screen.getByText("chileno")).toBeInTheDocument();
  });
});
