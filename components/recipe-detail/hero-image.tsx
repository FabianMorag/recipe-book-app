import Image from "next/image";
import type { PublicRecipeDetail } from "@/lib/api/public-recipes";

export function HeroImage({ recipe }: { recipe: PublicRecipeDetail }) {
  return (
    <figure className="overflow-hidden rounded-box bg-base-200 shadow-sm">
      <Image
        src={recipe.image.src}
        alt={recipe.title}
        width={1200}
        height={800}
        unoptimized
        priority
        className="h-full w-full object-cover"
      />
    </figure>
  );
}
