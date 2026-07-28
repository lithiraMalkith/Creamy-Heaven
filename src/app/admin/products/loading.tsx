export default function ProductsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-36 bg-brand-border/40 rounded-md" />
          <div className="h-4 w-28 bg-brand-border/30 rounded-md mt-2" />
        </div>
        <div className="h-10 w-32 bg-brand-border/40 rounded-lg" />
      </div>
      <div className="h-10 w-full max-w-md bg-brand-border/30 rounded-lg" />
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="divide-y divide-brand-border/50">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-brand-border/30" />
                <div className="space-y-1">
                  <div className="h-5 w-40 bg-brand-border/40 rounded" />
                  <div className="h-3 w-20 bg-brand-border/30 rounded" />
                </div>
              </div>
              <div className="h-5 w-20 bg-brand-border/40 rounded" />
              <div className="h-6 w-24 bg-brand-border/30 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
