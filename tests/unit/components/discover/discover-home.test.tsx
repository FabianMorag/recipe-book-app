import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { DiscoverHome } from "@/components/discover/discover-home";
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

function renderWithProviders(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{ui}</I18nProvider>
    </QueryClientProvider>,
  );
}

describe("DiscoverHome", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders the composed Spanish discover layout with fetched recipes", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => HttpResponse.json(recipes)),
    );

    renderWithProviders(<DiscoverHome />);

    expect(screen.getByRole("heading", { name: "Descubre recetas públicas" })).toBeInTheDocument();
    await screen.findByRole("article", { name: "Tarta de manzana" });
    expect(screen.getByRole("navigation", { name: "Navegación principal" })).toBeInTheDocument();
  });

  it("filters recipes by search text and announces the result count", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => HttpResponse.json(recipes)),
    );

    renderWithProviders(<DiscoverHome />);
    await screen.findByRole("article", { name: "Tarta de manzana" });

    await user.type(screen.getByLabelText("Buscar recetas"), "sopa");

    expect(screen.queryByRole("article", { name: "Tarta de manzana" })).not.toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Sopa verde" })).toBeInTheDocument();
    expect(screen.getByText("1 receta encontrada")).toBeInTheDocument();
  });

  it("renders an alert when fetching fails", async () => {
    server.use(
      http.get(`${API_BASE_URL}/recipes/public`, () => new HttpResponse(null, { status: 500 })),
    );

    renderWithProviders(<DiscoverHome />);

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No pudimos cargar las recetas"));
  });
});
