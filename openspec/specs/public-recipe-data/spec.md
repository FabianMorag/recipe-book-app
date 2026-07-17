# public-recipe-data Specification

## Purpose

Fetch public recipe summaries from `GET /recipes/public`, transform backend payloads into view models with image, author, and category metadata, and expose loading/error/empty states. Mocked fields MUST be isolated in a dedicated mapper so backend catch-up replaces them in one place.

## Requirements

### Requirement: Public Recipe Fetching

The system MUST fetch public recipes from `GET /recipes/public` using the existing OpenAPI typed client. The fetch SHALL return a list of recipe summaries containing at minimum `id`, `title`, `description`, `status`, and `createdAt`.

#### Scenario: Successful fetch maps backend fields

- GIVEN the backend returns 3 public recipes
- WHEN `usePublicRecipes()` is called
- THEN each item includes `id`, `title`, `description`, `status`, `createdAt` from the backend response
- AND TanStack Query caches the response per its default stale time

#### Scenario: Fetch with empty result set

- GIVEN the backend returns an empty array
- WHEN `usePublicRecipes()` is called
- THEN the hook returns `data: []` and `isLoading: false`
- AND the consumer (discover-home) renders the empty state

### Requirement: View-Model Mapping with Mocked Metadata

The system MUST map backend recipe items to view models that include `image`, `author`, and `category` fields. These fields SHALL be populated by a designated mapper function using isolated mock data until the backend supports them.

#### Scenario: Mapper adds mocked image, author, and category

- GIVEN a backend recipe item with only `id`, `title`, `description`, `status`, `createdAt`
- WHEN the mapper transforms it
- THEN the resulting view model includes `image` (URL string), `author` (object with name/avatar), and `category` (string)
- AND mocked values are self-documenting (e.g., named constants or clearly labeled mocks)

#### Scenario: Mapper preserves all original backend fields

- GIVEN a backend recipe item
- WHEN the mapper transforms it
- THEN no original field is lost or mutated

### Requirement: Mock Isolation

Mocked metadata generators MUST reside exclusively in the mapper module. No component, hook, or test (except mapper unit tests) SHALL import or reference mock values directly.

#### Scenario: Component tests receive mapper output, not raw mocks

- GIVEN an MSW handler returns backend-shaped data
- WHEN a component test renders the recipe card
- THEN the test asserts against the mapper's output shape
- AND the test does NOT import mock image URLs or author names directly

### Requirement: Error State Handling

The fetch hook MUST surface network and server errors to consumers, allowing the discover-home page to render an error state with a retry mechanism.

#### Scenario: Network failure produces error state

- GIVEN MSW intercepts the request with a 500 status
- WHEN `usePublicRecipes()` executes
- THEN the hook returns `isError: true` and an error object
- AND TanStack Query's `refetch` is available for retry

#### Scenario: Timeout after configured threshold

- GIVEN the backend does not respond within the configured timeout
- WHEN the fetch is initiated
- THEN the hook enters an error state with an appropriate message

### Requirement: Strict TDD Verification

The mapper, fetch hook, and MSW integration MUST have Vitest coverage across unit and integration layers. Playwright e2e tests SHALL validate the full page handles backend error and empty responses.

#### Scenario: Unit test verifies mapper with various inputs

- GIVEN a unit test for the mapper
- WHEN it receives backend items and empty arrays
- THEN it asserts correct view-model shape, mocked field presence, and original field preservation

#### Scenario: Integration test verifies MSW-backed fetch

- GIVEN MSW handlers configured for `GET /recipes/public`
- WHEN the hook is tested in an integration test
- THEN successful, empty, and error responses are all verified

### Requirement: Detail-Only Mocked Fields

The system MUST extend the mock/mapper strategy with a dedicated detail mapper that adds fields available only at the detail level: `ingredients`, `steps`, `servings`, `tags`, `shared`, and `aiHint`. These SHALL reside in the same isolated mapper module as the summary mocked fields (`image`, `author`, `category`). No component SHALL import mocked values directly.

#### Scenario: Detail mapper adds mocked detail fields

- GIVEN a backend recipe summary item with only `id`, `title`, `description`, `status`, `createdAt`
- WHEN the detail mapper transforms it for the detail view
- THEN the output includes `ingredients` (array of strings), `steps` (array of strings), `servings` (number), `tags` (array of strings), `shared` (boolean), and `aiHint` (string)
- AND all mocked values are clearly labeled as such in the mapper module

#### Scenario: Detail mapper preserves summary mocked fields

- GIVEN the existing summary mapper populates `image`, `author`, and `category`
- WHEN the detail mapper runs
- THEN the output also includes `image`, `author`, and `category` from the summary mapper
- AND no field is duplicated or overwritten between mappers

#### Scenario: Mixin allowed — real and mocked fields coexist

- GIVEN the backend adds `servings` as a real field in a future release
- WHEN the detail mapper processes the item
- THEN the real `servings` value takes precedence over the mock
- AND the remaining missing fields still receive mock values
