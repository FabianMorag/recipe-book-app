export function LoadingState({ label }: { label: string }) {
  return (
    <div className="grid gap-4" aria-label={label}>
      <div className="skeleton h-56 w-full rounded-box" />
      <div className="skeleton h-56 w-full rounded-box" />
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <section className="rounded-box border border-dashed border-base-300 bg-base-100 p-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-base-content/70">{message}</p>
    </section>
  );
}

export function ErrorState({
  title,
  retryLabel,
  onRetry,
}: {
  title: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <section role="alert" className="rounded-box border border-error/30 bg-error/10 p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button type="button" className="btn btn-primary mt-4" onClick={onRetry}>
        {retryLabel}
      </button>
    </section>
  );
}
