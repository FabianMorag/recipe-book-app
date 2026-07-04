import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { CreateRecipeForm } from "@/components/create-recipe/create-recipe-form";
import { API_BASE_URL } from "@/lib/api/client";
import { I18nProvider, type Locale } from "@/lib/i18n/provider";

const server = setupServer();

function renderForm(locale: Locale = "es") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLocale={locale}>
        <CreateRecipeForm />
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("CreateRecipeForm", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders Spanish labels by default", () => {
    renderForm();
    expect(
      screen.getByRole("heading", { name: "Nueva receta" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
    expect(screen.getByLabelText("Descripción")).toBeInTheDocument();
    expect(screen.getByLabelText("Visibilidad")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear receta" }),
    ).toBeInTheDocument();
  });

  it("shows the Spanish required-title error and aria-invalid when submitting empty", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Crear receta" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("El título es obligatorio");
    expect(screen.getByLabelText("Título")).toHaveAttribute("aria-invalid", "true");
  });

  it("moves focus to the first invalid field (title) after submitting empty", async () => {
    const user = userEvent.setup();
    renderForm();

    const titleInput = screen.getByLabelText("Título");
    await user.click(screen.getByRole("button", { name: "Crear receta" }));

    await screen.findByRole("alert");
    expect(titleInput).toHaveFocus();
  });

  it("submits only backend-supported fields and shows an in-form success with local fields preserved", async () => {
    const user = userEvent.setup();
    let capturedBody: unknown;
    server.use(
      http.post(`${API_BASE_URL}/recipes`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json(
          {
            id: "recipe_42",
            title: "Pastel de choclo",
            description: "Clásico chileno",
            status: "PUBLIC",
            createdAt: "2026-07-04T10:00:00.000Z",
            updatedAt: "2026-07-04T10:00:00.000Z",
          },
          { status: 201 },
        );
      }),
    );

    renderForm();

    await user.type(screen.getByLabelText("Título"), "Pastel de choclo");
    await user.type(
      screen.getByLabelText("Descripción"),
      "Clásico chileno",
    );
    await user.type(
      screen.getByPlaceholderText("Ingrediente"),
      "Choclo rallado",
    );
    await user.type(screen.getByPlaceholderText("Etiqueta"), "chileno");

    await user.click(screen.getByRole("button", { name: "Crear receta" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Receta creada",
    );

    // Backend only received title, description, status.
    expect(capturedBody).toEqual({
      title: "Pastel de choclo",
      description: "Clásico chileno",
      status: "DRAFT",
    });

    // Local-only fields remain visible in form state after a successful submit.
    expect(
      (screen.getByPlaceholderText("Ingrediente") as HTMLInputElement).value,
    ).toBe("Choclo rallado");
    expect(
      (screen.getByPlaceholderText("Etiqueta") as HTMLInputElement).value,
    ).toBe("chileno");
  });

  it("shows the English required-title error from the dictionary, not a hardcoded Spanish string", async () => {
    const user = userEvent.setup();
    renderForm("en");

    await user.click(screen.getByRole("button", { name: "Create Recipe" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Title is required");
    expect(alert).not.toHaveTextContent("El título es obligatorio");
    expect(screen.getByLabelText("Title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("shows the API submit-failure message when the request fails, not the required-title message", async () => {
    const user = userEvent.setup();
    server.use(
      http.post(`${API_BASE_URL}/recipes`, () =>
        HttpResponse.json({ message: "boom" }, { status: 500 }),
      ),
    );

    renderForm();

    await user.type(screen.getByLabelText("Título"), "Pastel de choclo");
    await user.click(screen.getByRole("button", { name: "Crear receta" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("No pudimos crear la receta. Inténtalo de nuevo.");
    expect(alert).not.toHaveTextContent("El título es obligatorio");
  });
});