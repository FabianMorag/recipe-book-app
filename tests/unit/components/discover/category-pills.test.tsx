import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryPills } from "@/components/discover/category-pills";

describe("CategoryPills", () => {
  it("renders categories with pressed state", () => {
    render(
      <CategoryPills
        categories={["Todas", "Postres"]}
        selectedCategory="Postres"
        onSelect={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Postres" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("notifies when a category is selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <CategoryPills
        categories={["Todas", "Postres"]}
        selectedCategory="Todas"
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Postres" }));
    expect(onSelect).toHaveBeenCalledWith("Postres");
  });
});
