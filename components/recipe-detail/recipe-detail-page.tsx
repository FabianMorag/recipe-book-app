"use client";

import { usePublicRecipeDetail } from "@/lib/api/use-public-recipes";
import { useTranslations } from "@/lib/i18n/provider";
import { ErrorState, LoadingState } from "@/components/discover/states";
import { AiHintCard } from "./ai-hint-card";
import { DetailActions } from "./detail-actions";
import { HeroImage } from "./hero-image";
import { IngredientList } from "./ingredient-list";
import { RecipeMeta } from "./recipe-meta";
import { StepCards } from "./step-cards";

export function RecipeDetailPage({ recipeId }: { recipeId: string }) {
  const { t } = useTranslations();
  const { data: recipe, isLoading, isError, refetch } =
    usePublicRecipeDetail(recipeId);

  return (
    <main className="min-h-dvh bg-base-200">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-4">
        <DetailActions
          backLabel={t("recipeDetail.back")}
          saveLabel={t("recipeDetail.save")}
        />

        {isLoading ? <LoadingState label={t("recipeDetail.loading")} /> : null}

        {isError ? (
          <ErrorState
            title={t("recipeDetail.error")}
            retryLabel={t("recipeDetail.retry")}
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && !recipe ? (
          <section className="rounded-box border border-dashed border-base-300 bg-base-100 p-8 text-center">
            <p className="text-base text-base-content/70">
              {t("recipeDetail.notFound")}
            </p>
          </section>
        ) : null}

        {!isLoading && !isError && recipe ? (
          <>
            <HeroImage recipe={recipe} />
            <RecipeMeta
              recipe={recipe}
              sharedLabel={t("recipeDetail.statusShared")}
              authorLabel={t("recipeDetail.authorLabel")}
            />
            <IngredientList
              ingredients={recipe.ingredients}
              heading={t("recipeDetail.ingredients")}
              servings={recipe.servings}
              servingsLabel={t("recipeDetail.servings")}
            />
            <StepCards steps={recipe.steps} heading={t("recipeDetail.steps")} />
            <AiHintCard
              label={t("recipeDetail.aiHint.label")}
              text={t("recipeDetail.aiHint.text")}
            />
          </>
        ) : null}
      </article>
    </main>
  );
}
