export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-brand-border/40 rounded-md" />
          <div className="h-4 w-64 bg-brand-border/30 rounded-md" />
        </div>
        <div className="h-9 w-32 bg-brand-border/40 rounded-lg" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-brand-white rounded-xl border border-brand-border p-5 space-y-3"
          >
            <div className="h-9 w-9 bg-brand-cream rounded-lg" />
            <div className="h-3 w-24 bg-brand-border/30 rounded" />
            <div className="h-6 w-20 bg-brand-border/50 rounded" />
          </div>
        ))}
      </div>

      {/* Filter / Search skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-72 bg-brand-white border border-brand-border rounded-lg" />
        <div className="h-8 w-20 bg-brand-border/30 rounded-full" />
        <div className="h-8 w-20 bg-brand-border/30 rounded-full" />
      </div>

      {/* Table skeleton */}
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden p-4 space-y-4">
        <div className="h-8 bg-brand-cream rounded-md w-full" />
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center gap-4 py-2 border-b border-brand-border/50">
            <div className="w-10 h-10 bg-brand-cream rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-brand-border/40 rounded" />
              <div className="h-3 w-1/4 bg-brand-border/30 rounded" />
            </div>
            <div className="h-4 w-16 bg-brand-border/30 rounded" />
            <div className="h-4 w-20 bg-brand-border/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
