import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { RecipeDetailPage } from "@/components/recipe-detail/recipe-detail-page";
import { API_BASE_URL } from "@/lib/api/client";
import { I18nProvider } from "@/lib/i18n/provider";
import type { PublicRecipeDto } from "@/lib/api/public-recipes";
import type { ReactNode } from "react";

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

function renderPage(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{ui}</I18nProvider>
    </QueryClientProvider>,
  );
}

describe("RecipeDetailPage", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders all detail sections with Spanish copy from i18n", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="recipe_1" />);

    expect(
      screen.getByRole("button", { name: "Volver a Descubrir" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Guardar receta" }),
    ).toBeInTheDocument();

    await screen.findByRole("img", { name: "Pastel de Choclo" });

    expect(screen.getByText("Compartida")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pastel de Choclo" }),
    ).toBeInTheDocument();
    expect(screen.getByText("chileno")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ingredientes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Preparación" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Sugerencia con IA")).toBeInTheDocument();
  });

  it("renders the not-found state when the recipe id is missing", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="missing" />);

    expect(
      await screen.findByText("No encontramos esta receta"),
    ).toBeInTheDocument();
  });

  it("renders the error state when the public recipes request fails", async () => {
    server.use(
      http.get(
        `${API_BASE_URL}/recipes/public`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="recipe_1" />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No pudimos cargar la receta",
    );
  });
});
