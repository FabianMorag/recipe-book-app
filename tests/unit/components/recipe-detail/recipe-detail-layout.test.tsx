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
    description: "Receta tradicional chilena.",
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

// jsdom has no layout engine: it cannot measure max-width centering, pixel
// target sizes, or vertical stacking geometry. For the purely-visual parts of
// the responsive spec scenario we therefore assert the spec-mandated class
// contract (max-w-3xl / mx-auto / flex-col / min-h-11), which IS the responsive
// requirement. Document order is verified behaviorally via compareDocumentPosition.
function isBefore(a: HTMLElement, b: HTMLElement): boolean {
  return (
    (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
  );
}

describe("RecipeDetailPage responsive layout", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders sections in the spec-required stacked order", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="recipe_1" />);

    const back = screen.getByRole("button", { name: "Volver a Descubrir" });
    const save = screen.getByRole("button", { name: "Guardar receta" });
    const image = await screen.findByRole("img", { name: "Pastel de Choclo" });
    const shared = screen.getByText("Compartida");
    // Author comes from the isolated mock author constant via the real mapper
    // (MSW -> mapPublicRecipeDetail), not the standalone test fixture.
    const author = screen.getByText(/Cocina Pública/);
    const title = screen.getByRole("heading", { name: "Pastel de Choclo" });
    const tag = screen.getByText("chileno");
    const ingredients = screen.getByRole("heading", {
      name: "Ingredientes",
    });
    const steps = screen.getByRole("heading", { name: "Preparación" });
    const aiHint = screen.getByLabelText("Sugerencia con IA");

    // actions -> image -> status -> author -> title -> tags -> ingredients -> steps -> AI hint
    expect(isBefore(back, save)).toBe(true);
    expect(isBefore(save, image)).toBe(true);
    expect(isBefore(image, shared)).toBe(true);
    expect(isBefore(shared, author)).toBe(true);
    expect(isBefore(author, title)).toBe(true);
    expect(isBefore(title, tag)).toBe(true);
    expect(isBefore(tag, ingredients)).toBe(true);
    expect(isBefore(ingredients, steps)).toBe(true);
    expect(isBefore(steps, aiHint)).toBe(true);
  });

  it("applies the centered, max-width, vertically-stacked container contract", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="recipe_1" />);
    await screen.findByRole("img", { name: "Pastel de Choclo" });

    const article = screen.getByRole("article");
    // Desktop max-width (spec: max-w-3xl) + horizontal centering (mx-auto)
    expect(article).toHaveClass("max-w-3xl");
    expect(article).toHaveClass("mx-auto");
    // Sections stacked vertically (flex-col) within the container on every viewport
    expect(article).toHaveClass("flex-col");
  });

  it("gives interactive controls a target size at or above the 24px minimum", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="recipe_1" />);
    await screen.findByRole("img", { name: "Pastel de Choclo" });

    const back = screen.getByRole("button", { name: "Volver a Descubrir" });
    const save = screen.getByRole("button", { name: "Guardar receta" });

    // min-h-11 / min-w-11 = 2.75rem = 44px, comfortably above the 24px WCAG 2.5.8 minimum.
    for (const button of [back, save]) {
      expect(button).toHaveClass("min-h-11");
      expect(button).toHaveClass("min-w-11");
    }
  });
});
