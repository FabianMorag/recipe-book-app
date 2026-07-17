# Tasks: Discover Home i18n

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1600–2000 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |
| User review budget override | 2000 lines |
| PR strategy | ask-always |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

> Note: No formatter configured (`config.yaml` testing.quality.formatter.available: false). Do not introduce formatting-only changes.

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | i18n foundation + public-recipes data layer | PR 1 | Dictionaries, provider, mapper, hook; unit + integration tests included |
| 2 | Discover UI components + wiring | PR 2 | All components, page/layout/providers mods, e2e smoke tests |

## Phase 1: i18n Foundation

- [x] 1.1 RED: Unit test dictionary completeness — every `es` key has matching `en` value (`tests/unit/i18n/dictionaries.test.ts`)
- [x] 1.2 RED: Unit test fallback translator — missing English key returns Spanish (`tests/unit/i18n/provider.test.tsx` using `tests/helpers/i18n.tsx`)
- [x] 1.3 GREEN: Create typed `es`/`en` dictionaries with `satisfies CompleteDictionaries` (`lib/i18n/dictionaries.ts`)
- [x] 1.4 GREEN: Create `I18nProvider` + `useTranslations()` hook with locale state, `t(key)` fallback, and html `lang` sync (`lib/i18n/provider.tsx`)
- [x] 1.5 GREEN: Create test-only partial dictionary helper (`tests/helpers/i18n.tsx`)

## Phase 2: Public Recipes Data Layer

- [x] 2.1 RED: Unit test mapper — verifies view-model shape, mocked fields, original field preservation, empty array (`tests/unit/api/public-recipes.test.ts`)
- [x] 2.2 GREEN: Create `mapPublicRecipe()` mapper with isolated mock image/author/category constants (`lib/api/public-recipes.ts`)
- [x] 2.3 RED: Integration test `usePublicRecipes()` — MSW intercepts `GET /recipes/public` for success/empty/error/timeout (`tests/integration/use-public-recipes.test.tsx`)
- [x] 2.4 GREEN: Create `usePublicRecipes()` hook wrapping `apiClient.GET('/recipes/public')` with TanStack Query (`lib/api/use-public-recipes.ts`)

## Phase 3: Discover Home Components — Test-First

- [x] 3.1 RED: Unit test `SearchBar` — renders with `aria-label="Buscar recetas"`, fires onChange (`tests/unit/components/discover/search-bar.test.tsx`)
- [x] 3.2 RED: Unit test `CategoryPills` — renders pills, toggles selection, `aria-pressed` state (`tests/unit/components/discover/category-pills.test.tsx`)
- [x] 3.3 RED: Unit test `RecipeCard` — renders title, description, author, category badge, image alt, PUBLIC badge (`tests/unit/components/discover/recipe-card.test.tsx`)
- [x] 3.4 RED: Unit test `BottomNav` — renders Discover/Create/Mine, Create/Mine disabled/placeholder, accessible labels (`tests/unit/components/discover/bottom-nav.test.tsx`)
- [x] 3.5 RED: Unit test `LocaleSwitch` — toggles ES/EN, fires locale change (`tests/unit/components/discover/locale-switch.test.tsx`)
- [x] 3.6 RED: Unit test `LoadingState`/`ErrorState`/`EmptyState` — correct ARIA roles and translated copy (`tests/unit/components/discover/states.test.tsx`)
- [x] 3.7 GREEN: Implement all Discover components (`components/discover/*.tsx`)
- [x] 3.8 RED: Unit test `DiscoverHome` — renders composed layout with i18n/query context wrapping (`tests/unit/components/discover/discover-home.test.tsx`)
- [x] 3.9 GREEN: Implement `DiscoverHome` composer component (`components/discover/discover-home.tsx`)

## Phase 4: Integration + Layout Wiring

- [x] 4.1 RED: Integration test page renders recipes from MSW — card titles visible, search filters, category toggles (`tests/integration/discover-home-page.test.tsx`)
- [x] 4.2 GREEN: Modify `app/providers.tsx` — wrap with `I18nProvider` (initialLocale="es")
- [x] 4.3 GREEN: Modify `app/layout.tsx` — `lang="es"`, Spanish title/description, `og:locale`
- [x] 4.4 GREEN: Modify `app/page.tsx` — replace starter content with `<DiscoverHome />`

## Phase 5: E2E Smoke Tests

- [x] 5.1 RED: Playwright test Spanish default — `document.documentElement.lang === "es"`, search placeholder in Spanish, nav labels Spanish (`tests/e2e/discover-home.spec.ts`)
- [x] 5.2 RED: Playwright test English switch — locale toggle updates copy and `lang` attribute
- [x] 5.3 RED: Playwright test empty/error/retry — mock 500, verify `role="alert"` and retry button
- [x] 5.4 RED: Playwright test keyboard navigation — Tab order: search → pills → cards → nav, focus rings visible
- [x] 5.5 GREEN: Update existing `tests/e2e/home.spec.ts` — assert Spanish title and discover layout, not starter page
- [x] 5.6 Run `pnpm test`, `pnpm lint`, `tsc --noEmit` — fix all failures before marking done
