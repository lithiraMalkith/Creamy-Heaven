import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Trash2, X } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchCategory } from '@/lib/data/categories'
import { addSubCategory, removeSubCategory } from '../actions'
import { FlashMessage } from '@/components/flash-message'

export default async function ViewCategoryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('categories:read')
  const { id } = await params
  const { flash } = await searchParams
  const category = await fetchCategory(id)
  if (!category) notFound()

  const addSubWithId = addSubCategory.bind(null, id)

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-brand-black">{category.name}</h1>
            {category.description && <p className="text-brand-muted text-sm mt-1">{category.description}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/categories/${id}/edit`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-white border border-brand-border rounded-lg text-sm"><Edit2 className="w-4 h-4" /> Edit</Link>
          <Link href={`/admin/categories/${id}/delete`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-sm text-brand-danger"><Trash2 className="w-4 h-4" /> Delete</Link>
        </div>
      </div>

      {/* Sub-categories */}
      <div className="bg-brand-white rounded-xl border border-brand-border p-6">
        <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
          Sub-Categories ({category.subCategories.length})
        </h2>

        {category.subCategories.length > 0 ? (
          <div className="space-y-2 mb-6">
            {category.subCategories.map((sub) => {
              const removeWithIds = removeSubCategory.bind(null, id, sub.id)
              return (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-brand-cream/50">
                  <div>
                    <p className="text-sm font-medium text-brand-black">{sub.name}</p>
                    {sub.description && <p className="text-xs text-brand-muted">{sub.description}</p>}
                  </div>
                  <form action={removeWithIds}>
                    <button type="submit" className="p-1 rounded text-brand-muted hover:text-brand-danger hover:bg-brand-danger/10 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-brand-muted mb-6">No sub-categories yet.</p>
        )}

        {/* Add sub-category form */}
        <div className="pt-4 border-t border-brand-border">
          <h3 className="text-sm font-medium text-brand-black mb-3">Add Sub-Category</h3>
          <form action={addSubWithId} className="flex items-end gap-3">
            <div className="flex-1">
              <input name="name" required className="form-input" placeholder="Sub-category name" />
            </div>
            <button type="submit" className="btn-hover px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium whitespace-nowrap">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
