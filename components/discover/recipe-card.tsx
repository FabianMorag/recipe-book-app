import Image from "next/image";
import type { PublicRecipeCard } from "@/lib/api/public-recipes";

export function RecipeCard({
  recipe,
  publicLabel,
}: {
  recipe: PublicRecipeCard;
  publicLabel: string;
}) {
  return (
    <article
      aria-label={recipe.title}
      tabIndex={0}
      className="card card-border overflow-hidden bg-base-100 shadow-sm transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <figure className="h-44 bg-base-200">
        <Image
          src={recipe.image.src}
          alt={recipe.image.alt}
          width={640}
          height={360}
          unoptimized
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="badge badge-soft">{recipe.category}</span>
          <span className="badge badge-primary">{publicLabel}</span>
        </div>
        <div>
          <h2 className="card-title text-xl leading-tight">{recipe.title}</h2>
          <p className="mt-2 text-sm text-base-content/70">
            {recipe.description ?? ""}
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="avatar avatar-placeholder">
            <div className="w-9 rounded-full bg-secondary text-secondary-content">
              <span className="text-xs font-semibold">
                {recipe.author.avatarInitials}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium">{recipe.author.name}</span>
        </div>
      </div>
    </article>
  );
}
