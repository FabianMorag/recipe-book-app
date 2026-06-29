import type { components } from "./schema";

export type PublicRecipeDto = components["schemas"]["RecipeListItemDto"];

export type PublicRecipeCard = PublicRecipeDto & {
  image: {
    src: string;
    alt: string;
  };
  author: {
    name: string;
    avatarInitials: string;
  };
  category: string;
};

const MOCK_PUBLIC_RECIPE_IMAGES = [
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=900&q=80",
] as const;

const MOCK_PUBLIC_RECIPE_CATEGORIES = ["Postres", "Sopas", "Platos rápidos"] as const;
const MOCK_PUBLIC_RECIPE_AUTHOR = {
  name: "Cocina Pública",
  avatarInitials: "CP",
} as const;

export function mapPublicRecipe(
  recipe: PublicRecipeDto,
  index = 0,
): PublicRecipeCard {
  return {
    ...recipe,
    image: {
      src: MOCK_PUBLIC_RECIPE_IMAGES[index % MOCK_PUBLIC_RECIPE_IMAGES.length],
      alt: `Foto de ${recipe.title}`,
    },
    author: MOCK_PUBLIC_RECIPE_AUTHOR,
    category:
      MOCK_PUBLIC_RECIPE_CATEGORIES[index % MOCK_PUBLIC_RECIPE_CATEGORIES.length],
  };
}

export function mapPublicRecipes(recipes: PublicRecipeDto[]) {
  return recipes.map(mapPublicRecipe);
}
