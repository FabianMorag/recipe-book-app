export const es = {
  "app.title": "Recetario",
  "app.description": "Descubre, guarda y cocina tus recetas favoritas.",
  "hero.eyebrow": "Recetas compartidas",
  "hero.title": "Descubre recetas compartidas",
  "hero.description":
    "Explora ideas simples para cocinar hoy, con búsquedas rápidas y categorías listas para navegar.",
  "search.placeholder": "Buscar recetas",
  "categories.all": "Todas",
  "recipe.public": "PÚBLICA",
  "results.one": "1 receta encontrada",
  "results.many": "{count} recetas encontradas",
  "states.loading": "Cargando recetas",
  "states.empty.title": "No hay recetas compartidas todavía",
  "states.empty.message":
    "Prueba otra búsqueda o vuelve más tarde para encontrar nuevas ideas.",
  "states.error.title": "No pudimos cargar las recetas",
  "states.error.retry": "Reintentar",
  "nav.label": "Navegación principal",
  "nav.discover": "Descubrir",
  "nav.create": "Crear",
  "nav.mine": "Mis recetas",
  "locale.label": "Idioma",
  "recipeDetail.back": "Volver a Descubrir",
  "recipeDetail.save": "Guardar receta",
  "recipeDetail.statusShared": "Compartida",
  "recipeDetail.authorLabel": "por",
  "recipeDetail.servings": "Porciones",
  "recipeDetail.ingredients": "Ingredientes",
  "recipeDetail.steps": "Preparación",
  "recipeDetail.aiHint.label": "Sugerencia con IA",
  "recipeDetail.aiHint.text":
    "Prueba acompañar esta receta con una ensalada fresca para un plato más completo.",
  "recipeDetail.loading": "Cargando receta",
  "recipeDetail.error": "No pudimos cargar la receta",
  "recipeDetail.retry": "Reintentar",
  "recipeDetail.notFound": "No encontramos esta receta",
  "createRecipe.heading": "Nueva receta",
  "createRecipe.title": "Título",
  "createRecipe.titlePlaceholder": "Escribe el título de la receta",
  "createRecipe.description": "Descripción",
  "createRecipe.descriptionPlaceholder":
    "Notas generales, contexto o acompañamientos",
  "createRecipe.status": "Visibilidad",
  "createRecipe.statusDraft": "Borrador",
  "createRecipe.statusPrivate": "Privada",
  "createRecipe.statusPublic": "Pública",
  "createRecipe.tags": "Etiquetas",
  "createRecipe.tagsPlaceholder": "Etiqueta",
  "createRecipe.tagsAdd": "Agregar etiqueta",
  "createRecipe.ingredients": "Ingredientes",
  "createRecipe.ingredientsPlaceholder": "Ingrediente",
  "createRecipe.ingredientsAdd": "Agregar ingrediente",
  "createRecipe.steps": "Preparación",
  "createRecipe.stepsPlaceholder": "Paso",
  "createRecipe.stepsAdd": "Agregar paso",
  "createRecipe.aiHelper": "Ayuda con IA",
  "createRecipe.aiHelperHint":
    "Próximamente: sugerencias inteligentes mientras escribes.",
  "createRecipe.boundaryNotice":
    "Estos campos no se guardan todavía. Se conservan mientras redactas la receta.",
  "createRecipe.submit": "Crear receta",
  "createRecipe.submitting": "Guardando…",
  "createRecipe.success": "Receta creada. Puedes seguir editando los campos locales.",
  "createRecipe.errorRequiredTitle": "El título es obligatorio",
  "createRecipe.errorSubmit":
    "No pudimos crear la receta. Inténtalo de nuevo.",
} as const;

export type TranslationKey = keyof typeof es;
export type Locale = "es" | "en";
export type CompleteDictionaries = Record<
  Locale,
  Record<TranslationKey, string>
>;

export const dictionaries = {
  es,
  en: {
    "app.title": "Recipe Book",
    "app.description": "Discover, save, and cook favorite recipes.",
    "hero.eyebrow": "Public recipes",
    "hero.title": "Discover public recipes",
    "hero.description":
      "Explore simple ideas to cook today, with fast search and categories ready to browse.",
    "search.placeholder": "Search recipes",
    "categories.all": "All",
    "recipe.public": "PUBLIC",
    "results.one": "1 recipe found",
    "results.many": "{count} recipes found",
    "states.loading": "Loading recipes",
    "states.empty.title": "No public recipes yet",
    "states.empty.message":
      "Try another search or come back later for new ideas.",
    "states.error.title": "We could not load recipes",
    "states.error.retry": "Retry",
    "nav.label": "Main navigation",
    "nav.discover": "Discover",
    "nav.create": "Create",
    "nav.mine": "My recipes",
    "locale.label": "Language",
    "recipeDetail.back": "Back to Discover",
    "recipeDetail.save": "Save recipe",
    "recipeDetail.statusShared": "Shared",
    "recipeDetail.authorLabel": "by",
    "recipeDetail.servings": "Servings",
    "recipeDetail.ingredients": "Ingredients",
    "recipeDetail.steps": "Steps",
    "recipeDetail.aiHint.label": "AI suggestion",
    "recipeDetail.aiHint.text":
      "Try pairing this recipe with a fresh salad for a more complete meal.",
    "recipeDetail.loading": "Loading recipe",
    "recipeDetail.error": "We could not load this recipe",
    "recipeDetail.retry": "Retry",
    "recipeDetail.notFound": "We could not find this recipe",
    "createRecipe.heading": "New recipe",
    "createRecipe.title": "Title",
    "createRecipe.titlePlaceholder": "Enter the recipe title",
    "createRecipe.description": "Description",
    "createRecipe.descriptionPlaceholder":
      "General notes, context, or pairings",
    "createRecipe.status": "Visibility",
    "createRecipe.statusDraft": "Draft",
    "createRecipe.statusPrivate": "Private",
    "createRecipe.statusPublic": "Public",
    "createRecipe.tags": "Tags",
    "createRecipe.tagsPlaceholder": "Tag",
    "createRecipe.tagsAdd": "Add tag",
    "createRecipe.ingredients": "Ingredients",
    "createRecipe.ingredientsPlaceholder": "Ingredient",
    "createRecipe.ingredientsAdd": "Add ingredient",
    "createRecipe.steps": "Steps",
    "createRecipe.stepsPlaceholder": "Step",
    "createRecipe.stepsAdd": "Add step",
    "createRecipe.aiHelper": "AI helper",
    "createRecipe.aiHelperHint":
      "Coming soon: smart suggestions while you write.",
    "createRecipe.boundaryNotice":
      "These fields are not saved yet. They stay while you draft the recipe.",
    "createRecipe.submit": "Create Recipe",
    "createRecipe.submitting": "Saving…",
    "createRecipe.success": "Recipe created. You can keep editing local fields.",
    "createRecipe.errorRequiredTitle": "Title is required",
    "createRecipe.errorSubmit":
      "We could not create the recipe. Please try again.",
  },
} satisfies CompleteDictionaries;

export function translate(
  locale: Locale,
  key: TranslationKey,
  dictionary: {
    es: Record<TranslationKey, string>;
    en?: Partial<Record<TranslationKey, string>>;
  } = dictionaries,
) {
  return dictionary[locale]?.[key] ?? dictionary.es[key];
}
