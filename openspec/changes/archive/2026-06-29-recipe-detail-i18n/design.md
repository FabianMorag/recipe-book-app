# Design: Recipe Detail i18n

## Technical Approach

Add a focused dynamic route at `app/recipes/[id]/page.tsx` as a Server Component wrapper that awaits Next 16 async `params` and passes `id` into a Recipe Detail client island. Keep Create out of scope. The client island reuses the existing `I18nProvider`, `useTranslations()`, TanStack Query public recipes flow, daisyUI `recipebook` theme, and the isolated mapper seam in `lib/api/public-recipes.ts`.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Server detail fetch vs client island | Server fetch would need a new API path/timeout pattern; client keeps current app data conventions. | Use a small server route wrapper + client detail component. |
| New mapper file vs existing mapper module | New file separates detail logic; spec requires same isolated mocked-field module as summary mocks. | Extend `lib/api/public-recipes.ts` with detail types/mappers. |
| Broad e2e vs focused Vitest | E2E costs more and this slice has no risky flow/persistence. | Omit Playwright; use unit/component/integration tests only. |

## Data Flow

```text
/recipes/[id] page ──id──> RecipeDetailPage(client)
  └─ awaits params          └─ usePublicRecipeDetail(id)
                              └─ /recipes/public via existing client
                                  └─ mapPublicRecipeDetail(dto, index)
                                      └─ RecipeDetailViewModel
```

Missing backend fields are added only in the mapper. Future real fields win over mocked values.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/recipes/[id]/page.tsx` | Create | Dynamic route wrapper; awaits `params: Promise<{ id: string }>`; renders detail island; optional generic metadata only. |
| `components/recipe-detail/recipe-detail-page.tsx` | Create | Client composition for actions, image, meta, tags, ingredients, steps, AI hint, loading/error/not-found states. |
| `components/recipe-detail/*.tsx` | Create | Small presentational sections: actions, hero image, meta/tags, ingredient list, step cards, AI hint card. |
| `lib/api/public-recipes.ts` | Modify | Add `PublicRecipeDetail`, `mapPublicRecipeDetail()`, and clearly named mock/future field constants. |
| `lib/api/use-public-recipes.ts` | Modify | Add `usePublicRecipeDetail(id)` using existing query data/select logic. |
| `lib/i18n/dictionaries.ts` | Modify | Add `recipeDetail.*` keys in Spanish and English; preserve Spanish fallback behavior. |
| `tests/unit/api/public-recipes.test.ts` | Modify | Cover detail mapper fields and real-field precedence. |
| `tests/unit/components/recipe-detail/*.test.tsx` | Create | Component rendering, a11y labels, locale copy. |
| `tests/integration/recipe-detail-page.test.tsx` | Create | Route/page smoke with MSW public recipes; no Playwright. |

## Interfaces / Contracts

```ts
export type PublicRecipeDetail = PublicRecipeCard & {
  ingredients: string[];
  steps: string[];
  servings: number;
  tags: string[];
  shared: boolean;
  aiHint: string;
};
```

`mapPublicRecipeDetail(recipe, index)` MUST call `mapPublicRecipe()` first, then add detail-only fields without component-level mock imports.

## UI, i18n, and Accessibility

Use mobile-first Tailwind utilities: unprefixed stacked layout, `md:` refinements, `mx-auto w-full max-w-3xl px-4 py-4`. Use daisyUI semantic classes (`card`, `card-body`, `badge`, `btn`, `btn-circle`, `btn-ghost`) and theme tokens (`bg-base-*`, `text-base-content`, `badge-primary`, `border-accent`) rather than raw colors. Hero image uses `next/image`, `unoptimized` while remote Unsplash mocks remain, descriptive `alt={recipe.title}`, rounded pastel card treatment, and no dark-mode overrides.

Back and Save are placeholder buttons with `aria-label` from dictionaries, 44px comfortable targets, `focus-visible:outline-primary`, and visual order matching Tab order. Sections use semantic headings, ingredient list uses `<ul>`, steps use `<ol>`, AI card uses translated `aria-label`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Detail mapper and i18n key parity/fallback | Vitest assertions. |
| Component | Required sections, labels, Spanish/English copy | Testing Library + `I18nProvider`. |
| Integration | `/recipes/[id]` wrapper + MSW public recipe response | Render async page output with providers. |
| E2E | Omitted | Not needed for this slice; no Playwright unless later route smoke becomes unavoidable. |

## Migration / Rollout

No migration required. Rollback by deleting `app/recipes/[id]`, `components/recipe-detail/`, added dictionary keys/tests, and reverting mapper/hook additions. Existing Discover Home remains unchanged.

## Open Questions

None.
