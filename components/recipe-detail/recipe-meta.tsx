import type { PublicRecipeDetail } from "@/lib/api/public-recipes";

export function RecipeMeta({
  recipe,
  sharedLabel,
  authorLabel,
}: {
  recipe: PublicRecipeDetail;
  sharedLabel: string;
  authorLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {recipe.shared ? (
          <span className="badge badge-primary">{sharedLabel}</span>
        ) : null}
        <span className="text-sm text-base-content/70">
          {authorLabel} {recipe.author.name}
        </span>
      </div>
      <h1 className="text-3xl font-black tracking-tight text-base-content">
        {recipe.title}
      </h1>
      {recipe.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <li key={tag} className="badge badge-soft">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
