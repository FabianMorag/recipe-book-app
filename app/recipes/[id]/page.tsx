import { RecipeDetailPage } from "@/components/recipe-detail/recipe-detail-page";

export default async function RecipeDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RecipeDetailPage recipeId={id} />;
}
