export default function CategoriesLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-brand-border/40 rounded-md" />
          <div className="h-4 w-28 bg-brand-border/30 rounded-md mt-2" />
        </div>
        <div className="h-10 w-36 bg-brand-border/40 rounded-lg" />
      </div>
      <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-brand-cream/50 rounded-lg border border-brand-border/30" />
        ))}
      </div>
    </div>
  )
}
