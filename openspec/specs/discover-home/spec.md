# discover-home Specification

## Purpose

Responsive public recipe discovery experience: search, category filters, recipe cards, bottom nav placeholders, and loading/error/empty states. All UI copy defaults to Spanish with English secondary locale available. Accessible to keyboard and screen-reader users.

## Requirements

### Requirement: Responsive Discover Home Layout

The page MUST render a responsive Discover Home with header, search section, category pills, recipe grid/cards, and a bottom navigation bar.

(Strict TDD: all components MUST have unit (Vitest+Testing Library), integration (MSW), and Playwright e2e coverage before merge.)

#### Scenario: Mobile viewport renders stacked layout

- GIVEN viewport width < 768px
- WHEN page loads
- THEN header, search input, category pills, and recipe cards stack vertically
- AND bottom nav is fixed at viewport bottom

#### Scenario: Desktop viewport renders centered grid

- GIVEN viewport width ≥ 1024px
- WHEN page loads
- THEN content is centered with max-width constraint
- AND recipe cards display in a multi-column grid

### Requirement: Search and Category Controls

The system MUST provide a search input field and horizontal category filter pills.

#### Scenario: User types in search field

- GIVEN public recipes are loaded
- WHEN user types in the search input
- THEN recipe cards filter to matching titles/descriptions
- AND the search input has an accessible label (`aria-label="Buscar recetas"`)

#### Scenario: User taps a category pill

- GIVEN category pills are rendered
- WHEN user clicks or tabs to and activates a pill
- THEN only recipes matching that category are shown
- AND the active pill has a visually distinct selected state with `aria-pressed="true"`

### Requirement: Recipe Card Display

Each recipe card MUST display title, description, author name, category badge, image, and a PUBLIC status label. Image and author data SHALL be sourced through the public-recipe-data mapper (currently mocked).

#### Scenario: Recipe card renders with all metadata

- GIVEN recipes are loaded with mocked image/author/category
- WHEN the card renders
- THEN card includes an image with descriptive `alt` text
- AND author name appears with avatar placeholder
- AND category badge is visible
- AND PUBLIC label appears as a daisyUI badge

### Requirement: Loading, Empty, and Error States

The page MUST handle loading, empty, and error states distinctly.

#### Scenario: Recipes are loading

- GIVEN no recipes have been fetched yet
- WHEN the page first renders
- THEN a loading skeleton or spinner with `aria-label="Cargando recetas"` is visible
- AND recipe cards are not yet rendered

#### Scenario: Zero public recipes returned

- GIVEN the backend returns an empty array
- WHEN the fetch completes
- THEN an empty-state message in Spanish is displayed
- AND the search and category controls remain interactive

#### Scenario: Fetch fails with network error

- GIVEN the backend is unreachable
- WHEN the fetch fails
- THEN an error message announces via `role="alert"`
- AND a retry action is available

### Requirement: Bottom Navigation Placeholders

The bottom navigation bar MUST display Create and Mine as placeholder items without routing to full pages in this slice.

#### Scenario: Bottom nav renders placeholder items

- GIVEN the Discover Home is rendered
- WHEN user views the bottom nav
- THEN Discover (active), Create, and Mine items are visible
- AND Create and Mine are navigable to placeholder views or show disabled state
- AND each nav item has an accessible label

### Requirement: Accessibility Compliance

All interactive elements MUST meet WCAG 2.2 AA criteria: keyboard operability, 24×24px minimum touch targets, focus-visible indicators, and screen-reader-announced state changes.

#### Scenario: Keyboard navigation through discover page

- GIVEN the page is loaded
- WHEN user presses Tab repeatedly
- THEN focus moves through search → category pills → recipe cards → bottom nav in logical order
- AND each focused element has a visible focus ring (2px offset outline)

#### Scenario: Screen reader announces dynamic content

- GIVEN a screen reader is active
- WHEN search filters or category selection changes the recipe list
- THEN the number of results is announced via `aria-live="polite"`
- AND error states use `role="alert"`
