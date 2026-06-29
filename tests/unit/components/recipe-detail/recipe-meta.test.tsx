import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecipeMeta } from "@/components/recipe-detail/recipe-meta";
import { mockRecipeDetail } from "@/tests/helpers/recipe-detail";

describe("RecipeMeta", () => {
  it("renders the shared status, author, title, and tags", () => {
    render(
      <RecipeMeta
        recipe={mockRecipeDetail}
        sharedLabel="Compartida"
        authorLabel="por"
      />,
    );

    expect(screen.getByText("Compartida")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pastel de Choclo" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/María/)).toBeInTheDocument();
    expect(screen.getByText("chileno")).toBeInTheDocument();
    expect(screen.getByText("horno")).toBeInTheDocument();
  });
});
