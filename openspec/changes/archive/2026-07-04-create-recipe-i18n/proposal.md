# Proposal: Create Recipe i18n

## Intent

Add the first Create Recipe slice so users can draft a recipe from `/recipes/new` in Spanish by default, with English secondary copy. The slice must move fast: essential Vitest coverage only, no broad e2e by default, and no false promise that frontend-only fields are persisted.

## Scope

### In Scope
- Mobile-first Create Recipe page matching the supplied pastel daisyUI design direction.
- Form for title, description, visibility, and local-only tags/ingredients/steps/AI helper UI.
- Create mutation using current backend fields only: `title`, `description`, `status`.
- Typed i18n keys for Create Recipe Spanish/English copy.
- Backend/API gap list produced at the end of the slice.

### Out of Scope
- Real AI generation behavior.
- Persisting tags, ingredients, steps, images, servings, or AI metadata.
- Broad Playwright/e2e coverage unless later risk requires it.

## Capabilities

### New Capabilities
- `create-recipe`: `/recipes/new` form UX, frontend-local draft fields, create mutation boundaries, accessibility, and essential tests.

### Modified Capabilities
- `product-i18n`: add typed Spanish-default/English-secondary Create Recipe keys.

## Proposal question round

Assumptions needing review later: title is required; description maps from a general notes/description field; visibility maps Draft/Private/Public to `DRAFT`/`PRIVATE`/`PUBLIC`; local-only fields remain in form state after submit; successful save shows in-form confirmation only in this slice. Navigation to the created recipe can be a follow-up after the backend supports the full recipe model.

## Approach

Create a Server Component route shell at `app/recipes/new/page.tsx` and a focused client form island. Use React Hook Form with module-level Zod schema/resolver, default values, `mode: "onSubmit"`, and `useFieldArray` for local ingredients/steps. Add a small create API module around the generated OpenAPI client. Keep local-only fields in a clearly named mapper/adapter so backend catch-up is centralized.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/recipes/new/page.tsx` | New | Route entry for Create Recipe. |
| `components/create-recipe/*` | New | Responsive form sections and controls. |
| `lib/api/*` | Modified | Create mutation helper using `POST /recipes`. |
| `lib/i18n/dictionaries.ts` | Modified | Create Recipe translation keys. |
| `tests/unit`, `tests/integration` | Modified | Essential form, mapper, i18n, and mutation tests. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Users expect local fields to persist | Med | Label/code boundaries and final API gap list. |
| Form grows past review budget | Med | Componentize by section; avoid e2e unless needed. |

## Rollback Plan

Remove `/recipes/new`, create-recipe components/tests, create API helper, and dictionary keys. Existing Discover Home and Recipe Detail remain unchanged.

## Dependencies

- Current `POST /recipes` contract: `title`, `description`, `status` only.

## Success Criteria

- [ ] Spanish default and English secondary Create Recipe UI renders accessibly.
- [ ] Submit sends only supported backend fields.
- [ ] Tags/ingredients/steps/AI helper are isolated as frontend-local.
- [ ] Essential Vitest tests pass; no broad e2e added by default.
