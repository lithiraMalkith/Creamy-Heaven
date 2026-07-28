export default function CustomersLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-brand-border/40 rounded-md" />
          <div className="h-4 w-28 bg-brand-border/30 rounded-md mt-2" />
        </div>
      </div>
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="p-4 border-b border-brand-border flex gap-4">
          <div className="h-4 w-32 bg-brand-border/40 rounded" />
          <div className="h-4 w-40 bg-brand-border/40 rounded" />
          <div className="h-4 w-24 bg-brand-border/40 rounded" />
        </div>
        <div className="divide-y divide-brand-border/50">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="h-5 w-40 bg-brand-border/40 rounded" />
              <div className="h-5 w-32 bg-brand-border/30 rounded" />
              <div className="h-5 w-24 bg-brand-border/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
