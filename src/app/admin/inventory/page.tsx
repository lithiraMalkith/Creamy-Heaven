import Link from 'next/link'
import { Search, AlertTriangle } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchInventory } from '@/lib/data/inventory'
import { formatPrice } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { FlashMessage } from '@/components/flash-message'

const STOCK_TABS = [
  { label: 'All', value: '' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
  { label: 'In Stock', value: 'in_stock' },
]

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; flash?: string }>
}) {
  await requirePermission('inventory:read')
  const { q, status, flash } = await searchParams
  const products = await fetchInventory({ q, status })

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up">
        <h1 className="font-heading text-2xl font-semibold text-brand-black">Inventory</h1>
        <p className="text-brand-muted text-sm mt-1">{products.length} products</p>
      </div>

      {/* Stock status tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {STOCK_TABS.map((tab) => {
          const isActive = (status ?? '') === tab.value
          const params = new URLSearchParams()
          if (tab.value) params.set('status', tab.value)
          if (q) params.set('q', q)
          const href = `/admin/inventory${params.toString() ? '?' + params.toString() : ''}`

          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? 'bg-brand-black text-brand-white border-brand-black'
                  : 'bg-brand-white text-brand-muted border-brand-border hover:text-brand-black'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        {status && <input type="hidden" name="status" value={status} />}
        <input type="text" name="q" defaultValue={q ?? ''} placeholder="Search by name or SKU..." className="form-input !pl-10" />
      </form>

      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock Qty</th>
                <th>Status</th>
                <th className="w-48">Update Stock</th>
              </tr>
            </thead>
            <tbody className="animate-in-stagger">
              {products.map((product) => (
                <tr key={product.id} className={`row-hover ${product.stockQty === 0 ? 'bg-brand-danger/5' : product.stockQty <= 10 ? 'bg-brand-warning/5' : ''}`}>
                  <td>
                    <p className="font-medium text-brand-black">{product.name}</p>
                    <p className="text-xs text-brand-muted">{product.category}</p>
                  </td>
                  <td className="font-body tabular-nums text-brand-muted">{product.sku}</td>
                  <td className="font-body tabular-nums">{formatPrice(product.price)}</td>
                  <td>
                    <span className={`text-lg font-semibold tabular-nums ${
                      product.stockQty === 0 ? 'text-brand-danger' : product.stockQty <= 10 ? 'text-brand-warning' : 'text-brand-black'
                    }`}>
                      {product.stockQty}
                    </span>
                    {product.stockQty <= 10 && product.stockQty > 0 && (
                      <AlertTriangle className="w-4 h-4 text-brand-warning inline ml-2" />
                    )}
                  </td>
                  <td><StatusBadge status={product.availabilityStatus} /></td>
                  <td>
                    <form action="/admin/inventory" method="GET" className="flex items-center gap-2">
                      <Link
                        href={`/admin/inventory/${product.id}`}
                        className="btn-hover px-3 py-1.5 bg-brand-cream text-brand-black rounded-lg text-xs font-medium hover:bg-brand-border"
                      >
                        Edit Stock
                      </Link>
                    </form>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12"><p className="text-brand-muted text-sm">No products found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
