import { beforeEach, describe, expect, it, vi } from "vitest";

const postMock = vi.fn();

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    POST: postMock,
  },
}));

const { createRecipe } = await import("@/lib/api/create-recipe");
const { toCreateRecipePayload } = await import(
  "@/components/create-recipe/submit-boundary"
);

describe("createRecipe", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("posts the create payload to /recipes and returns the created recipe", async () => {
    const created = {
      id: "recipe_1",
      title: "Paella",
      description: "Traditional",
      status: "PUBLIC" as const,
      createdAt: "2026-07-04T10:00:00.000Z",
      updatedAt: "2026-07-04T10:00:00.000Z",
    };
    postMock.mockResolvedValue({ data: created, error: undefined, response: { ok: true, status: 201 } as Response });

    const payload = toCreateRecipePayload({
      title: "Paella",
      description: "Traditional",
      status: "PUBLIC",
      tags: [{ value: "arroz" }],
      ingredients: [{ value: "arroz" }],
      steps: [{ value: "Sofreír" }],
      aiHelperEnabled: false,
    });

    const result = await createRecipe(payload);

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith("/recipes", { body: payload });
    expect(result).toEqual(created);
  });

  it("throws when the backend returns an error response", async () => {
    postMock.mockResolvedValue({
      data: undefined,
      error: { message: "Invalid" },
      response: { ok: false, status: 400 } as Response,
    });

    await expect(
      createRecipe({
        title: "Paella",
        status: "PUBLIC",
      }),
    ).rejects.toThrow();
  });
});