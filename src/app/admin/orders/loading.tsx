export default function OrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-brand-border/40 rounded-md" />
          <div className="h-4 w-24 bg-brand-border/30 rounded-md mt-2" />
        </div>
        <div className="h-10 w-28 bg-brand-border/40 rounded-lg" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 w-20 bg-brand-border/30 rounded-full shrink-0" />
        ))}
      </div>

      {/* Search input skeleton */}
      <div className="h-10 w-full max-w-md bg-brand-border/30 rounded-lg" />

      {/* Table skeleton */}
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="p-4 border-b border-brand-border flex gap-4">
          <div className="h-4 w-24 bg-brand-border/40 rounded" />
          <div className="h-4 w-32 bg-brand-border/40 rounded" />
          <div className="h-4 w-16 bg-brand-border/40 rounded" />
          <div className="h-4 w-20 bg-brand-border/40 rounded" />
        </div>
        <div className="divide-y divide-brand-border/50">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="h-5 w-28 bg-brand-border/40 rounded" />
              <div className="h-5 w-40 bg-brand-border/30 rounded" />
              <div className="h-5 w-16 bg-brand-border/30 rounded" />
              <div className="h-5 w-20 bg-brand-border/40 rounded" />
              <div className="h-6 w-24 bg-brand-border/30 rounded-full" />
              <div className="h-4 w-28 bg-brand-border/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
