import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/components/discover/search-bar";

describe("SearchBar", () => {
  it("renders Spanish accessible search input", () => {
    render(<SearchBar value="" placeholder="Buscar recetas" onChange={() => {}} />);

    expect(screen.getByLabelText("Buscar recetas")).toHaveAttribute(
      "placeholder",
      "Buscar recetas",
    );
  });

  it("fires onChange with the typed query", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchBar value="" placeholder="Buscar recetas" onChange={onChange} />);
    await user.type(screen.getByLabelText("Buscar recetas"), "tarta");

    expect(onChange).toHaveBeenLastCalledWith("tarta");
  });
});
