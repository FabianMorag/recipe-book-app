export function StepCards({
  steps,
  heading,
}: {
  steps: string[];
  heading: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-base-content">{heading}</h2>
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={index} className="card card-border bg-base-100 shadow-sm">
            <div className="card-body flex-row items-center gap-3">
              <span className="badge badge-primary badge-lg" aria-hidden="true">
                {index + 1}
              </span>
              <p className="text-base text-base-content/80">{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
