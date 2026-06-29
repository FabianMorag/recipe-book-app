"use client";

import { useMemo, useState } from "react";
import { usePublicRecipes } from "@/lib/api/use-public-recipes";
import { useTranslations } from "@/lib/i18n/provider";
import { BottomNav } from "./bottom-nav";
import { CategoryPills } from "./category-pills";
import { LocaleSwitch } from "./locale-switch";
import { RecipeCard } from "./recipe-card";
import { SearchBar } from "./search-bar";
import { EmptyState, ErrorState, LoadingState } from "./states";

export function DiscoverHome() {
  const { locale, setLocale, t } = useTranslations();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("categories.all"));
  const {
    data: recipes = [],
    isLoading,
    isError,
    refetch,
  } = usePublicRecipes();

  const allCategory = t("categories.all");
  const categories = useMemo(
    () => [
      allCategory,
      ...Array.from(new Set(recipes.map((recipe) => recipe.category))),
    ],
    [allCategory, recipes],
  );

  const effectiveSelectedCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : allCategory;

  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesQuery = normalizedQuery
      ? `${recipe.title} ${recipe.description ?? ""}`
          .toLocaleLowerCase(locale)
          .includes(normalizedQuery)
      : true;
    const matchesCategory =
      effectiveSelectedCategory === allCategory ||
      recipe.category === effectiveSelectedCategory;

    return matchesQuery && matchesCategory;
  });

  const resultCount =
    filteredRecipes.length === 1
      ? t("results.one")
      : t("results.many").replace("{count}", String(filteredRecipes.length));

  return (
    <main className="bg-base-200 pb-24 min-h-dvh">
      <section className="flex flex-col gap-8 mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 w-full max-w-6xl">
        <header className="bg-base-100 shadow-sm p-6 sm:p-8 rounded-[2rem]">
          <div>
            <p className="mb-4 badge badge-soft">{t("hero.eyebrow")}</p>
            <h1 className="max-w-2xl font-black text-base-content text-4xl sm:text-5xl tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-base-content/70 sm:text-lg leading-7">
              {t("hero.description")}
            </p>
          </div>
        </header>

        <section className="gap-4 grid" aria-label="Explorar recetas">
          <SearchBar
            value={query}
            placeholder={t("search.placeholder")}
            onChange={setQuery}
          />
          <CategoryPills
            categories={categories}
            selectedCategory={effectiveSelectedCategory}
            onSelect={setSelectedCategory}
          />
          <p
            aria-live="polite"
            className="font-medium text-sm text-base-content/70"
          >
            {resultCount}
          </p>
        </section>

        {isLoading ? <LoadingState label={t("states.loading")} /> : null}
        {isError ? (
          <ErrorState
            title={t("states.error.title")}
            retryLabel={t("states.error.retry")}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && filteredRecipes.length === 0 ? (
          <EmptyState
            title={t("states.empty.title")}
            message={t("states.empty.message")}
          />
        ) : null}
        {!isLoading && !isError && filteredRecipes.length > 0 ? (
          <section
            className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Recetas compartidas"
          >
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                publicLabel={t("recipe.public")}
              />
            ))}
          </section>
        ) : null}
      </section>

      <BottomNav
        labels={{
          discover: t("nav.discover"),
          create: t("nav.create"),
          mine: t("nav.mine"),
        }}
      />
      <div className="top-4 right-4 z-10 fixed">
        <LocaleSwitch
          locale={locale}
          label={t("locale.label")}
          onLocaleChange={setLocale}
        />
      </div>
    </main>
  );
}
