export function PageHeader({
  pretitle,
  title,
  actions,
}: {
  pretitle: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="text-muted text-tiny font-semibold tracking-widest uppercase">
          {pretitle}
        </p>
        <h1 className="text-primary text-h5 font-semibold">{title}</h1>
      </div>
      {actions}
    </div>
  );
}
