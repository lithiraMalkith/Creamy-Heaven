import Link from 'next/link'
import { Plus, FolderTree } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchCategories } from '@/lib/data/categories'
import { FlashMessage } from '@/components/flash-message'

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('categories:read')
  const { flash } = await searchParams
  const categories = await fetchCategories()

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Categories</h1>
          <p className="text-brand-muted text-sm mt-1">{categories.length} categories</p>
        </div>
        <Link href="/admin/categories/new" className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      <div className="animate-in-stagger grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/categories/${cat.id}`}
            className="bg-brand-white rounded-xl border border-brand-border p-5 card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-cream text-brand-black">
                <FolderTree className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-black">{cat.name}</p>
                {cat.description && (
                  <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{cat.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-brand-muted">
                    {cat.subCategories.length} sub-categor{cat.subCategories.length !== 1 ? 'ies' : 'y'}
                  </span>
                  <span className="text-xs text-brand-muted">•</span>
                  <span className="text-xs text-brand-muted tabular-nums">Order: {cat.order}</span>
                </div>
                {cat.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cat.subCategories.map((sub) => (
                      <span key={sub.id} className="px-2 py-0.5 rounded-full bg-brand-cream text-brand-black-soft text-xs">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
        {categories.length === 0 && (
          <p className="col-span-2 text-center py-12 text-brand-muted text-sm">No categories yet</p>
        )}
      </div>
    </div>
  )
}
