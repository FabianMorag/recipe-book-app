# Delta for product-i18n

## ADDED Requirements

### Requirement: Recipe Detail Translation Keys

The typed translation dictionary MUST include keys for all Recipe Detail UI copy. Spanish (default) and English (secondary) values SHALL exist for every key. Keys cover: back/save actions, image alt, status label, servings, ingredients section, steps section, AI hint card, and section headings.

#### Scenario: All detail keys resolve in Spanish

- GIVEN locale is `"es"`
- WHEN a Recipe Detail component calls `t("recipeDetail.ingredients")`
- THEN the result is `"Ingredientes"`

#### Scenario: All detail keys resolve in English

- GIVEN locale is `"en"`
- WHEN a Recipe Detail component calls `t("recipeDetail.steps")`
- THEN the result is `"Steps"`

#### Scenario: Missing English key falls back to Spanish

- GIVEN locale is `"en"` and a detail key is added to `es` but not `en`
- WHEN that key is used
- THEN the Spanish text is returned (graceful degradation matches existing pattern)
