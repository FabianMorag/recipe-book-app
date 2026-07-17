# Delta for product-i18n

## ADDED Requirements

### Requirement: Create Recipe Translation Keys

The typed translation dictionary MUST include keys for all Create Recipe UI copy under the `createRecipe` namespace. Spanish (default) and English (secondary) values SHALL exist for every key. Keys SHALL cover: page heading, title label/placeholder, description label/placeholder, status label and enum options (`DRAFT`, `PRIVATE`, `PUBLIC`), tags section heading, ingredients section heading, steps section heading, AI helper label, submit button, local-only boundary notice, and validation error messages for required fields.

#### Scenario: All createRecipe keys resolve in Spanish

- GIVEN locale is `"es"`
- WHEN a component calls `t("createRecipe.title")`
- THEN the result is `"Título"`

#### Scenario: All createRecipe keys resolve in English

- GIVEN locale is `"en"`
- WHEN a component calls `t("createRecipe.submit")`
- THEN the result is `"Create Recipe"`


