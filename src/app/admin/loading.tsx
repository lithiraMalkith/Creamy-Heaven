export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-brand-border/40 rounded-md" />
          <div className="h-4 w-64 bg-brand-border/30 rounded-md mt-2" />
        </div>
        <div className="h-10 w-32 bg-brand-border/40 rounded-lg" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-brand-white rounded-xl border border-brand-border p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-brand-border/30 rounded" />
              <div className="w-8 h-8 rounded-lg bg-brand-border/30" />
            </div>
            <div className="h-8 w-32 bg-brand-border/50 rounded" />
            <div className="h-3 w-20 bg-brand-border/30 rounded" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
          <div className="h-6 w-36 bg-brand-border/40 rounded" />
          <div className="h-64 bg-brand-cream/40 rounded-lg" />
        </div>
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
          <div className="h-6 w-36 bg-brand-border/40 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-brand-cream/40 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
