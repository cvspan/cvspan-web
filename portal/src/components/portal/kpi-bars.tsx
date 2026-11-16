export function KpiBars({
  data,
  unit = "percent",
}: {
  data: { month: string; score: number }[];
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => d.score), 100);

  return (
    <div className="px-5 pt-5 pb-4">
      <div
        className="flex h-40 items-end gap-3 sm:gap-5"
        role="img"
        aria-label={`Score by month. ${data
          .map((point) => `${point.month} ${point.score} ${unit}`)
          .join(", ")}.`}
      >
        {data.map((point, index) => (
          <div key={point.month} className="flex h-full flex-1 flex-col justify-end gap-2">
            <span className="text-muted text-center text-tiny">{point.score}</span>
            <div
              className={
                index === data.length - 1
                  ? "bg-brand mx-auto w-full max-w-12 rounded-md"
                  : "bg-brand/35 mx-auto w-full max-w-12 rounded-md"
              }
              style={{ height: `${(point.score / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 sm:gap-5">
        {data.map((point) => (
          <span key={point.month} className="text-muted flex-1 text-center text-tiny">
            {point.month}
          </span>
        ))}
      </div>
    </div>
  );
}
