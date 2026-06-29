export function AiHintCard({ label, text }: { label: string; text: string }) {
  return (
    <section
      aria-label={label}
      className="card card-border border-2 border-accent bg-accent/10"
    >
      <div className="card-body gap-2">
        <h2 className="card-title text-lg text-accent-content">{label}</h2>
        <p className="text-base text-base-content/80">{text}</p>
      </div>
    </section>
  );
}
