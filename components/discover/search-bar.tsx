export function SearchBar({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="search"
      aria-label={placeholder}
      defaultValue={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.currentTarget.value)}
      className="input input-lg w-full min-h-12 rounded-box bg-base-100 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    />
  );
}
