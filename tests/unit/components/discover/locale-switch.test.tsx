import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LocaleSwitch } from "@/components/discover/locale-switch";

describe("LocaleSwitch", () => {
  it("marks the active locale and emits changes", async () => {
    const user = userEvent.setup();
    const onLocaleChange = vi.fn();

    render(<LocaleSwitch locale="es" label="Idioma" onLocaleChange={onLocaleChange} />);

    expect(screen.getByRole("button", { name: "Idioma ES" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Idioma EN" }));
    expect(onLocaleChange).toHaveBeenCalledWith("en");
  });
});
