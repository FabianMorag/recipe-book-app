import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.route("**/recipes/public", async (route) => {
    await route.fulfill({
      json: [
        {
          id: "recipe_1",
          title: "Tarta de manzana",
          description: "Postre simple",
          status: "PUBLIC",
          createdAt: "2026-06-28T10:00:00.000Z",
        },
      ],
    });
  });

  await page.goto("/");

  await expect(page).toHaveTitle(/Recetario/);
  await expect(page.getByRole("heading", { name: "Descubre recetas públicas" })).toBeVisible();
});
