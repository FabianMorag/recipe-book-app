export function CategoryPills({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Categorías">
      {categories.map((category) => {
        const isSelected = category === selectedCategory;

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(category)}
            className={`btn btn-sm min-h-10 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isSelected ? "btn-primary" : "btn-ghost bg-base-100"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
