import { requirePermission } from '@/lib/auth-guard'
import { createCategory } from '../actions'
import { FlashMessage } from '@/components/flash-message'

export default async function NewCategoryPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('categories:write')
  const { flash } = await searchParams

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto space-y-6">
      <FlashMessage value={flash} />
      <h1 className="font-heading text-2xl font-semibold text-brand-black">New Category</h1>
      <form action={createCategory} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
        <div><label className="block text-sm font-medium text-brand-black mb-1">Name *</label><input name="name" required className="form-input" placeholder="e.g. Cakes" /></div>
        <div><label className="block text-sm font-medium text-brand-black mb-1">Description</label><textarea name="description" className="form-textarea" placeholder="Brief description..." /></div>
        <div><label className="block text-sm font-medium text-brand-black mb-1">Sort Order</label><input name="order" type="number" min="0" defaultValue="0" className="form-input" /></div>
        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">Create Category</button>
          <a href="/admin/categories" className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">Cancel</a>
        </div>
      </form>
    </div>
  )
}
