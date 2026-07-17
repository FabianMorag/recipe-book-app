# Apply Progress: recipe-detail-i18n

**Change**: recipe-detail-i18n
**Project**: recipe-book-app
**Artifact store**: openspec (progress mirrored to Engram topic `sdd/recipe-detail-i18n/apply-progress`)
**Mode**: Strict TDD (RED -> GREEN -> TRIANGULATE -> REFACTOR)
**Delivery**: single PR, `size:exception` accepted (review budget 2000 lines)
**Status**: all 15 implementation tasks complete + 3 verify blockers resolved; all verification gates green.

## Completed Tasks (15/15)

Phase 1 — Data & i18n:
- [x] 1.1 `PublicRecipeDetail` type, `MOCK_DETAIL_*` constants, `mapPublicRecipeDetail()` (calls `mapPublicRecipe` first; real fields win via `??`)
- [x] 1.2 `usePublicRecipeDetail(id)` via TanStack `select` on shared `/recipes/public` cache; `null` when not found
- [x] 1.3 `recipeDetail.*` keys (13) in es (default, neutral Chilean) + en

Phase 2 — Route & Components:
- [x] 2.1 `app/recipes/[id]/page.tsx` async Server Component (Next 16 `Promise` params)
- [x] 2.2 `recipe-detail-page.tsx` client composition + loading/error/not-found
- [x] 2.3 `detail-actions.tsx` (Back/Save, 44px, focus-visible)
- [x] 2.4 `hero-image.tsx` (next/image unoptimized, alt=title)
- [x] 2.5 `recipe-meta.tsx` (shared badge, author, title, tags)
- [x] 2.6 `ingredient-list.tsx` (semantic ul + servings)
- [x] 2.7 `step-cards.tsx` (numbered ol cards)
- [x] 2.8 `ai-hint-card.tsx` (accent border, aria-label, i18n text)

Phase 3 — Essential Testing:
- [x] 3.1 mapper test (fields + real-field precedence)
- [x] 3.2 dictionaries test (key parity es/en + fallback)
- [x] 3.3 page component test (all sections + states)
- [x] 3.4 route integration test (MSW + async params)

## Verification Blocker Fix (batch 2)

Three verify blockers were raised despite all gates passing. Resolved as follows
without expanding scope beyond Recipe Detail and without broad e2e:

### Blocker 1 — Responsive mobile/desktop behavior not runtime-proven
- Added `tests/unit/components/recipe-detail/recipe-detail-layout.test.tsx`.
- Behavioral (jsdom-verifiable): sections render in the spec-required stacked
  order, verified via `compareDocumentPosition` (actions -> image -> status ->
  author -> title -> tags -> ingredients -> steps -> AI hint).
- Class-contract (jsdom cannot measure geometry, so the spec-mandated contract
  is asserted): container carries `max-w-3xl` (desktop max-width) + `mx-auto`
  (horizontal centering) + `flex-col` (vertical stacking on every viewport);
  interactive controls carry `min-h-11` / `min-w-11` (44px, above the 24px
  WCAG 2.5.8 minimum).
- Browser e2e judged NOT required: the responsive requirement is itself a CSS
  class contract and jsdom asserts that contract directly; a real browser would
  only add pixel measurement, not change the verdict.

### Blocker 2 — Keyboard Tab order + focus behavior not runtime-proven
- Added `tests/unit/components/recipe-detail/recipe-detail-keyboard.test.tsx`.
- Behavioral (jsdom-verifiable via `userEvent.tab()` + `document.activeElement`):
  focus moves Back -> Save in document order; both buttons are focusable
  (not disabled).
- Class-contract (jsdom cannot render the outline): every actionable control
  carries `focus-visible:outline-2` (+ `outline-primary`), the contract that
  produces the visible focus indicator. Tab reachability itself is proven
  behaviorally; outline visibility is the CSS contract + manual a11y checklist.

