import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchProduct } from '@/lib/data/products'
import { fetchCategories } from '@/lib/data/categories'
import { updateProduct } from '../../actions'
import { FlashMessage } from '@/components/flash-message'
import { ImageUploadPreview } from '@/components/image-upload-preview'

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('products:write')
  const { id } = await params
  const { flash } = await searchParams
  const product = await fetchProduct(id)
  if (!product) notFound()

  const categories = await fetchCategories()
  const updateWithId = updateProduct.bind(null, id)

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto space-y-6">
      <FlashMessage value={flash} />

      <h1 className="font-heading text-2xl font-semibold text-brand-black">Edit Product</h1>

      <form action={updateWithId} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Product Name *</label>
          <input name="name" defaultValue={product.name} required className="form-input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Product Image</label>
          <ImageUploadPreview name="image" defaultPreviewUrl={product.images?.[0]} />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Description *</label>
          <textarea name="description" defaultValue={product.description} required className="form-textarea" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Price (LKR) *</label>
            <input name="price" type="number" step="0.01" defaultValue={product.price} required className="form-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Cost (LKR)</label>
            <input name="cost" type="number" step="0.01" defaultValue={product.cost ?? ''} className="form-input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Category *</label>
            <select name="category" defaultValue={product.category} required className="form-select">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Sub-Category *</label>
            <input name="subCategory" defaultValue={product.subCategory} required className="form-input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">SKU *</label>
            <input name="sku" defaultValue={product.sku} required className="form-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Stock Qty *</label>
            <input name="stockQty" type="number" min="0" defaultValue={product.stockQty} required className="form-input" />
          </div>
        </div>

        <div className="border-t border-brand-border pt-5">
          <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Product Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Flavor</label>
              <input name="flavor" defaultValue={product.flavor ?? ''} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Size / Weight</label>
              <input name="sizeWeight" defaultValue={product.sizeWeight ?? ''} className="form-input" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-brand-black mb-1">Ingredients</label>
            <textarea name="ingredients" defaultValue={product.ingredients ?? ''} className="form-textarea" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-brand-black mb-1">Allergens (comma-separated)</label>
            <input name="allergens" defaultValue={product.allergens?.join(', ') ?? ''} className="form-input" />
          </div>
        </div>

        <div className="border-t border-brand-border pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Visibility *</label>
              <select name="visibility" defaultValue={product.visibility} required className="form-select">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Lead Time (hours)</label>
              <input name="leadTimeHours" type="number" min="0" defaultValue={product.leadTimeHours ?? ''} className="form-input" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isCustomizable" defaultChecked={product.isCustomizable} className="w-4 h-4 rounded border-brand-border" />
              <span className="text-sm text-brand-black">Customizable (made-to-order)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="w-4 h-4 rounded border-brand-border" />
              <span className="text-sm text-brand-black">Featured on homepage</span>
            </label>
          </div>
        </div>

        <div className="border-t border-brand-border pt-5 flex items-center gap-3">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">
            Save Changes
          </button>
          <a href={`/admin/products/${id}`} className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
