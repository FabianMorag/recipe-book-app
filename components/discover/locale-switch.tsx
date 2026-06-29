import type { Locale } from "@/lib/i18n/provider";

export function LocaleSwitch({
  locale,
  label,
  onLocaleChange,
}: {
  locale: Locale;
  label: string;
  onLocaleChange: (locale: Locale) => void;
}) {
  return (
    <div className="join" aria-label={label}>
      {(["es", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-label={`${label} ${option.toUpperCase()}`}
          aria-pressed={locale === option}
          onClick={() => onLocaleChange(option)}
          className={`btn join-item btn-sm min-h-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            locale === option ? "btn-primary" : "btn-ghost"
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
