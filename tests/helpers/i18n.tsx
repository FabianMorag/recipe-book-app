import { translate, type Locale, type TranslationKey } from "@/lib/i18n/dictionaries";

export function createTestTranslator({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: {
    es: Partial<Record<TranslationKey, string>>;
    en?: Partial<Record<TranslationKey, string>>;
  };
}) {
  return (key: TranslationKey) =>
    translate(locale, key, {
      es: dictionary.es as Record<TranslationKey, string>,
      en: dictionary.en,
    });
}
