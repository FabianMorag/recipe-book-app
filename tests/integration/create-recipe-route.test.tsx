import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CreateRecipeRoute from "@/app/recipes/new/page";
import { I18nProvider } from "@/lib/i18n/provider";

async function renderRoute() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const page = await CreateRecipeRoute();
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLocale="es">{page}</I18nProvider>
    </QueryClientProvider>,
  );
}

describe("Create Recipe route", () => {
  it("renders the Create Recipe form shell with the Spanish heading", async () => {
    await renderRoute();

    expect(
      screen.getByRole("heading", { name: "Nueva receta" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
  });
});