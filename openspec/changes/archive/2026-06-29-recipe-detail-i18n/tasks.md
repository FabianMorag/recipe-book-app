# Tasks: Recipe Detail i18n

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~550-650 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full detail page + data + i18n + tests | Single PR | Fits project 2000-line budget |

## Phase 1: Data & i18n Foundation

- [x] 1.1 Add `PublicRecipeDetail` type, mock constants (`MOCK_DETAIL_TAGS`, `MOCK_DETAIL_STEPS`, etc.), and `mapPublicRecipeDetail()` to `lib/api/public-recipes.ts` — call `mapPublicRecipe()` first, add detail-only fields
- [x] 1.2 Add `usePublicRecipeDetail(id)` hook to `lib/api/use-public-recipes.ts` — select from existing query data via `find()` on cached recipes, fallback `null`
- [x] 1.3 Add `recipeDetail.*` keys (back, save, ingredients, steps, servings, aiHint, shared, authorLabel) to `lib/i18n/dictionaries.ts` in Spanish (default) and English

## Phase 2: Route & Components

- [x] 2.1 Create `app/recipes/[id]/page.tsx` — async Server Component awaiting `params: Promise<{ id }>`, renders `RecipeDetailPage` client island
- [x] 2.2 Create `components/recipe-detail/recipe-detail-page.tsx` — client composition: calls `usePublicRecipeDetail(id)`, renders loading/error/not-found states per spec scenarios
- [x] 2.3 Create `components/recipe-detail/detail-actions.tsx` — Back + Save icon buttons with `aria-label` from dictionaries, 44px targets, `focus-visible:outline-primary`
- [x] 2.4 Create `components/recipe-detail/hero-image.tsx` — `next/image` with `unoptimized`, descriptive `alt={title}`, rounded daisyUI card treatment
- [x] 2.5 Create `components/recipe-detail/recipe-meta.tsx` — shared status badge, author name, title (`h2`), tag pills using `badge` classes, i18n-aware text
- [x] 2.6 Create `components/recipe-detail/ingredient-list.tsx` — semantic `<ul>` with translated section heading "Ingredientes"/"Ingredients"
- [x] 2.7 Create `components/recipe-detail/step-cards.tsx` — numbered `<ol>` cards with translated heading "Preparación"/"Steps"
- [x] 2.8 Create `components/recipe-detail/ai-hint-card.tsx` — accent-border card with `aria-label="Sugerencia con IA"/"AI suggestion"` and locale-aware hint text

## Phase 3: Essential Testing

- [x] 3.1 Extend `tests/unit/api/public-recipes.test.ts` — verify `mapPublicRecipeDetail()` adds ingredients/steps/tags/servings/shared/aiHint and real-field precedence over mocks
- [x] 3.2 Extend `tests/unit/i18n/dictionaries.test.ts` — verify all `recipeDetail.*` keys exist in both locales
- [x] 3.3 Create `tests/unit/components/recipe-detail/recipe-detail-page.test.tsx` — render with `I18nProvider`, assert all sections present and i18n keys resolve
- [x] 3.4 Create `tests/integration/recipe-detail-page.test.tsx` — MSW mock for `/recipes/public`, render route wrapper, assert detail fields surface from mapper
