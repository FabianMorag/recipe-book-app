# Exploration: discover-home-i18n

## Current State

The project is a fresh Next.js 16 app-router frontend (`app/`) bootstrapped with daisyUI 5, Tailwind CSS v4, TanStack Query 5, openapi-fetch, Vitest, Testing Library, MSW, and Playwright. A custom warm/pastel daisyUI theme named `recipebook` is already configured in `app/globals.css` and aligns with the OpenPencil Discover Home direction captured in prior Engram context.

The current `app/page.tsx` is still the create-next-app starter landing page. The typed API client (`lib/api/client.ts`) and OpenAPI schema (`lib/api/schema.ts`) are wired to the backend, but the public recipes endpoint (`GET /recipes/public`) currently returns only `id`, `title`, `description`, `status`, and `createdAt`. No i18n library or locale infrastructure exists yet.

`openspec/config.yaml` enforces `strict_tdd: true` and defines Spanish as the default product UI locale with English as secondary.

## Affected Areas

- `app/page.tsx` — replace starter landing page with the Discover Home slice.
- `app/layout.tsx` — set `lang="es"`, integrate i18n provider, update metadata.
- `app/providers.tsx` — add i18n provider around QueryClientProvider.
- `lib/i18n/` (new) — dictionary, context/provider, `useTranslations` hook, `es` default + `en` fallback.
- `lib/api/recipes.ts` (new) — public-recipe fetcher/mapper; isolates mocked `image`, `author`, and `category` fields.
- `components/discover/` (new) — reusable, tested UI pieces:
  - `DiscoverHeader`
  - `SearchInput`
  - `CategoryFilter` (pills)
  - `RecipeCard` (featured + compact variants)
  - `BottomNav`
  - `DiscoverView` (page-level composer)
- `tests/unit/discover/` (new) — component unit tests (strict TDD).
- `tests/integration/recipes.test.ts` (new) — MSW-backed public-recipes fetch tests.
- `tests/e2e/discover.spec.ts` (new) — Playwright page-level checks.

## Approaches

### 1. i18n via `next-intl` + middleware

- **Description**: Install `next-intl`, configure locale routing/middleware, place message files under `messages/`, and use `useTranslations`/`NextIntlClientProvider`.
- **Pros**: App-router standard, URL locale support, ICU formatting/pluralization, future-proof.
- **Cons**: Extra dependency and middleware setup; increases TDD surface (locale switching, routing tests); overkill for a single-slice MVP where only Spanish is required now.
- **Effort**: Medium-High.

### 2. i18n via lightweight dictionary context/hook

- **Description**: A React context with an `es` dictionary and a typed `useTranslations` hook. Locale state lives in the provider; `en` can be loaded lazily or inlined for the secondary locale.
- **Pros**: No new dependencies, trivial to test in isolation, fast to implement under strict TDD, default Spanish is straightforward.
- **Cons**: No URL-based locale switching, no ICU helpers, must manually handle locale toggle/state persistence.
- **Effort**: Low-Medium.

### 3. Client-side data fetching for recipes

- **Description**: A `usePublicRecipes` TanStack Query hook fetches `/recipes/public`, applies a client-side search/category filter, and maps backend items to view models with mocked `image`, `author`, and `category`.
- **Pros**: Reuses existing TanStack Query setup, keeps the page interactive, easy to test with MSW.
- **Cons**: Search/category filtering is local-only until backend supports them; mocks must be clearly isolated.
- **Effort**: Medium.

## Recommendation

Proceed with **Approach 2 (custom dictionary context)** for i18n to keep the first slice focused and testable, with a documented migration path to `next-intl` once multi-locale routing becomes a requirement. Use **Approach 3 (TanStack Query + mocked view models)** for recipes, isolating mocks in `lib/api/recipes.ts` so backend catch-up only requires updating the mapper.

Use daisyUI primitives throughout: `dock` for bottom navigation, `badge` for the PUBLIC label, `input` for search, `card`/`figure` for recipe cards, `avatar` for author thumbnails, and `btn`/`filter` for category pills. Keep the page mobile-first and constrain desktop layout with `max-w-3xl mx-auto` or a centered grid, preserving the warm `recipebook` theme.

## Risks

- Backend does not yet support images, authors, or categories; mocked fields must be clearly marked and easy to replace.
- The lightweight i18n approach may need a later migration to `next-intl`; design the dictionary shape so migration is mechanical.
- Scope can creep into Create/Mine views if the bottom-nav items are wired to real routes; implement them as placeholders or disabled actions for this slice.
- Strict TDD will slow the first slice but reduces regression risk; budget extra time for red-green-refactor cycles.

## Ready for Proposal

Yes. The next phase should produce a change proposal that locks the slice boundary: responsive Discover Home in Spanish, mocked recipe metadata, reusable components, and a lightweight i18n context, explicitly excluding Create/Mine detail pages and backend category/search persistence.
