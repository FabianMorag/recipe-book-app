import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("RecipeDetailPage keyboard and focus behavior", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("moves focus through Back then Save in document order on Tab", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="recipe_1" />);
    await screen.findByRole("img", { name: "Pastel de Choclo" });

    const back = screen.getByRole("button", { name: "Volver a Descubrir" });
    const save = screen.getByRole("button", { name: "Guardar receta" });

    expect(back).not.toBeDisabled();
    expect(save).not.toBeDisabled();

    await user.tab();
    expect(document.activeElement).toBe(back);

    await user.tab();
    expect(document.activeElement).toBe(save);
  });

  it("exposes a visible focus-indicator contract on every actionable control", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () =>
        HttpResponse.json(recipes),
      ),
    );

    renderPage(<RecipeDetailPage recipeId="recipe_1" />);
    await screen.findByRole("img", { name: "Pastel de Choclo" });

    // jsdom cannot render the focus outline, so the visible-indicator part of
    // the spec scenario is verified via the focus-visible class contract that
    // produces it (focus-visible:outline-2 + outline-primary). Tab reachability
    // itself is proven behaviorally in the test above.
    const back = screen.getByRole("button", { name: "Volver a Descubrir" });
    const save = screen.getByRole("button", { name: "Guardar receta" });

    expect(back).toHaveClass("focus-visible:outline-2");
    expect(save).toHaveClass("focus-visible:outline-2");
  });
});
