import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchCategory } from '@/lib/data/categories'
import { updateCategory } from '../../actions'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('categories:write')
  const { id } = await params
  const category = await fetchCategory(id)
  if (!category) notFound()
  const updateWithId = updateCategory.bind(null, id)

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-brand-black">Edit Category</h1>
      <form action={updateWithId} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
        <div><label className="block text-sm font-medium text-brand-black mb-1">Name *</label><input name="name" defaultValue={category.name} required className="form-input" /></div>
        <div><label className="block text-sm font-medium text-brand-black mb-1">Description</label><textarea name="description" defaultValue={category.description ?? ''} className="form-textarea" /></div>
        <div><label className="block text-sm font-medium text-brand-black mb-1">Sort Order</label><input name="order" type="number" min="0" defaultValue={category.order} className="form-input" /></div>
        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">Save Changes</button>
          <a href={`/admin/categories/${id}`} className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">Cancel</a>
        </div>
      </form>
    </div>
  )
}
