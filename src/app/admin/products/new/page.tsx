import { requirePermission } from '@/lib/auth-guard'
import { fetchCategories } from '@/lib/data/categories'
import { createProduct } from '../actions'
import { FlashMessage } from '@/components/flash-message'
import { ImageUploadPreview } from '@/components/image-upload-preview'

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('products:write')
  const { flash } = await searchParams
  const categories = await fetchCategories()

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto space-y-6">
      <FlashMessage value={flash} />

      <h1 className="font-heading text-2xl font-semibold text-brand-black">New Product</h1>

      <form action={createProduct} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Product Name *</label>
          <input name="name" required className="form-input" placeholder="Chocolate Fudge Cake" />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Product Image</label>
          <ImageUploadPreview name="image" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Description *</label>
          <textarea name="description" required className="form-textarea" placeholder="Describe this product..." />
        </div>

        {/* Price & Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Price (LKR) *</label>
            <input name="price" type="number" step="0.01" min="0" required className="form-input" placeholder="3500.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Cost (LKR)</label>
            <input name="cost" type="number" step="0.01" min="0" className="form-input" placeholder="1500.00" />
          </div>
        </div>

        {/* Category & Sub-Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Category *</label>
            <select name="category" required className="form-select">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Sub-Category *</label>
            <input name="subCategory" required className="form-input" placeholder="e.g. Custom Cakes" />
          </div>
        </div>

        {/* SKU & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">SKU *</label>
            <input name="sku" required className="form-input font-body tabular-nums" placeholder="CH-CAK-0001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Stock Qty *</label>
            <input name="stockQty" type="number" min="0" required className="form-input" placeholder="50" />
          </div>
        </div>

        {/* Bakery-specific fields */}
        <div className="border-t border-brand-border pt-5">
          <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Product Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Flavor</label>
              <input name="flavor" className="form-input" placeholder="e.g. Chocolate Fudge" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Size / Weight</label>
              <input name="sizeWeight" className="form-input" placeholder="e.g. 1kg, 6 inch" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-brand-black mb-1">Ingredients</label>
            <textarea name="ingredients" className="form-textarea" placeholder="Flour, eggs, butter, sugar, vanilla..." />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-brand-black mb-1">Allergens (comma-separated)</label>
            <input name="allergens" className="form-input" placeholder="egg, dairy, gluten, nuts" />
          </div>
        </div>

        {/* Options */}
        <div className="border-t border-brand-border pt-5">
          <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Options</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Visibility *</label>
              <select name="visibility" required className="form-select">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Lead Time (hours)</label>
              <input name="leadTimeHours" type="number" min="0" className="form-input" placeholder="24" />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isCustomizable" className="w-4 h-4 rounded border-brand-border" />
              <span className="text-sm text-brand-black">Customizable (made-to-order)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" className="w-4 h-4 rounded border-brand-border" />
              <span className="text-sm text-brand-black">Featured on homepage</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-brand-border pt-5 flex items-center gap-3">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">
            Create Product
          </button>
          <a href="/admin/products" className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
