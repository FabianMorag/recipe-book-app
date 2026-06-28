import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function SmokeComponent() {
  return <button type="button">Find recipes</button>;
}

describe("Testing Library setup", () => {
  it("renders React components with jest-dom matchers", () => {
    render(<SmokeComponent />);

    expect(
      screen.getByRole("button", { name: /find recipes/i }),
    ).toBeInTheDocument();
  });
});
