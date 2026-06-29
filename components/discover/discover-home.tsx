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
  const { data: recipes = [], isLoading, isError, refetch } = usePublicRecipes();

  const allCategory = t("categories.all");
  const categories = useMemo(
    () => [allCategory, ...Array.from(new Set(recipes.map((recipe) => recipe.category)))],
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
    <main className="min-h-dvh bg-base-200 pb-24">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="rounded-[2rem] bg-base-100 p-6 shadow-sm sm:p-8">
          <div>
            <p className="badge badge-soft mb-4">{t("hero.eyebrow")}</p>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-base-content sm:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/70 sm:text-lg">
              {t("hero.description")}
            </p>
          </div>
        </header>

        <section className="grid gap-4" aria-label="Explorar recetas">
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
          <p aria-live="polite" className="text-sm font-medium text-base-content/70">
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
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Recetas públicas"
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
      <div className="fixed right-4 top-4 z-10">
        <LocaleSwitch
          locale={locale}
          label={t("locale.label")}
          onLocaleChange={setLocale}
        />
      </div>
    </main>
  );
}
