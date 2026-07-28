export default function OrderDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-brand-border/30 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-7 w-48 bg-brand-border/40 rounded-md" />
          <div className="h-4 w-36 bg-brand-border/30 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
            <div className="h-5 w-32 bg-brand-border/40 rounded" />
            <div className="space-y-3">
              <div className="h-16 bg-brand-cream/50 rounded-lg" />
              <div className="h-16 bg-brand-cream/50 rounded-lg" />
            </div>
          </div>
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
            <div className="h-5 w-32 bg-brand-border/40 rounded" />
            <div className="h-32 bg-brand-cream/40 rounded-lg" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-3">
            <div className="h-5 w-28 bg-brand-border/40 rounded" />
            <div className="h-12 bg-brand-cream/40 rounded" />
          </div>
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-3">
            <div className="h-5 w-28 bg-brand-border/40 rounded" />
            <div className="h-16 bg-brand-cream/40 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
