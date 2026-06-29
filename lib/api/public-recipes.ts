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

export type PublicRecipeDetailFields = {
  ingredients: string[];
  steps: string[];
  servings: number;
  tags: string[];
  shared: boolean;
  aiHint: string;
};

export type PublicRecipeDetail = PublicRecipeCard & PublicRecipeDetailFields;

// Widened input: the backend may ship real detail fields in a future release.
// Real fields coexist with mocked values (mixin allowed, real values win).
type PublicRecipeDetailInput = PublicRecipeDto & Partial<PublicRecipeDetailFields>;

// Isolated mocked detail-only values. Replace when the backend ships real fields.
const MOCK_DETAIL_INGREDIENTS: string[][] = [
  ["500 g de carne molida", "2 cebollas", "3 huevos", "Sal y pimienta", "1 taza de caldo"],
  ["4 papas", "100 g de queso", "1 lata de atún", "Mayonesa", "Perejil fresco"],
];
const MOCK_DETAIL_STEPS: string[][] = [
  [
    "Sofreír la cebolla en aceite caliente.",
    "Agregar la carne y cocinar 10 minutos.",
    "Servir caliente con el caldo.",
  ],
  [
    "Cocer las papas hasta que estén tiernas.",
    "Mezclar con el atún y el queso.",
    "Decorar con perejil fresco.",
  ],
];
const MOCK_DETAIL_TAGS = ["chileno", "horno"];
const MOCK_DETAIL_SERVINGS = 4;
const MOCK_DETAIL_AI_HINT =
  "Sugerencia de IA: prueba acompañar esta receta con una ensalada fresca.";

export function mapPublicRecipeDetail(
  recipe: PublicRecipeDetailInput,
  index = 0,
): PublicRecipeDetail {
  const card = mapPublicRecipe(recipe, index);
  return {
    ...card,
    ingredients:
      recipe.ingredients ??
      MOCK_DETAIL_INGREDIENTS[index % MOCK_DETAIL_INGREDIENTS.length],
    steps: recipe.steps ?? MOCK_DETAIL_STEPS[index % MOCK_DETAIL_STEPS.length],
    servings: recipe.servings ?? MOCK_DETAIL_SERVINGS,
    tags: recipe.tags ?? [...MOCK_DETAIL_TAGS],
    shared: recipe.shared ?? (recipe.status === "PUBLIC"),
    aiHint: recipe.aiHint ?? MOCK_DETAIL_AI_HINT,
  };
}
