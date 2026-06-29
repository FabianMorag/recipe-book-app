# Apply Progress: Discover Home i18n

## Status

Complete: Phases 1–5 are implemented and all verify blockers are resolved with Vitest, lint, typecheck, production build, and Playwright E2E passing.

## Completed Tasks

- [x] 1.1 Unit test dictionary completeness
- [x] 1.2 Unit test fallback translator
- [x] 1.3 Typed Spanish/English dictionaries
- [x] 1.4 `I18nProvider` + `useTranslations()` hook
- [x] 1.5 Test-only partial dictionary helper
- [x] 2.1 Unit test public recipe mapper
- [x] 2.2 Public recipe mapper with isolated mock metadata
- [x] 2.3 MSW integration test for `usePublicRecipes()`
- [x] 2.4 `usePublicRecipes()` TanStack Query hook using `apiClient.GET('/recipes/public')`
- [x] 3.1 `SearchBar` unit test
- [x] 3.2 `CategoryPills` unit test
- [x] 3.3 `RecipeCard` unit test
- [x] 3.4 `BottomNav` unit test
- [x] 3.5 `LocaleSwitch` unit test
- [x] 3.6 State component unit tests
- [x] 3.7 Discover component implementation
- [x] 3.8 `DiscoverHome` unit test
- [x] 3.9 `DiscoverHome` composer implementation
- [x] 4.1 Page integration test with MSW
- [x] 4.2 `app/providers.tsx` i18n wrapping
- [x] 4.3 `app/layout.tsx` Spanish metadata/lang
- [x] 4.4 `app/page.tsx` Discover Home route wiring

- [x] 5.1 Playwright Spanish default test
- [x] 5.2 Playwright English switch test
- [x] 5.3 Playwright empty/error/retry test
- [x] 5.4 Playwright keyboard navigation test
- [x] 5.5 Existing `tests/e2e/home.spec.ts` updated
- [x] 5.6 Final verification suite
- [x] Verify blocker fix: unambiguous locale-switch locator/accessibility name
- [x] Verify blocker fix: responsive mobile/desktop runtime coverage
- [x] Verify blocker fix: metadata head / OG locale runtime coverage
- [x] Verify blocker fix: full keyboard order through cards and bottom nav
- [x] Verify blocker fix: `aria-live` result-count runtime coverage
- [x] Verify blocker fix: public-recipes stale-time cache behavior coverage
- [x] Verify blocker fix: Discover Home page-level pending-fetch loading coverage

## Blocked / Pending Tasks

None.

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1–1.5 | `tests/unit/i18n/*.test.*`, `tests/helpers/i18n.tsx` | Unit | ✅ 2/2 baseline | ✅ Written first | ✅ `pnpm test` | ✅ completeness + fallback + hook guard | ✅ typed dictionary/provider split |
| 2.1–2.4 | `tests/unit/api/public-recipes.test.ts`, `tests/integration/use-public-recipes.test.tsx` | Unit + Integration | N/A (new) | ✅ Written first | ✅ `pnpm test` | ✅ success + empty + error + timeout | ✅ mapper/hook separation |
| 3.1–3.9 | `tests/unit/components/discover/*.test.tsx` | Unit | N/A (new) | ✅ Written first | ✅ `pnpm test` | ✅ rendering + interaction + state coverage | ✅ component extraction |
| 4.1–4.4 | `tests/integration/discover-home-page.test.tsx` | Integration | ✅ 2/2 baseline before modifying app files | ✅ Written first | ✅ `pnpm test` + build | ✅ search + category filtering | ✅ route/providers/layout isolated |
| 5.1–5.5 | `tests/e2e/discover-home.spec.ts`, `tests/e2e/home.spec.ts` | E2E | Existing `home.spec.ts` read and updated | ✅ Written first | ✅ `pnpm test:e2e` | ✅ Spanish, English, empty, error/retry, keyboard order | ✅ Playwright config/base URL + focus-order fixes |
| Verify blockers | `tests/e2e/discover-home.spec.ts`, `tests/integration/use-public-recipes.test.tsx`, `tests/unit/components/discover/locale-switch.test.tsx` | Unit + Integration + E2E | ✅ Targeted baseline: 5/5 Vitest checks passing before new tests; E2E blocker reproduced from verify report | ✅ New blocker tests written first | ✅ `pnpm test` + `pnpm test:e2e` | ✅ mobile/desktop, metadata, full keyboard order, aria-live, stale-time | ✅ semantic locale labels + recipe grid region |
| Loading verify blocker | `tests/integration/discover-home-page.test.tsx` | Integration | ✅ Targeted baseline: 1/1 integration test passing before new coverage | ✅ Pending-fetch runtime test added first | ✅ `pnpm exec vitest run tests/integration/discover-home-page.test.tsx` | ✅ Loading skeleton visible before MSW resolves; recipe card absent until data resolves | ➖ Test-only change; implementation already correct |

## Test Summary

- **Total tests written/updated**: 29 new Vitest tests + 10 Playwright tests updated/added.
- **Passing verified tests**: 31/31 Vitest tests pass; 10/10 Playwright tests pass.
- **Layers used**: Unit, Integration/MSW, E2E.
- **Approval tests**: None — no behavior-preserving refactor task.
- **Pure functions created**: `translate`, `mapPublicRecipe`, `mapPublicRecipes`, `fetchPublicRecipes`.

## Verification Commands

- ✅ `pnpm exec vitest run tests/integration/discover-home-page.test.tsx` — 2/2 tests passed.
- ✅ `pnpm test` — 14 files, 31 tests passed.
- ✅ `pnpm lint` — passed.
- ✅ `pnpm exec tsc --noEmit` — passed.
- ✅ `pnpm build` — passed.
- ✅ `pnpm test:e2e` — 10/10 Playwright tests passed.

## Deviations

None for implemented phases. The `apiClient` was adjusted with an explicit delegating `fetch` option so MSW can intercept OpenAPI client requests under Vitest while production still uses `apiClient.GET('/recipes/public')`. The app QueryClient disables automatic retries so the spec-required error state is available immediately and retry remains user-driven. The locale switch is visually fixed but placed after page content in DOM order so keyboard focus follows search → pills → cards/nav before locale controls. Verify-blocker fixes preserved scope and added semantic locale button names plus a labeled recipe-grid region to support unambiguous runtime assertions. The final loading blocker was resolved with test-only page-level pending-fetch coverage; no implementation change was required.

## Workload / PR Boundary

- Mode: single PR / single implementation unit.
- Boundary: Discover Home i18n slice only.
- Review budget: within approved 2000 changed-line budget; chained PRs not recommended.
