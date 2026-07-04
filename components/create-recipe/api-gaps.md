# Create Recipe — Backend/API Gap List

This artifact tracks backend capabilities not yet available for Create Recipe.
The first slice submits only the fields `POST /recipes` supports today
(`title`, `description`, `status`). The following fields are frontend-local
placeholders and are **not persisted** in this slice. Each gap lists its
description and impact to guide future backend catch-up and post-submit
navigation work.

| # | Gap | Description | Impact |
|---|-----|-------------|--------|
| 1 | Tags persistence | `tags` array stays in client form state; `CreateRecipeDto` has no `tags` field. | Users cannot label recipes for search/filtering across sessions. |
| 2 | Ingredients with units | `ingredients` are free-text rows; backend has no ingredient model (name, quantity, unit). | No structured shopping list, scaling, or validation on units. |
| 3 | Ordered steps | `steps` are local text rows; backend stores no ordered step list. | Users lose preparation order across sessions; no reusable step rendering. |
| 4 | Image upload | No image upload endpoint or media storage contract. | Users cannot add recipe photos; cards fall back to placeholder imagery. |
| 5 | Servings | `servings` is not part of `CreateRecipeDto`. | Cannot display yield/scale on cards or detail pages reliably. |
| 6 | AI metadata | `aiHelperEnabled` is visual/context only; no AI generation endpoint or prompt metadata. | AI helper is a non-functional placeholder; no persisted suggestions. |
| 7 | Status transitions | `POST /recipes` accepts `DRAFT / PRIVATE / PUBLIC` on create, but there is no documented `PATCH /recipes/:id` for state transitions (publish, unpublish, archive). | Users cannot change visibility after creation; status is write-once. |
| 8 | Post-create navigation | Backend returns `RecipeResponseDto`, but the full recipe model (tags/ingredients/steps) is not persisted, so `/recipes/:id` cannot render a complete draft yet. | This slice intentionally shows an in-form success confirmation and does not auto-navigate. Revisit navigation once gaps 1–3 are closed. |

## Notes for future planning

- Close gaps 1–3 before enabling post-submit navigation to `/recipes/:id`.
- Treat the `submit-boundary.ts` mapper as the single source of truth for the
  DTO boundary; extend it (and `CreateRecipeDto`) as the backend adds fields.
- The AI helper must remain visual/context only until gap 6 ships a real
  generation endpoint.