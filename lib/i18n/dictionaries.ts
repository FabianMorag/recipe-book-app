export const es = {
  "app.title": "Recetario",
  "app.description": "Descubre, guarda y cocina tus recetas favoritas.",
  "hero.eyebrow": "Recetas públicas",
  "hero.title": "Descubre recetas públicas",
  "hero.description": "Explora ideas simples para cocinar hoy, con búsquedas rápidas y categorías listas para navegar.",
  "search.placeholder": "Buscar recetas",
  "categories.all": "Todas",
  "recipe.public": "PÚBLICA",
  "results.one": "1 receta encontrada",
  "results.many": "{count} recetas encontradas",
  "states.loading": "Cargando recetas",
  "states.empty.title": "No hay recetas públicas todavía",
  "states.empty.message": "Prueba otra búsqueda o vuelve más tarde para encontrar nuevas ideas.",
  "states.error.title": "No pudimos cargar las recetas",
  "states.error.retry": "Reintentar",
  "nav.label": "Navegación principal",
  "nav.discover": "Descubrir",
  "nav.create": "Crear",
  "nav.mine": "Mis recetas",
  "locale.label": "Idioma",
} as const;

export type TranslationKey = keyof typeof es;
export type Locale = "es" | "en";
export type CompleteDictionaries = Record<Locale, Record<TranslationKey, string>>;

export const dictionaries = {
  es,
  en: {
    "app.title": "Recipe Book",
    "app.description": "Discover, save, and cook favorite recipes.",
    "hero.eyebrow": "Public recipes",
    "hero.title": "Discover public recipes",
    "hero.description": "Explore simple ideas to cook today, with fast search and categories ready to browse.",
    "search.placeholder": "Search recipes",
    "categories.all": "All",
    "recipe.public": "PUBLIC",
    "results.one": "1 recipe found",
    "results.many": "{count} recipes found",
    "states.loading": "Loading recipes",
    "states.empty.title": "No public recipes yet",
    "states.empty.message": "Try another search or come back later for new ideas.",
    "states.error.title": "We could not load recipes",
    "states.error.retry": "Retry",
    "nav.label": "Main navigation",
    "nav.discover": "Discover",
    "nav.create": "Create",
    "nav.mine": "My recipes",
    "locale.label": "Language",
  },
} satisfies CompleteDictionaries;

export function translate(
  locale: Locale,
  key: TranslationKey,
  dictionary: { es: Record<TranslationKey, string>; en?: Partial<Record<TranslationKey, string>> } = dictionaries,
) {
  return dictionary[locale]?.[key] ?? dictionary.es[key];
}
