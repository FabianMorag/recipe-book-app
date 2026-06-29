import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiHintCard } from "@/components/recipe-detail/ai-hint-card";

describe("AiHintCard", () => {
  it("renders a labelled card with the locale-aware hint text", () => {
    render(
      <AiHintCard
        label="Sugerencia con IA"
        text="Prueba acompañar esta receta con una ensalada fresca."
      />,
    );

    expect(screen.getByLabelText("Sugerencia con IA")).toBeInTheDocument();
    expect(
      screen.getByText("Prueba acompañar esta receta con una ensalada fresca."),
    ).toBeInTheDocument();
  });
});
