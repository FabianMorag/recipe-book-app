import { expect, test } from "@playwright/test";

const recipes = [
  {
    id: "recipe_1",
    title: "Tarta de manzana",
    description: "Postre simple",
    status: "PUBLIC",
    createdAt: "2026-06-28T10:00:00.000Z",
  },
  {
    id: "recipe_2",
    title: "Sopa de calabaza",
    description: "Cena suave",
    status: "PUBLIC",
    createdAt: "2026-06-28T11:00:00.000Z",
  },
  {
    id: "recipe_3",
    title: "Wrap rápido",
    description: "Almuerzo simple",
    status: "PUBLIC",
    createdAt: "2026-06-28T12:00:00.000Z",
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/recipes/public", async (route) => {
    await route.fulfill({ json: recipes });
  });
});

test("Spanish default renders discover copy", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByLabel("Buscar recetas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Descubrir" })).toBeVisible();
});

test("English switch updates copy and html lang", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Idioma EN", exact: true }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByLabel("Search recipes")).toBeVisible();
  await expect(page.getByRole("button", { name: "Discover" })).toBeVisible();
});

test("metadata head renders Spanish title, description, and OG locale", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Recetario");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Descubre, guarda y cocina tus recetas favoritas.",
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es");
});

test("mobile viewport stacks cards and fixes bottom navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const firstCard = page.getByRole("article", { name: "Tarta de manzana" });
  const secondCard = page.getByRole("article", { name: "Sopa de calabaza" });
  await expect(firstCard).toBeVisible();
  await expect(secondCard).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).toHaveCSS(
    "position",
    "fixed",
  );

  const firstBox = await firstCard.boundingBox();
  const secondBox = await secondCard.boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  expect(secondBox!.y).toBeGreaterThan(firstBox!.y + firstBox!.height - 1);
  expect(Math.abs(secondBox!.x - firstBox!.x)).toBeLessThan(2);
});

test("desktop viewport centers content and renders a multi-column recipe grid", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const recipeGrid = page.getByRole("region", { name: "Recetas públicas" });
  await expect(recipeGrid).toBeVisible();
  await expect(recipeGrid).toHaveCSS("grid-template-columns", /.+ .+ .+/);

  const gridBox = await recipeGrid.boundingBox();
  expect(gridBox).not.toBeNull();
  expect(gridBox!.x).toBeGreaterThan(0);
  expect(gridBox!.x + gridBox!.width).toBeLessThanOrEqual(1280);
});

test("error state exposes retry", async ({ page }) => {
  await page.unroute("**/recipes/public");
  await page.route("**/recipes/public", async (route) => {
    await route.fulfill({ status: 500, body: "" });
  });

  await page.goto("/");

  await expect(
    page.getByRole("alert").filter({ hasText: "No pudimos cargar las recetas" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeVisible();
});

test("empty state keeps controls interactive", async ({ page }) => {
  await page.unroute("**/recipes/public");
  await page.route("**/recipes/public", async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.goto("/");

  await expect(page.getByText("No hay recetas públicas todavía")).toBeVisible();
  await expect(page.getByLabel("Buscar recetas")).toBeEnabled();
});

test("keyboard navigation reaches search, pills, cards, and nav", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("article", { name: "Tarta de manzana" })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Buscar recetas")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Todas" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Postres" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Sopas" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Platos rápidos" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("article", { name: "Tarta de manzana" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("article", { name: "Sopa de calabaza" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("article", { name: "Wrap rápido" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Descubrir" })).toBeFocused();
});

test("result count is announced with aria-live as filters change", async ({ page }) => {
  await page.goto("/");

  const resultCount = page.locator('[aria-live="polite"]');
  await expect(resultCount).toHaveText("3 recetas encontradas");
  await page.getByRole("button", { name: "Sopas" }).click();
  await expect(resultCount).toHaveText("1 receta encontrada");
});
