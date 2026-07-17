# Tasks: Create Recipe i18n

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~550 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: schema + i18n + API + tests → PR 2: form UI + gap list |
| Delivery strategy | ask-on-risk |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Schema, i18n keys, API wrapper, submit boundary + tests | PR 1 | Base: main. ~220 lines, standalone verification. |
| 2 | Form component, route shell, bottom-nav, gap list + integration test | PR 2 | Base: PR 1. ~330 lines. |

## Phase 1: Foundation — Schema & i18n

- [x] 1.1 Add `createRecipe.*` keys to `lib/i18n/dictionaries.ts` in `es` (default) and `en` (secondary): heading, labels, placeholders, status options, AI helper, boundary notice, submit text, error messages.
- [x] 1.2 Create `components/create-recipe/schema.ts` with module-level Zod schema, `CreateRecipeFormValues` type, `defaultValues`, exported `createRecipeSchema`. Include required `title`, optional `description`, `status` enum, `tags/ingredients/steps` arrays with `{ value }`, `aiHelperEnabled` boolean.

## Phase 2: Core — API & Form

- [x] 2.1 Create `lib/api/create-recipe.ts` exporting `createRecipe()` wrapping `apiClient.POST('/recipes', { body })` typed from `CreateRecipeDto`/`RecipeResponseDto`.
- [x] 2.2 Create `components/create-recipe/submit-boundary.ts` exporting `toCreateRecipePayload(form: CreateRecipeFormValues): CreateRecipePayload` returning only `{ title, description, status }`.
- [x] 2.3 Create `components/create-recipe/create-recipe-form.tsx` client component using `useForm` + `zodResolver`, `mode: "onSubmit"`, `reValidateMode: "onBlur"`, `useFieldArray` for ingredients/steps. Responsive daisyUI layout. Boundary notice. Success alert stays in-form.
- [x] 2.4 Create `app/recipes/new/page.tsx` Server Component shell rendering `CreateRecipeForm`.
- [x] 2.5 Modify `components/discover/bottom-nav.tsx`: wire Create button as `Link` to `/recipes/new` with active state when path matches.

## Phase 3: Tests (strict TDD)

- [x] 3.1 `tests/unit/components/create-recipe/schema.test.ts` — `safeParse` rejects empty title; accepts valid payload; rejects invalid status; local arrays accept shape.
- [x] 3.2 `tests/unit/components/create-recipe/submit-boundary.test.ts` — `toCreateRecipePayload` excludes tags, ingredients, steps, aiHelperEnabled.
- [x] 3.3 `tests/unit/i18n/dictionaries.test.ts` — add `createRecipe.*` key parity and resolution assertions for es/en.
- [x] 3.4 `tests/integration/create-recipe-form.test.tsx` — renders Spanish labels; empty title shows error; successful submit posts DTO and shows confirmation with local fields visible (MSW mock).

## Phase 4: Gap List

- [x] 4.1 Create `components/create-recipe/api-gaps.md` listing: tags persistence, ingredients with units, ordered steps, image upload, servings, AI metadata, status transitions — each with description and impact.
