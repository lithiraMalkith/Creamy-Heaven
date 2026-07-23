import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchOrder } from '@/lib/data/orders'
import { updateOrderDetails } from '../../actions'
import { FlashMessage } from '@/components/flash-message'

export default async function EditOrderPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('orders:write')
  const { id } = await params
  const { flash } = await searchParams
  
  const order = await fetchOrder(id)
  if (!order) notFound()

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6">
      <FlashMessage value={flash} />
      
      <h1 className="font-heading text-2xl font-semibold text-brand-black">
        Edit Order {order.orderRef}
      </h1>
      
      <form action={updateOrderDetails} className="space-y-6">
        <input type="hidden" name="orderId" value={order.id} />
        
        {/* Customer Details */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-5">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Name</label>
              <input name="customerName" defaultValue={order.customer.name} required className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Email</label>
              <input name="customerEmail" type="email" defaultValue={order.customer.email} required className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Phone</label>
              <input name="customerPhone" defaultValue={order.customer.phone} required className="form-input" />
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        {order.fulfilmentType === 'delivery' && (
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-5">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-black mb-1">Address Line 1</label>
                <input name="addressLine1" defaultValue={order.deliveryAddress?.addressLine1} required className="form-input" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-black mb-1">Address Line 2</label>
                <input name="addressLine2" defaultValue={order.deliveryAddress?.addressLine2 || ''} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1">City</label>
                <input name="city" defaultValue={order.deliveryAddress?.city} required className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1">District</label>
                <input name="district" defaultValue={order.deliveryAddress?.district} required className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1">Postal Code</label>
                <input name="postalCode" defaultValue={order.deliveryAddress?.postalCode} required className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1">Tracking Number</label>
                <input name="trackingNumber" defaultValue={order.trackingNumber || ''} className="form-input font-body tabular-nums" placeholder="e.g. TRK-987654321" />
                <p className="text-xs text-brand-muted mt-1">Leave blank if not applicable.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1">Estimated Delivery Date</label>
                <input name="estimatedDeliveryDate" type="date" defaultValue={order.estimatedDeliveryDate || ''} className="form-input" />
              </div>
            </div>
          </div>
        )}

        {/* Financials */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-5">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Financials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Subtotal</label>
              <input name="subtotal" type="number" step="0.01" defaultValue={order.subtotal} required className="form-input tabular-nums" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Delivery Fee</label>
              <input name="deliveryFee" type="number" step="0.01" defaultValue={order.deliveryFee} required className="form-input tabular-nums" />
            </div>
            <div className="md:col-span-2 text-sm text-brand-muted bg-brand-cream/40 p-3 rounded-lg border border-brand-border">
              <p><strong>Total</strong> will be automatically calculated as Subtotal + Delivery Fee.</p>
              <p className="mt-1 font-body tabular-nums">Current Total: {order.total}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">
            Save Changes
          </button>
          <a href={`/admin/orders/${id}`} className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
