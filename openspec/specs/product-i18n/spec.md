# product-i18n Specification

## Purpose

Lightweight i18n infrastructure providing Spanish-default and English-secondary product UI copy for the discover-home slice. Uses a typed dictionary, React context provider, and a `useTranslations()` hook. Does NOT introduce locale-prefixed routing or `next-intl`.

## Requirements

### Requirement: Spanish Default Locale

The system MUST render all product UI copy in Spanish by default. The root `<html>` element MUST include `lang="es"`.

#### Scenario: Page loads with Spanish copy

- GIVEN no locale preference is set
- WHEN the Discover Home renders
- THEN all labels, placeholders, empty/error messages, and button text display in Spanish
- AND `document.documentElement.lang` equals `"es"`

#### Scenario: Next.js metadata reflects Spanish locale

- GIVEN the app layout is rendered
- WHEN the HTML head is inspected
- THEN `<meta>` description and `<title>` are in Spanish
- AND `og:locale` metadata tag is `"es"`

### Requirement: English Secondary Locale

The system MUST support English as a secondary locale. Switching to English SHALL update all translatable UI copy.

#### Scenario: User switches locale to English

- GIVEN the page is rendered in Spanish
- WHEN locale is switched to English via the provider
- THEN all visible UI copy updates to English translations
- AND `document.documentElement.lang` changes to `"en"`

#### Scenario: Missing English translation falls back to Spanish key

- GIVEN a translation key exists in the Spanish dictionary but not in English
- WHEN locale is English and that key is used
- THEN the Spanish text is displayed (graceful degradation)

### Requirement: Typed Translation Dictionary

The i18n system MUST expose a typed dictionary where every key has both `es` and `en` values. All dictionary keys SHALL be string literals usable with TypeScript autocompletion.

#### Scenario: TypeScript enforces complete dictionary

- GIVEN a new translation key is needed
- WHEN a developer adds it to the `es` dictionary only
- THEN TypeScript reports a type error (missing `en` counterpart)

### Requirement: Context Provider and Hook

The system MUST provide an `I18nProvider` React context and a `useTranslations()` hook that returns a translation function `t(key)`. The provider SHALL accept an optional `initialLocale` prop defaulting to `"es"`.

#### Scenario: Component uses useTranslations hook

- GIVEN a component is wrapped in I18nProvider
- WHEN the component calls `const { t } = useTranslations()`
- THEN `t("search.placeholder")` returns the Spanish placeholder text
- AND the hook throws if used outside I18nProvider

### Requirement: Strict TDD Verification

All i18n infrastructure MUST have unit tests (dictionary completeness, hook behavior, provider context). Playwright e2e smoke tests MUST verify Spanish default and English switch renders correct copy.

#### Scenario: Unit test verifies dictionary completeness

- GIVEN the Spanish and English dictionaries
- WHEN tests enumerate all keys
- THEN every key present in Spanish has an English translation
- AND no extra keys exist in English only

#### Scenario: E2E test verifies locale switch

- GIVEN the app is loaded at the Discover Home
- WHEN Playwright switches the locale to English
- THEN the search placeholder and nav labels render in English

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
