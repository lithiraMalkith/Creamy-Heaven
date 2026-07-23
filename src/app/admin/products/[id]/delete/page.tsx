import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchProduct } from '@/lib/data/products'
import { deleteProduct } from '../../actions'

export default async function DeleteProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermission('products:delete')
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) notFound()

  const deleteWithId = deleteProduct.bind(null, id)

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-scale-in max-w-sm w-full bg-brand-white border border-brand-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-brand-black">
          Delete &ldquo;{product.name}&rdquo;?
        </h2>
        <p className="text-brand-muted text-sm">
          This action cannot be undone. The product will be permanently removed.
        </p>
        <div className="flex gap-3">
          <a
            href="/admin/products"
            className="btn-hover flex-1 text-center px-4 py-2 border border-brand-border rounded-lg text-brand-black hover:bg-brand-cream"
          >
            Cancel
          </a>
          <form action={deleteWithId} className="flex-1">
            <button
              type="submit"
              className="btn-hover w-full px-4 py-2 bg-brand-danger text-white rounded-lg font-medium hover:bg-red-700"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
