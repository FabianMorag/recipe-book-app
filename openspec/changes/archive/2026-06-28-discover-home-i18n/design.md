# Design: Discover Home i18n

## Technical Approach

Replace the starter root page with a Discover Home client island backed by TanStack Query and the existing `openapi-fetch` client. Keep scope to Discover Home: `app/page.tsx` remains the route entry, `app/providers.tsx` composes app providers, and no locale-prefixed routing is introduced. Product copy uses a complete typed Spanish/English dictionary, Spanish default HTML/metadata, and a defensive runtime fallback to Spanish for missing English keys.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| i18n scope | Custom `I18nProvider` + `useTranslations()` in `lib/i18n/` | `next-intl`, locale routes | Specs exclude full routing; a typed local dictionary is enough and migration-friendly. |
| Dictionary safety | Production dictionaries use `satisfies Record<Locale, Record<TranslationKey, string>>`; `t(key)` resolves `dictionary[locale]?.[key] ?? dictionary.es[key]` | Make English partial in production | Reconciles compile-time completeness with graceful runtime degradation required by `product-i18n`. |
| Locale switching | Discover-only accessible ES/EN control backed by provider state | URL locale segments, hidden test hook only | Playwright needs a real switch path; provider state updates copy and `document.documentElement.lang` without routing scope creep. |
| Data boundary | `lib/api/public-recipes.ts` maps DTOs to view models; `use-public-recipes.ts` owns `useQuery` | Mapping in components/tests | Keeps mocked author/image/category metadata isolated. |
| Rendering/styling | Server route delegates to client `DiscoverHome`; use daisyUI + mobile-first Tailwind | RSC fetch, CSS-heavy layout | Existing TanStack setup covers loading/retry specs; daisyUI matches project theme with less custom CSS. |

## Data Flow

```text
app/layout.tsx(lang=es) -> Providers -> I18nProvider(locale, setLocale)
                                     -> QueryClientProvider
app/page.tsx -> DiscoverHome -> usePublicRecipes() -> apiClient.GET('/recipes/public')
                          |        -> mapPublicRecipe() + private mock metadata
                          -> search/category state -> RecipeGrid -> RecipeCard
                          -> LocaleSwitch -> setLocale('en'|'es') -> t(key) + html lang
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/layout.tsx` | Modify | Set `lang="es"`, Spanish title/description, `openGraph.locale = "es"`, keep providers near `<body>`. |
| `app/providers.tsx` | Modify | Wrap existing stable `QueryClientProvider` with `I18nProvider`. |
| `app/page.tsx` | Modify | Replace starter screen with Discover Home only. |
| `components/discover/*.tsx` | Create | Header, locale switch, search/filter controls, cards/grid, bottom dock, loading/error/empty states. |
| `lib/i18n/dictionaries.ts` | Create | Complete typed `es` and `en` dictionaries plus `Locale`/`TranslationKey`. |
| `lib/i18n/provider.tsx` | Create | Client context, `initialLocale="es"`, `setLocale`, `t(key)` fallback, html `lang` sync. |
| `lib/api/public-recipes.ts` | Create | Fetch and map public recipes with private mock metadata constants. |
| `lib/api/use-public-recipes.ts` | Create | `useQuery({ queryKey: ["public-recipes"], queryFn })`, exposes `refetch`. |
| `tests/helpers/i18n.tsx` | Create | Test-only partial dictionary/translator fixture for fallback tests; not imported by production. |
| `tests/unit`, `tests/integration`, `tests/e2e` | Create/Modify | Strict TDD coverage. |

## Interfaces / Contracts

```ts
type Locale = "es" | "en";
type TranslationKey = keyof typeof es;
type CompleteDictionaries = Record<Locale, Record<TranslationKey, string>>;
type TestRuntimeDictionary = { es: Record<TranslationKey, string>; en?: Partial<Record<TranslationKey, string>> };
```

Production dictionaries MUST be complete. The translator MUST still tolerate runtime gaps: `dictionary[locale]?.[key] ?? dictionary.es[key]`. The test helper may pass a partial English `TestRuntimeDictionary` to simulate the missing-English scenario; production provider uses only the complete exported dictionaries.

`PublicRecipeCard = RecipeListItemDto & { image: { src: string; alt: string }; author: { name: string; avatarInitials: string }; category: string }`. Components consume mapped view models, never mock constants.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | dictionary completeness, fallback translator, provider/hook, locale switch, mapper, filters/states | Vitest + Testing Library; `expectTypeOf`/compile-time shape checks where useful; partial dictionaries only through `tests/helpers/i18n.tsx`. |
| Integration | `usePublicRecipes()` success/empty/error/timeout | MSW returns backend-shaped DTOs; per-test `QueryClient` with `retry:false`. |
| E2E | Spanish default, ES/EN switch, mobile/desktop, empty/error/retry, keyboard order | Playwright `page.route("**/recipes/public")`, role locators, assert `document.documentElement.lang`. |

## Styling and Accessibility

Use stacked mobile layout below `md`, centered `max-w-6xl` grid at `lg`, and `pb-24` to clear the fixed dock. Search has `aria-label="Buscar recetas"`; category controls are native buttons with `aria-pressed`; locale switch has a clear accessible name and 24px+ targets; result count uses `aria-live="polite"`; errors use `role="alert"`; focus rings use `focus-visible:outline-2 outline-offset-2`; recipe image alt text is localized.

## Migration / Rollout

No data migration required. Roll out at `/` only; Create and Mine stay placeholders/disabled.

## Open Questions

None.
