export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
        <span aria-hidden className="mt-3 block h-1 w-10 origin-left rounded-full bg-primary" style={{ animation: "fm-grow-x .6s .15s ease-out both" }} />
        {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
