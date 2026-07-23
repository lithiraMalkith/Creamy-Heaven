import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchProduct } from '@/lib/data/products'
import { updateInventoryStock } from '../actions'
import { StatusBadge } from '@/components/status-badge'

export default async function EditInventoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('inventory:write')
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) notFound()

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/inventory" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-semibold text-brand-black">Update Stock</h1>
          <p className="text-brand-muted text-sm">{product.name}</p>
        </div>
      </div>

      <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-muted">Current Status</span>
          <StatusBadge status={product.availabilityStatus} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-muted">Current Stock</span>
          <span className="text-2xl font-semibold tabular-nums text-brand-black">{product.stockQty}</span>
        </div>

        <form action={updateInventoryStock} className="pt-4 border-t border-brand-border space-y-4">
          <input type="hidden" name="productId" value={product.id} />
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">New Stock Quantity</label>
            <input name="stockQty" type="number" min="0" defaultValue={product.stockQty} required className="form-input text-lg tabular-nums" />
          </div>
          <button type="submit" className="btn-hover w-full px-4 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">
            Update Stock
          </button>
        </form>
      </div>
    </div>
  )
}
