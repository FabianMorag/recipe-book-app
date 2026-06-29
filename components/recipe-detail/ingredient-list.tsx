export function IngredientList({
  ingredients,
  heading,
  servings,
  servingsLabel,
}: {
  ingredients: string[];
  heading: string;
  servings: number;
  servingsLabel: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-base-content">{heading}</h2>
        <span className="text-sm text-base-content/70">
          {servingsLabel}: {servings}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="text-base text-base-content/80">
            {ingredient}
          </li>
        ))}
      </ul>
    </section>
  );
}
