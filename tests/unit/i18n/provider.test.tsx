import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { I18nProvider, useTranslations } from "@/lib/i18n/provider";
import { createTestTranslator } from "@/tests/helpers/i18n";

function TranslationProbe() {
  const { locale, setLocale, t } = useTranslations();

  return (
    <div>
      <p>{t("search.placeholder")}</p>
      <p>{locale}</p>
      <button type="button" onClick={() => setLocale("en")}>
        English
      </button>
    </div>
  );
}

describe("I18nProvider", () => {
  it("returns Spanish copy by default and syncs the html lang", () => {
    render(
      <I18nProvider>
        <TranslationProbe />
      </I18nProvider>,
    );

    expect(screen.getByText("Buscar recetas")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("es");
  });

  it("switches visible copy and html lang to English", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <TranslationProbe />
      </I18nProvider>,
    );

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByText("Search recipes")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");
  });

  it("falls back to Spanish when a runtime English key is missing", () => {
    const t = createTestTranslator({
      locale: "en",
      dictionary: {
        es: {
          "search.placeholder": "Buscar recetas",
        },
        en: {},
      },
    });

    expect(t("search.placeholder")).toBe("Buscar recetas");
  });

  it("throws when useTranslations is used outside the provider", () => {
    expect(() => render(<TranslationProbe />)).toThrow(
      "useTranslations must be used within I18nProvider",
    );
  });
});