### Blocker 3 — `apply-progress.md` missing from OpenSpec
- This file is the restore: built from the Engram apply-progress content
  (obs #177) merged with this blocker-fix batch. Engram topic upserted to match.

## TDD Cycle Evidence

| Tasks | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|-------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1+3.1 | tests/unit/api/public-recipes.test.ts | Unit | 3/3 pre | Written | Passed | 3 cases | Clean |
| 1.2 | tests/integration/use-public-recipes.test.tsx | Integration | 5/5 pre | Written | Passed | 2 cases | select+useCallback |
| 1.3+3.2 | tests/unit/i18n/dictionaries.test.ts | Unit | 2/2 pre | Written | Passed | 3 cases | Clean |
| 2.1+3.4 | tests/integration/recipe-detail-page.test.tsx | Integration | N/A new | Written | Passed | Single | None |
| 2.2+3.3 | tests/unit/components/recipe-detail/recipe-detail-page.test.tsx | Component | N/A new | Written | Passed | 3 cases | Clean |
| 2.3 | .../detail-actions.test.tsx | Component | N/A new | Written | Passed | Single | None |
| 2.4 | .../hero-image.test.tsx | Component | N/A new | Written | Passed | Single | None |
| 2.5 | .../recipe-meta.test.tsx | Component | N/A new | Written | Passed | Single | None |
| 2.6 | .../ingredient-list.test.tsx | Component | N/A new | Written | Passed | Single | None |
| 2.7 | .../step-cards.test.tsx | Component | N/A new | Written | Passed | Single | None |
| 2.8 | .../ai-hint-card.test.tsx | Component | N/A new | Written | Passed | Single | None |
| Blocker 1 | .../recipe-detail-layout.test.tsx | Component | 49/49 pre | Approval | Passed | 3 cases | None |
| Blocker 2 | .../recipe-detail-keyboard.test.tsx | Component | 49/49 pre | Approval | Passed | 2 cases | None |

Notes on the blocker-fix rows:
- RED = "Approval" (characterization): the responsive/keyboard behavior was
  already implemented in batch 1, so these tests capture existing behavior and
  pass on first run (strict-tdd's sanctioned approval-testing path for existing
  code). They are non-trivial: removing `max-w-3xl`, a button, or the
  focus-visible contract breaks them.
- A documented, user-authorized exception to strict-tdd's "no CSS-class
  assertions" rule is used ONLY for purely-visual CSS that jsdom cannot render
  (max-width centering, pixel target sizes, focus outline). All jsdom-verifiable
  behavior (section order, Tab order, focusability, presence) is asserted
  behaviorally.

## Test Summary
- Total tests in suite: 54 (was 31 pre-change; +18 batch 1; +5 batch 2)
- Total passing: 54/54 (24 files)
- Layers: Unit (mapper, dictionaries, 6 presentational, page, layout, keyboard), Integration (hook, route)
- Approval tests (refactor/characterization): existing use-public-recipes + dictionaries tests (batch 1 select refactor); layout + keyboard tests (batch 2 existing behavior)
- Pure functions: mapPublicRecipeDetail (new), translate (existing)
- No e2e added (per slice strategy; browser e2e judged unnecessary for responsive/keyboard contract).

## Files Changed
- lib/api/public-recipes.ts | Modified | +PublicRecipeDetail, MOCK_DETAIL_*, mapPublicRecipeDetail
- lib/api/use-public-recipes.ts | Modified | cache raw DTOs; select to cards; +usePublicRecipeDetail
- lib/i18n/dictionaries.ts | Modified | +13 recipeDetail.* keys (es+en)
- app/recipes/[id]/page.tsx | Created | async dynamic route wrapper
- components/recipe-detail/*.tsx (8) | Created | page + 7 presentational sections
- tests/helpers/recipe-detail.ts | Created | shared mockRecipeDetail fixture
- tests/unit/components/recipe-detail/*.test.tsx (9) | Created | per-component + page + layout + keyboard tests
- tests/integration/recipe-detail-page.test.tsx | Created | route + MSW
- tests/unit/api/public-recipes.test.ts | Modified | +mapPublicRecipeDetail cases
- tests/unit/i18n/dictionaries.test.ts | Modified | +recipeDetail key parity/fallback
- tests/integration/use-public-recipes.test.tsx | Modified | +usePublicRecipeDetail cases
- openspec/changes/recipe-detail-i18n/tasks.md | Modified | all 15 tasks [x]
- openspec/changes/recipe-detail-i18n/apply-progress.md | Created (batch 2) | this file (blocker 3 restore)

## Deviations from Design
1. Title heading h1 (design said h2): used h1 for the recipe title as the page's single main heading (WCAG heading hierarchy; consistent with Discover Home h1). Section headings remain h2. Justified a11y improvement.
2. Hook data flow (design-conformance, not deviation): design required both "mapPublicRecipeDetail calls mapPublicRecipe first" AND "select from cached data via find()". Implemented by caching raw DTOs (fetchPublicRecipes returns raw) and mapping via TanStack select per observer, so the detail mapper receives a raw DTO (calls mapPublicRecipe first, no summary-field overwrite) while sharing the /recipes/public cache. Behavior-preserving (existing tests green).
3. aiHint data field: view model includes aiHint (mock string, per interface contract) but the AI hint card renders the locale-aware recipeDetail.aiHint.text i18n key (a single string field cannot be both es/en). aiHint field preserved for future recipe-specific AI text.
4. Back/Save icons: accessible glyph buttons matching the existing bottom-nav convention; lucide-react is a dependency but unused project-wide, so not introduced to stay consistent.
5. Class-contract assertions (batch 2): strict-tdd normally forbids CSS-class assertions, but a documented, user-authorized exception is used for purely-visual CSS that jsdom cannot render (responsive geometry, target sizes, focus outline). Behavioral assertions are preferred wherever jsdom can verify (section order, Tab order, focusability).

## Issues Found
- (batch 1) Initial usePublicRecipeDetail test failed (data null): the new describe block lacked MSW lifecycle hooks; the prior describe's afterAll had closed the server. Fixed the test harness (implementation correct). Gotcha: every describe using setupServer() needs its own beforeAll/afterEach/afterAll.
- (batch 2) Initial layout order test failed on `getByText(/María/)`: the MSW -> mapper flow produces the mock author constant "Cocina Pública", not the "María" from the standalone fixture. Fixed the assertion to match the real mapped author (implementation correct).

## Verification (after blocker fix)
- pnpm test: 54/54 passed (24 files)
- pnpm lint: 0 errors, 0 warnings
- pnpm exec tsc --noEmit: clean
- pnpm build: compiled; route f /recipes/[id] generated

## Workload / PR Boundary
- Mode: single PR (size:exception accepted, 2000-line budget)
- Changed lines: batch 1 ~724; batch 2 ~190 (2 test files ~170 + this apply-progress.md). Cumulative well within budget.
- Boundary: full Recipe Detail slice (data + i18n + route + 8 components + tests) + verify-blocker runtime coverage. Autonomous, verified; rollback = delete app/recipes, components/recipe-detail, revert mapper/hook/dict additions + remove new tests.

## Remaining Tasks
None. All 15 implementation tasks [x]; all 3 verify blockers resolved; all gates green. Ready for sdd-verify.
