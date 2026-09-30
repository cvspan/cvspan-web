/** Skeletons matching the page shapes, so navigation never flashes an empty screen. */
export default function PortalLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-busy="true" aria-label="Loading">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="bg-raised h-3 w-20 rounded" />
          <div className="bg-raised mt-2 h-6 w-48 rounded" />
        </div>
        <div className="bg-raised h-10 w-28 rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border-line bg-card h-28 rounded-lg border" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="border-line bg-card h-80 rounded-lg border xl:col-span-2" />
        <div className="border-line bg-card h-80 rounded-lg border" />
      </div>
    </div>
  );
}
