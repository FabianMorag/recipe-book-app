# Proposal: Recipe Detail i18n

## Intent

Add a focused Recipe Detail slice so users can open a shared recipe and understand its image, status, author, ingredients, steps, and future AI guidance in Spanish-first UI. This closes the current gap where Discover cards exist but no detail experience is defined.

## Scope

### In Scope
- Recipe Detail page/slice only, based on the provided screenshot/design.
- Mobile-first layout: back/save actions, large image, shared status, author, title, tags, ingredients, steps, and AI hint card.
- Neutral Chilean Spanish default copy with English secondary copy.
- Isolated future/mock detail data mapper/module for ingredients, steps, tags, image, and author while backend fields are missing.
- Essential unit/component/integration tests only; no broad e2e by default.

### Out of Scope
- Create Recipe flow.
- Backend/API contract changes.
- Full authentication, ownership, or saved-recipes persistence.
- Broad Playwright e2e coverage unless a detail flow becomes risky.

## Capabilities

### New Capabilities
- `recipe-detail`: Responsive detail page behavior, accessible layout, status/author/title/tags, ingredients, steps, and AI hint card.

### Modified Capabilities
- `product-i18n`: Add Recipe Detail translation keys for Spanish default and English secondary locale.
- `public-recipe-data`: Extend isolated mapper/mock strategy to support detail-only fields until backend catch-up.

## Approach

Add a dynamic detail route and component set that reuses the existing i18n provider, daisyUI/Tailwind theme, and public recipe data patterns. Keep future backend fields behind a clearly named detail mapper/mock module so replacement is localized. Use semantic sections, accessible icon buttons, descriptive image alt text, and mobile-first centered desktop layout.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/recipes/[id]/page.tsx` | New | Detail route entry. |
| `components/recipe-detail/` | New | Detail UI sections/cards/actions. |
| `lib/api/` | Modified | Detail mapper/mock data and query helpers. |
| `lib/i18n/dictionaries.ts` | Modified | Spanish and English detail copy. |
| `tests/unit`, `tests/integration` | Modified | Essential coverage for mapper, copy, and detail rendering. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mock detail data leaks into components | Med | Keep mocks in mapper/module only; test boundaries. |
| Screenshot overfitting harms desktop | Low | Mobile-first, centered desktop max-width. |
| Copy inconsistency | Low | Add typed dictionary keys in both locales. |

## Rollback Plan

Remove the detail route, recipe-detail components, mapper additions, dictionary keys, and related tests. Existing Discover Home remains unaffected.

## Dependencies

- Existing Discover Home i18n/provider, daisyUI pastel theme, and public recipe mapper/query patterns.

## Success Criteria

- [ ] Spanish default and English secondary detail copy render through typed i18n.
- [ ] Detail page matches required mobile structure and remains usable on desktop.
- [ ] Mock/future fields are isolated from UI components.
- [ ] Essential unit/component/integration tests pass without broad e2e.
