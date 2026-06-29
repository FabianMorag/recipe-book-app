# recipe-detail Specification

## Purpose

Responsive Recipe Detail page showing a public/shared recipe with image, status, author, title, tags, ingredients, steps, and an AI hint card. Mobile-first layout with centered desktop max-width. Spanish UI by default; English secondary via i18n provider.

## Requirements

### Requirement: Responsive Detail Layout

The system MUST render a mobile-first detail page that centers on desktop with a `max-w-3xl` container. The layout SHALL present sections in order: back/save actions, large image, shared status, author, title, tags, ingredients, steps, and AI hint card.

#### Scenario: Mobile view renders all sections

- GIVEN a recipe detail route is loaded on a viewport < 768px
- WHEN the page renders
- THEN all sections are stacked vertically without overflow
- AND interactive elements meet 24×24px minimum target size (WCAG 2.5.8)

#### Scenario: Desktop view centers with max-width

- GIVEN a recipe detail route is loaded on a viewport ≥ 768px
- WHEN the page renders
- THEN the content container has `max-w-3xl` and is horizontally centered
- AND sections remain vertically stacked within the container

### Requirement: Back and Save Navigation Placeholders

The detail page MUST render Back and Save action buttons. These SHALL be keyboard-focusable and have accessible labels. Navigation behavior is a placeholder (no route wiring yet).

#### Scenario: Back button renders with accessible label

- GIVEN the detail page is rendered
- WHEN inspected
- THEN a Back button exists with `aria-label="Volver a Descubrir"` (es) / `"Back to Discover"` (en)
- AND it is focusable via Tab

#### Scenario: Save button renders with accessible label

- GIVEN the detail page is rendered
- WHEN inspected
- THEN a Save button exists with `aria-label="Guardar receta"` (es) / `"Save recipe"` (en)

### Requirement: Image with Alt Text

The recipe image MUST use `next/image` with a descriptive `alt` attribute. The alt text SHALL describe the recipe content, not the UI context.

#### Scenario: Image renders with descriptive alt text

- GIVEN a recipe with title "Pastel de Choclo"
- WHEN the detail page renders the image
- THEN the `<Image>` component has `alt="Pastel de Choclo"`

### Requirement: Status, Author, Title, and Tags

The detail page MUST display the recipe's shared/public status badge, author name, recipe title, and tags. All text SHALL be i18n-aware via `useTranslations()`.

#### Scenario: Public recipe shows shared status and author

- GIVEN a public recipe with status "shared", author "María", title "Pastel de Choclo", and tags ["chileno", "horno"]
- WHEN the detail page renders
- THEN the status badge displays the translated label
- AND author name, title, and tag pills are visible

### Requirement: Ingredients and Steps

The system MUST render an ordered ingredient list and numbered step cards. Both sections SHALL have i18n-aware section headers.

#### Scenario: Ingredients and steps render with section headers

- GIVEN a recipe with 5 ingredients and 3 steps
- WHEN the detail page renders
- THEN the section header "Ingredientes" (es) / "Ingredients" (en) appears above the ingredient list
- AND the section header "Preparación" (es) / "Steps" (en) appears above numbered step cards

### Requirement: AI Hint Card

The system MUST render an AI hint card with a tip about the recipe. The card SHALL be visually distinguished (e.g., accent border or icon) and contain i18n-aware hint text and descriptive label.

#### Scenario: AI hint card renders with i18n label

- GIVEN the detail page is rendered
- WHEN inspected
- THEN a card with `aria-label="Sugerencia con IA"` (es) / `"AI suggestion"` (en) is present
- AND the hint text is in the active locale

### Requirement: Keyboard Accessibility

All interactive elements on the detail page MUST be keyboard-reachable and display a visible focus indicator via `:focus-visible`. Focus order SHALL follow the visual section order.

#### Scenario: Tab navigates all interactive elements

- GIVEN the detail page is rendered
- WHEN the user presses Tab repeatedly
- THEN focus moves through Back, Save, and any other actionable controls in document order
- AND each focused element shows a visible outline

### Requirement: Strict TDD Coverage

The detail page components, data mapper for detail fields, and i18n integration MUST have Vitest unit and component tests. No broad e2e required.

#### Scenario: Component test verifies section rendering

- GIVEN a mocked recipe detail view model
- WHEN the detail page component renders
- THEN all required sections (image, status, author, title, tags, ingredients, steps, AI hint) are present
- AND i18n keys resolve to visible text

#### Scenario: Mapper unit test verifies detail fields

- GIVEN a unit test for the detail data mapper
- WHEN the mapper receives a backend summary item
- THEN it outputs a view model with all detail fields (ingredients, steps, servings, tags, AI hint, shared status)
- AND mocked fields are populated from the isolated mapper module only
