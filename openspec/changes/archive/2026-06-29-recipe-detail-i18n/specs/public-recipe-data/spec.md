# Delta for public-recipe-data

## ADDED Requirements

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
