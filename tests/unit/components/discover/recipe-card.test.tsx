import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecipeCard } from "@/components/discover/recipe-card";
import type { PublicRecipeCard } from "@/lib/api/public-recipes";

const recipe: PublicRecipeCard = {
  id: "recipe_1",
  title: "Tarta de manzana",
  description: "Postre simple",
  status: "PUBLIC",
  createdAt: "2026-06-28T10:00:00.000Z",
  image: { src: "https://images.unsplash.com/photo-1", alt: "Foto de Tarta de manzana" },
  author: { name: "Cocina Pública", avatarInitials: "CP" },
  category: "Postres",
};

describe("RecipeCard", () => {
  it("renders visible recipe metadata", () => {
    render(<RecipeCard recipe={recipe} publicLabel="PÚBLICA" />);

    expect(screen.getByRole("article", { name: "Tarta de manzana" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Foto de Tarta de manzana" })).toBeInTheDocument();
    expect(screen.getByText("Postre simple")).toBeInTheDocument();
    expect(screen.getByText("Cocina Pública")).toBeInTheDocument();
    expect(screen.getByText("Postres")).toBeInTheDocument();
    expect(screen.getByText("PÚBLICA")).toBeInTheDocument();
  });
});
