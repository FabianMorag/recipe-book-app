# create-recipe Specification

## Purpose

Client-side Create Recipe form at `/recipes/new` allowing users to draft recipes with Spanish-default UI. Uses Zod + React Hook Form for validation. Submits only backend-supported fields (`title`, `description`, `status`). Tags, ingredients, steps, and AI helper state are frontend-local placeholders — not persisted.

## Requirements

### Requirement: Create Recipe Route and Responsive Layout

The system MUST serve the Create Recipe form at `/recipes/new`. The layout SHALL be mobile-first and responsive, matching the existing daisyUI pastel design direction.

#### Scenario: Mobile viewport renders stacked form

- GIVEN viewport width < 768px
- WHEN user navigates to `/recipes/new`
- THEN form fields, status selector, and submit button stack vertically
- AND bottom navigation is visible

#### Scenario: Desktop viewport renders centered form

- GIVEN viewport width ≥ 1024px
- WHEN user navigates to `/recipes/new`
- THEN form is centered with max-width constraint

### Requirement: Zod/RHF Form Validation

The system MUST validate input using a module-level Zod schema with `@hookform/resolvers`. `title` MUST be a required non-empty string; `description` SHALL be optional; `status` MUST be a `DRAFT | PRIVATE | PUBLIC` enum. Local fields (tags, ingredients, steps) SHALL accept array shapes without backend persistence constraints. The form SHALL use `mode: "onSubmit"`.

#### Scenario: Submit with empty title shows error

- GIVEN the form is rendered
- WHEN user submits with empty title
- THEN "El título es obligatorio" error displays on the title field
- AND `aria-invalid="true"` is set on the input

#### Scenario: Valid payload parses successfully

- GIVEN title: "Paella", description: "Traditional", status: "PUBLIC"
- WHEN the Zod schema parses the data
- THEN `safeParse` returns success with the input shape
- AND `status` only accepts `DRAFT`, `PRIVATE`, or `PUBLIC`

### Requirement: Submit Boundary — Backend Fields Only

The system MUST send only `title`, `description`, and `status` to `POST /recipes`. Tags, ingredients, steps, and AI helper state SHALL remain in form state and MUST NOT appear in the mutation payload. A visible boundary notice SHALL communicate this to users.

#### Scenario: Submit sends only supported fields

- GIVEN form includes title, status, tags, and ingredients
- WHEN submit triggers the create mutation
- THEN request body contains only `{ title, description, status }`
- AND local fields are excluded from the payload

#### Scenario: Local fields preserved in form state after submit

- GIVEN user fills tags and ingredients, then submits successfully
- WHEN the mutation completes
- THEN tags and ingredients remain visible in form state
- AND a boundary label indicates they are not yet persisted

### Requirement: Accessibility Compliance

All form controls MUST meet WCAG 2.2 AA: associated `<label>` elements, keyboard operability, 24×24px minimum touch targets, `:focus-visible` indicators, `aria-invalid` on error, and `role="alert"` for error announcements.

#### Scenario: Keyboard navigation through form

- GIVEN form is rendered
- WHEN user presses Tab repeatedly
- THEN focus moves title → description → status → local sections → submit in logical order
- AND each focused element shows a visible focus ring

#### Scenario: Screen reader announces validation error

- GIVEN user submits with empty title
- WHEN Zod validation fails
- THEN error message is announced via `role="alert"`
- AND focus moves to the first invalid field

### Requirement: Essential Vitest Tests

The system MUST include unit tests for: (a) Zod schema — valid/invalid payloads, (b) form submit adapter — local fields excluded from mutation payload, (c) component rendering — Spanish default labels. Integration tests MAY mock the API client. No broad e2e is required.

#### Scenario: Unit test verifies schema rejects empty title

- GIVEN the Zod schema is imported in test
- WHEN parsing `{ title: "" }`
- THEN `safeParse` returns `success: false` with path `["title"]`

#### Scenario: Unit test verifies local fields excluded

- GIVEN form state with title, tags, and ingredients
- WHEN the submit adapter builds the API payload
- THEN returned object has only `title`, `description`, `status` keys

### Requirement: Backend/API Gap List

The system MUST produce a documented gap list of backend capabilities not yet available for Create Recipe. Each gap SHALL include a description and impact level. Gaps SHALL cover: tags persistence, ingredients with units, steps with ordering, image upload, servings, AI metadata, and missing status transitions.

#### Scenario: Gap list contains all known backend gaps

- GIVEN the Create Recipe slice is implemented
- WHEN the gap list is reviewed
- THEN each item has a description and estimated impact
- AND the list is accessible to future planning phases
