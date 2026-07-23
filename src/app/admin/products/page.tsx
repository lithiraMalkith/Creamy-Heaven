import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchProducts } from '@/lib/data/products'
import { formatPrice, formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { FlashMessage } from '@/components/flash-message'
import { ProductRowActions } from './row-actions'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; visibility?: string; flash?: string }>
}) {
  await requirePermission('products:read')
  const { q, visibility, flash } = await searchParams
  const products = await fetchProducts({ q, visibility })

  const visibilityFilters = [
    { label: 'All', value: '' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
  ]

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      {/* Header */}
      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Products</h1>
          <p className="text-brand-muted text-sm mt-1">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {visibilityFilters.map((filter) => {
          const isActive = (visibility ?? '') === filter.value
          const params = new URLSearchParams()
          if (filter.value) params.set('visibility', filter.value)
          if (q) params.set('q', q)
          const href = `/admin/products${params.toString() ? '?' + params.toString() : ''}`

          return (
            <Link
              key={filter.value}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${isActive
                ? 'bg-brand-black text-brand-white border-brand-black'
                : 'bg-brand-white text-brand-muted border-brand-border hover:text-brand-black hover:border-brand-black-soft'
                }`}
            >
              {filter.label}
            </Link>
          )
        })}
      </div>

      {/* Search */}
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        {visibility && <input type="hidden" name="visibility" value={visibility} />}
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search products..."
          className="form-input !pl-10"
        />
      </form>

      {/* Table */}
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Visibility</th>
                <th>Created</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="animate-in-stagger">
              {products.map((product) => (
                <tr key={product.id} className="row-hover">
                  <td>
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-brand-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center text-brand-muted text-xs">
                          No img
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-brand-black">{product.name}</p>
                        <p className="text-xs text-brand-muted">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-body tabular-nums text-brand-muted">{product.sku}</span>
                  </td>
                  <td>
                    <span className="font-body tabular-nums">{formatPrice(product.price)}</span>
                  </td>
                  <td>
                    <StatusBadge status={product.availabilityStatus} />
                    <span className="ml-2 text-sm tabular-nums text-brand-muted">{product.stockQty}</span>
                  </td>
                  <td>
                    <StatusBadge status={product.visibility} />
                  </td>
                  <td>
                    <span className="text-sm text-brand-muted tabular-nums">
                      {formatDate(product.createdAt)}
                    </span>
                  </td>
                  <td>
                    <ProductRowActions id={product.id} />
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <p className="text-brand-muted text-sm">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
