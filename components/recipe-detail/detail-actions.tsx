export function DetailActions({
  backLabel,
  saveLabel,
}: {
  backLabel: string;
  saveLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        aria-label={backLabel}
        className="btn btn-circle btn-ghost min-h-11 min-w-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        type="button"
        aria-label={saveLabel}
        className="btn btn-circle btn-ghost min-h-11 min-w-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span aria-hidden="true">♡</span>
      </button>
    </div>
  );
}
