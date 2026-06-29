import type { PublicRecipeDetail } from "@/lib/api/public-recipes";

export const mockRecipeDetail: PublicRecipeDetail = {
  id: "recipe_1",
  title: "Pastel de Choclo",
  description: "Receta tradicional chilena al horno.",
  status: "PUBLIC",
  createdAt: "2026-06-28T10:00:00.000Z",
  image: {
    src: "https://images.unsplash.com/photo-1",
    alt: "Foto de Pastel de Choclo",
  },
  author: { name: "María", avatarInitials: "M" },
  category: "Postres",
  ingredients: [
    "500 g de choclo",
    "2 cebollas",
    "3 huevos",
    "Sal y pimienta",
    "1 taza de caldo",
  ],
  steps: [
    "Sofreír la cebolla en aceite caliente.",
    "Agregar el choclo y los huevos.",
    "Hornear 30 minutos hasta dorar.",
  ],
  servings: 4,
  tags: ["chileno", "horno"],
  shared: true,
  aiHint: "Sugerencia de IA: acompáñalo con una ensalada fresca.",
};
