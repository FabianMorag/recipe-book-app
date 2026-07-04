"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslations, type TranslationKey } from "@/lib/i18n/provider";
import { createRecipe } from "@/lib/api/create-recipe";
import {
  createRecipeSchema,
  defaultCreateRecipeValues,
  recipeStatuses,
  type CreateRecipeFormValues,
  type RecipeStatus,
} from "./schema";
import { toCreateRecipePayload } from "./submit-boundary";

const statusLabelKey: Record<RecipeStatus, TranslationKey> = {
  DRAFT: "createRecipe.statusDraft",
  PRIVATE: "createRecipe.statusPrivate",
  PUBLIC: "createRecipe.statusPublic",
};

export function CreateRecipeForm() {
  const { t } = useTranslations();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecipeFormValues>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: defaultCreateRecipeValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const tags = useFieldArray({ control, name: "tags" });
  const ingredients = useFieldArray({ control, name: "ingredients" });
  const steps = useFieldArray({ control, name: "steps" });

  const mutation = useMutation({
    mutationFn: createRecipe,
  });

  const onSubmit = handleSubmit((values) => {
    // Use the non-throwing mutate() so API/network/server failures are captured
    // by mutation.isError instead of surfacing as an unhandled promise rejection
    // from handleSubmit. The submit button stays disabled via mutation.isPending.
    mutation.mutate(toCreateRecipePayload(values));
  });

  const showError = Boolean(mutation.isError);
  const showSuccess = mutation.isSuccess && !mutation.isPending;

  return (
    <main className="min-h-dvh bg-base-200 pb-24">
      <form
        onSubmit={onSubmit}
        noValidate
        aria-labelledby="create-recipe-heading"
        className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
      >
        <header>
          <h1
            id="create-recipe-heading"
            className="text-3xl font-black text-base-content sm:text-4xl"
          >
            {t("createRecipe.heading")}
          </h1>
          <p
            className="mt-2 inline-flex rounded-box bg-warning/15 px-3 py-2 text-sm text-base-content/80"
            role="note"
          >
            {t("createRecipe.boundaryNotice")}
          </p>
        </header>

        <section className="card bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div className="form-control">
              <label htmlFor="create-recipe-title" className="label">
                <span className="label-text font-semibold">
                  {t("createRecipe.title")}
                </span>
              </label>
              <input
                id="create-recipe-title"
                type="text"
                placeholder={t("createRecipe.titlePlaceholder")}
                autoComplete="off"
                aria-invalid={errors.title ? "true" : undefined}
                aria-describedby={
                  errors.title ? "create-recipe-title-error" : undefined
                }
                className="input input-bordered min-h-12 w-full focus-visible:outline-2 focus-visible:outline-primary"
                {...register("title")}
              />
              {errors.title ? (
                <p
                  id="create-recipe-title-error"
                  role="alert"
                  className="mt-1 text-sm text-error"
                >
                  {t("createRecipe.errorRequiredTitle")}
                </p>
              ) : null}
            </div>

            <div className="form-control">
              <label htmlFor="create-recipe-description" className="label">
                <span className="label-text font-semibold">
                  {t("createRecipe.description")}
                </span>
              </label>
              <textarea
                id="create-recipe-description"
                placeholder={t("createRecipe.descriptionPlaceholder")}
                rows={3}
                className="textarea textarea-bordered min-h-24 w-full focus-visible:outline-2 focus-visible:outline-primary"
                {...register("description")}
              />
            </div>

            <div className="form-control">
              <label htmlFor="create-recipe-status" className="label">
                <span className="label-text font-semibold">
                  {t("createRecipe.status")}
                </span>
              </label>
              <select
                id="create-recipe-status"
                className="select select-bordered min-h-12 w-full focus-visible:outline-2 focus-visible:outline-primary"
                {...register("status")}
              >
                {recipeStatuses.map((status) => {
                  return (
                    <option key={status} value={status}>
                      {t(statusLabelKey[status])}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </section>

        <LocalFieldSection
          heading={t("createRecipe.tags")}
          placeholder={t("createRecipe.tagsPlaceholder")}
          addLabel={t("createRecipe.tagsAdd")}
          fields={tags}
          registerBase="tags"
          registerFn={register}
        />
        <LocalFieldSection
          heading={t("createRecipe.ingredients")}
          placeholder={t("createRecipe.ingredientsPlaceholder")}
          addLabel={t("createRecipe.ingredientsAdd")}
          fields={ingredients}
          registerBase="ingredients"
          registerFn={register}
        />
        <LocalFieldSection
          heading={t("createRecipe.steps")}
          placeholder={t("createRecipe.stepsPlaceholder")}
          addLabel={t("createRecipe.stepsAdd")}
          fields={steps}
          registerBase="steps"
          registerFn={register}
        />

        <section
          className="card bg-base-100 shadow-sm"
          aria-label={t("createRecipe.aiHelper")}
        >
          <div className="card-body gap-2">
            <div className="form-control flex-row items-center gap-3">
              <input
                id="create-recipe-ai-helper"
                type="checkbox"
                className="checkbox checkbox-primary min-h-7 min-w-7"
                {...register("aiHelperEnabled")}
              />
              <label
                htmlFor="create-recipe-ai-helper"
                className="label justify-start gap-2"
              >
                <span className="label-text font-semibold">
                  {t("createRecipe.aiHelper")}
                </span>
              </label>
            </div>
            <p className="text-sm text-base-content/70">
              {t("createRecipe.aiHelperHint")}
            </p>
          </div>
        </section>

        {showSuccess ? (
          <p
            role="status"
            className="alert alert-success min-h-12 items-center"
          >
            {t("createRecipe.success")}
          </p>
        ) : null}
        {showError ? (
          <p role="alert" className="alert alert-error min-h-12 items-center">
            {t("createRecipe.errorSubmit")}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="btn btn-primary min-h-12 w-full focus-visible:outline-2 focus-visible:outline-primary"
        >
          {isSubmitting || mutation.isPending
            ? t("createRecipe.submitting")
            : t("createRecipe.submit")}
        </button>
      </form>
    </main>
  );
}

type LocalFieldSectionProps = {
  heading: string;
  placeholder: string;
  addLabel: string;
  fields: ReturnType<typeof useFieldArray<CreateRecipeFormValues>>;
  registerBase: "tags" | "ingredients" | "steps";
  registerFn: ReturnType<typeof useForm<CreateRecipeFormValues>>["register"];
};

function LocalFieldSection({
  heading,
  placeholder,
  addLabel,
  fields,
  registerBase,
  registerFn,
}: LocalFieldSectionProps) {
  return (
    <section className="card bg-base-100 shadow-sm" aria-label={heading}>
      <div className="card-body gap-3">
        <h2 className="text-lg font-bold text-base-content">{heading}</h2>
        <ul className="flex flex-col gap-2">
          {fields.fields.map((field, index) => (
            <li key={field.id} className="flex flex-col gap-1">
              <label
                htmlFor={`${registerBase}-${field.id}`}
                className="sr-only"
              >
                {heading}
              </label>
              <input
                id={`${registerBase}-${field.id}`}
                type="text"
                placeholder={placeholder}
                autoComplete="off"
                className="input input-bordered min-h-12 w-full focus-visible:outline-2 focus-visible:outline-primary"
                {...registerFn(`${registerBase}.${index}.value` as const)}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => fields.append({ value: "" })}
          className="btn btn-ghost btn-sm min-h-10 self-start focus-visible:outline-2 focus-visible:outline-primary"
        >
          {addLabel}
        </button>
      </div>
    </section>
  );
}