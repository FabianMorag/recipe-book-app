export function BottomNav({
  labels,
}: {
  labels: { discover: string; create: string; mine: string };
}) {
  return (
    <nav className="dock dock-md border-t border-base-300 bg-base-100/95 backdrop-blur" aria-label="Navegación principal">
      <button type="button" className="dock-active" aria-label={labels.discover} aria-current="page">
        <span aria-hidden="true">⌂</span>
        <span className="dock-label">{labels.discover}</span>
      </button>
      <button type="button" disabled aria-label={labels.create}>
        <span aria-hidden="true">＋</span>
        <span className="dock-label">{labels.create}</span>
      </button>
      <button type="button" disabled aria-label={labels.mine}>
        <span aria-hidden="true">☰</span>
        <span className="dock-label">{labels.mine}</span>
      </button>
    </nav>
  );
}
