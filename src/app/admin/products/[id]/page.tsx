import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchProduct } from '@/lib/data/products'
import { formatPrice, formatDateLong } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { FlashMessage } from '@/components/flash-message'

export default async function ViewProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('products:read')
  const { id } = await params
  const { flash } = await searchParams
  const product = await fetchProduct(id)
  if (!product) notFound()

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-brand-black">{product.name}</h1>
            <p className="text-brand-muted text-sm mt-1">
              Created {formatDateLong(product.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${id}/edit`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-white border border-brand-border rounded-lg text-sm font-medium text-brand-black hover:bg-brand-cream">
            <Edit2 className="w-4 h-4" /> Edit
          </Link>
          <Link href={`/admin/products/${id}/delete`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-sm font-medium text-brand-danger hover:bg-brand-danger/20">
            <Trash2 className="w-4 h-4" /> Delete
          </Link>
        </div>
      </div>

      <div className="animate-in-stagger grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {product.images.length > 0 && (
            <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6">
              <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i + 1}`} className="rounded-lg object-cover aspect-square border border-brand-border" />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">Description</h2>
            <p className="text-sm text-brand-black-soft leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Details */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Product Details</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {product.flavor && (
                <><dt className="text-brand-muted">Flavor</dt><dd className="text-brand-black">{product.flavor}</dd></>
              )}
              {product.sizeWeight && (
                <><dt className="text-brand-muted">Size / Weight</dt><dd className="text-brand-black">{product.sizeWeight}</dd></>
              )}
              {product.ingredients && (
                <><dt className="text-brand-muted col-span-2">Ingredients</dt><dd className="text-brand-black col-span-2">{product.ingredients}</dd></>
              )}
              {product.allergens && product.allergens.length > 0 && (
                <><dt className="text-brand-muted col-span-2">Allergens</dt>
                <dd className="col-span-2 flex flex-wrap gap-1.5">
                  {product.allergens.map((a) => (
                    <span key={a} className="px-2 py-0.5 rounded-full bg-brand-danger/10 text-brand-danger text-xs font-medium">{a}</span>
                  ))}
                </dd></>
              )}
            </dl>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-muted">Visibility</span>
                <StatusBadge status={product.visibility} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-muted">Stock</span>
                <StatusBadge status={product.availabilityStatus} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-muted">Quantity</span>
                <span className="text-sm font-medium text-brand-black tabular-nums">{product.stockQty}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-muted">Price</span>
                <span className="text-sm font-semibold text-brand-black tabular-nums">{formatPrice(product.price)}</span>
              </div>
              {product.cost != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-muted">Cost</span>
                  <span className="text-sm text-brand-black tabular-nums">{formatPrice(product.cost)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Metadata</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">SKU</span>
                <span className="font-body tabular-nums text-brand-black">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Category</span>
                <span className="text-brand-black">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Sub-Category</span>
                <span className="text-brand-black">{product.subCategory}</span>
              </div>
              {product.isCustomizable && (
                <div className="flex justify-between">
                  <span className="text-brand-muted">Customizable</span>
                  <span className="text-brand-success font-medium">Yes</span>
                </div>
              )}
              {product.isFeatured && (
                <div className="flex justify-between">
                  <span className="text-brand-muted">Featured</span>
                  <span className="text-brand-success font-medium">Yes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
