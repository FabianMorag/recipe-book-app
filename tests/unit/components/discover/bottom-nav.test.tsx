import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const usePathnameMock = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

import { BottomNav } from "@/components/discover/bottom-nav";

const labels = {
  nav: "Navegación principal",
  discover: "Descubrir",
  create: "Crear",
  mine: "Mis recetas",
};

describe("BottomNav", () => {
  it("renders Discover and Create as links and Mine as a disabled placeholder", () => {
    usePathnameMock.mockReturnValue("/");
    render(<BottomNav labels={labels} />);

    const discover = screen.getByRole("link", { name: "Descubrir" });
    expect(discover).toHaveAttribute("href", "/");
    expect(discover).toHaveAttribute("aria-current", "page");

    const create = screen.getByRole("link", { name: "Crear" });
    expect(create).toHaveAttribute("href", "/recipes/new");
    expect(create).not.toHaveAttribute("aria-current", "page");

    expect(
      screen.getByRole("button", { name: "Mis recetas" }),
    ).toBeDisabled();
  });

  it("marks the Create link as active when on /recipes/new", () => {
    usePathnameMock.mockReturnValue("/recipes/new");
    render(<BottomNav labels={labels} />);

    const create = screen.getByRole("link", { name: "Crear" });
    expect(create).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "Descubrir" }),
    ).not.toHaveAttribute("aria-current", "page");
  });

  it("exposes the nav landmark with the provided i18n label", () => {
    usePathnameMock.mockReturnValue("/");
    render(<BottomNav labels={labels} />);

    expect(
      screen.getByRole("navigation", { name: "Navegación principal" }),
    ).toBeInTheDocument();
  });
});