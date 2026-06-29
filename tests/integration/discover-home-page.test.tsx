import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import Home from "@/app/page";
import { API_BASE_URL } from "@/lib/api/client";
import { I18nProvider } from "@/lib/i18n/provider";
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
  {
    id: "recipe_2",
    title: "Sopa verde",
    description: "Cena liviana",
    status: "PUBLIC",
    createdAt: "2026-06-28T11:00:00.000Z",
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

describe("Discover Home page", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders MSW recipes, search filters, and category toggles", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => HttpResponse.json(recipes)),
    );

    renderPage(<Home />);

    await screen.findByRole("article", { name: "Tarta de manzana" });
    await user.type(screen.getByLabelText("Buscar recetas"), "sopa");
    expect(screen.getByRole("article", { name: "Sopa verde" })).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Buscar recetas"));
    await user.click(screen.getByRole("button", { name: "Postres" }));
    expect(screen.getByRole("article", { name: "Tarta de manzana" })).toBeInTheDocument();
    expect(screen.queryByRole("article", { name: "Sopa verde" })).not.toBeInTheDocument();
  });

  it("shows the page loading state while public recipes are pending", async () => {
    let resolveRecipes!: () => void;
    const pendingRecipes = new Promise<void>((resolve) => {
      resolveRecipes = resolve;
    });
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, async () => {
        await pendingRecipes;
        return HttpResponse.json(recipes);
      }),
    );

    renderPage(<Home />);

    expect(screen.getByLabelText("Cargando recetas")).toBeInTheDocument();
    expect(screen.queryByRole("article", { name: "Tarta de manzana" })).not.toBeInTheDocument();

    resolveRecipes();
    await screen.findByRole("article", { name: "Tarta de manzana" });
    expect(screen.queryByLabelText("Cargando recetas")).not.toBeInTheDocument();
  });
});
