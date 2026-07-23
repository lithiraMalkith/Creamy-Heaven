import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchOrder } from '@/lib/data/orders'
import { deleteOrder } from '../../actions'

export default async function DeleteOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('orders:write')
  const { id } = await params
  
  const order = await fetchOrder(id)
  if (!order) notFound()

  const deleteWithId = deleteOrder.bind(null, id)

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-scale-in max-w-sm w-full bg-brand-white border border-brand-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-brand-black">Delete {order.orderRef}?</h2>
        <p className="text-brand-muted text-sm">
          This will permanently remove this order record. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <a 
            href="/admin/orders" 
            className="btn-hover flex-1 text-center px-4 py-2 border border-brand-border rounded-lg text-brand-black hover:bg-brand-cream"
          >
            Cancel
          </a>
          <form action={deleteWithId} className="flex-1">
            <button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-danger text-white rounded-lg font-medium">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
