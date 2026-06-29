import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/discover/states";

describe("Discover states", () => {
  it("renders a labelled loading indicator", () => {
    render(<LoadingState label="Cargando recetas" />);
    expect(screen.getByLabelText("Cargando recetas")).toBeInTheDocument();
  });

  it("renders the empty message", () => {
    render(
      <EmptyState
        title="No hay recetas compartidas"
        message="Prueba otra búsqueda"
      />,
    );
    expect(screen.getByText("No hay recetas compartidas")).toBeInTheDocument();
    expect(screen.getByText("Prueba otra búsqueda")).toBeInTheDocument();
  });

  it("announces errors and retries", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        title="No pudimos cargar las recetas"
        retryLabel="Reintentar"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No pudimos cargar las recetas",
    );
    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
