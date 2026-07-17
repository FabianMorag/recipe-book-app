# Proposal: Discover Home i18n

## Intent

Ship the first real frontend slice: a responsive Discover Home that matches the OpenPencil direction, defaults product UI copy to Spanish, supports English as a secondary locale, and uses the current public recipes backend without hiding future metadata gaps.

## Scope

### In Scope
- Responsive Discover Home UI: header, search, category pills, recipe cards, and bottom navigation placeholders.
- Lightweight i18n foundation with Spanish default, English fallback, translated UI copy, and `lang="es"` by default.
- Public recipes adapter using `GET /recipes/public`, with mocked image/author/category metadata isolated behind a mapper.
- Strict TDD coverage: unit, integration/MSW, and Playwright smoke checks.

### Out of Scope
- Recipe Detail, Create Recipe, and My Recipes pages beyond placeholder nav labels/actions.
- Backend changes for categories, authors, images, or server-side filtering.
- Locale-prefixed routing or a full `next-intl` migration.

## Capabilities

### New Capabilities
- `discover-home`: Responsive public recipe discovery experience, including search/filter UI, cards, bottom nav placeholders, accessibility, and empty/loading/error states.
- `product-i18n`: Spanish-default and English-secondary product copy infrastructure for this slice.
- `public-recipe-data`: Fetching and mapping public recipe summaries while isolating mocked/future metadata.

### Modified Capabilities
- None.

## Approach

Use a mobile-first component composition under `components/discover/`, daisyUI primitives (`dock`, `input`, `card`, `badge`, `avatar`, `btn`/`filter`) plus Tailwind v4 utilities and the existing `recipebook` theme. Add a minimal typed dictionary provider/hook in `lib/i18n/`. Fetch through a dedicated `lib/api/recipes.ts` mapper so backend catch-up replaces mocks in one place.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/page.tsx` | Modified | Replace starter page with Discover Home composer. |
| `app/layout.tsx`, `app/providers.tsx` | Modified | Add Spanish lang/metadata and i18n provider. |
| `lib/i18n/` | New | Dictionaries, provider, translation hook. |
| `lib/api/recipes.ts` | New | Public recipe fetcher and view-model mapper. |
| `components/discover/` | New | Tested UI components for the slice. |
| `tests/unit`, `tests/integration`, `tests/e2e` | New | TDD proof for components, API mapping, and page behavior. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mock metadata leaks into domain assumptions | Med | Keep mocks named and localized to mapper tests. |
| i18n grows beyond simple dictionary needs | Med | Keep dictionary shape typed and migration-friendly. |
| Scope creep into adjacent pages | Med | Bottom nav remains placeholder-only in this change. |

## Rollback Plan

Revert this change folder and implementation files for `app/page.tsx`, i18n, recipe mapper, discover components, and related tests; restore the prior starter page if needed.

## Dependencies

- Existing Next.js 16, daisyUI 5, Tailwind v4, TanStack Query, OpenAPI client, Vitest/MSW/Playwright setup.

## Success Criteria

- [ ] Discover Home renders responsively in Spanish by default with English copy available.
- [ ] Public recipes load through the current backend contract; future metadata is isolated.
- [ ] Strict TDD evidence exists across unit, integration, and e2e layers.
