# Design: Create Recipe i18n

## Technical Approach

Add `app/recipes/new/page.tsx` as a Server Component route shell that renders a focused client island, `CreateRecipeForm`, matching the existing App Router pattern used by `app/page.tsx` and `app/recipes/[id]/page.tsx`. The form uses React Hook Form + a module-level Zod schema, extends `lib/i18n/dictionaries.ts` with typed `createRecipe.*` keys, and submits through a small `lib/api/create-recipe.ts` adapter that posts only `CreateRecipeDto` fields to `POST /recipes`. Successful submit stays on the form and shows an in-form confirmation so local-only/future fields remain visible.

## Architecture Decisions

| Decision | Options considered | Choice / Rationale |
|---|---|---|
| Route boundary | All-client page vs Server Component shell + client form | Use server shell + client form to follow existing route entries while containing RHF/TanStack mutation state in one client island. |
| Submit boundary | Submit full form vs map backend DTO | Export `toCreateRecipePayload(form)` returning only `title`, `description`, `status`; this prevents local placeholder fields leaking into the API. |
| Local future fields | Mock API fields vs isolated form state | Keep `tags`, `ingredients`, `steps`, and AI helper in `components/create-recipe/schema.ts`; visible notice says they are not saved yet. |
| Success behavior | Navigate after create vs in-form confirmation | No automatic navigation in this slice; show a success alert/state inside `CreateRecipeForm` and preserve field arrays so local-only values stay visible after mutation success. |
| i18n | Inline strings vs dictionary keys | Extend typed dictionaries so Spanish remains default and English secondary/fallback keeps current provider behavior. |
| Tests | Broad e2e vs essential Vitest | Unit/integration only: schema, mapper, i18n keys, submit behavior. Strict TDD still applies; e2e stays out by default. |

## Data Flow

```text
/recipes/new page
  -> CreateRecipeForm (RHF + zodResolver, defaultValues, mode:onSubmit)
      -> local arrays stay in form state
      -> toCreateRecipePayload()
          -> apiClient.POST('/recipes')
              -> on success: set in-form success state; no route change
                  -> tags/ingredients/steps remain visible in current form state
```

## File Changes

| File | Action | Description |
|---|---|---|
| `app/recipes/new/page.tsx` | Create | Route entry rendering Create form. |
| `components/create-recipe/create-recipe-form.tsx` | Create | Client RHF form, responsive daisyUI/Tailwind layout, validation errors, submit mutation. |
| `components/create-recipe/schema.ts` | Create | Module-level Zod schema, default values, inferred types, local field shapes. |
| `components/create-recipe/submit-boundary.ts` | Create | DTO mapper excluding tags/ingredients/steps/AI fields. |
| `components/create-recipe/api-gaps.md` | Create | Backend/API gap list artifact. |
| `lib/api/create-recipe.ts` | Create | `apiClient.POST('/recipes')` wrapper typed from `CreateRecipeDto` / `RecipeResponseDto`. |
| `lib/i18n/dictionaries.ts` | Modify | Add `createRecipe.*` keys in `es` and `en`. |
| `components/discover/bottom-nav.tsx` | Modify | Allow Create button/link active state for `/recipes/new` without breaking Discover. |
| `tests/unit/**`, `tests/integration/**` | Create/Modify | Essential schema, mapper, i18n, form/mutation tests. |

## Interfaces / Contracts

```ts
type CreateRecipeFormValues = {
  title: string;
  description?: string;
  status: "DRAFT" | "PRIVATE" | "PUBLIC";
  tags: { value: string }[];
  ingredients: { value: string }[];
  steps: { value: string }[];
  aiHelperEnabled: boolean;
};

type CreateRecipePayload = components["schemas"]["CreateRecipeDto"];
```

The Zod schema owns neutral Chilean Spanish error messages, including `El título es obligatorio`. RHF uses `zodResolver(createRecipeSchema)`, `defaultValues`, `mode: "onSubmit"`, `reValidateMode: "onBlur"`, and `useFieldArray` with `field.id` keys.

## UI / Accessibility

Use daisyUI `card`, `input`, `textarea`, `select`, `btn`, `alert`, `badge`, and `dock`, with Tailwind mobile-first spacing: stacked on mobile, centered `max-w-3xl` on desktop. Use semantic `main`, `form`, `section`, labels, `aria-invalid`, `aria-describedby`, field errors with `role="alert"`, logical tab order, `focus-visible:outline-2 focus-visible:outline-primary`, and minimum 24px touch targets.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Zod valid/invalid status/title; DTO mapper excludes local fields; dictionary keys resolve | Vitest `safeParse`, object key assertions, `translate()`. |
| Integration | Form renders Spanish labels; empty title error; successful submit posts only DTO and keeps local fields visible with success confirmation | Testing Library + MSW for `POST ${API_BASE_URL}/recipes`. |
| E2E | Not default | Add only if later routing/browser risk appears. |

## Backend/API Gap List

Create `components/create-recipe/api-gaps.md` listing missing persistence for tags, ingredients with units, ordered steps, image upload, servings, AI metadata, and status transitions; each item includes impact.

## Migration / Rollout

No data migration required. Route is additive; rollback removes new route/components/API helper/dictionary keys/tests. Future navigation to `/recipes/{id}` can be reconsidered after the backend persists the full recipe model, including tags, ingredients, steps, and related metadata.

## Open Questions

- [ ] Confirm future backend contract for persisting tags, ingredients, steps, and metadata before adding post-submit navigation.
