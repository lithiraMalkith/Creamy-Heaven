import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminDb } from '@/lib/firebase-admin'
import { requireCustomerAuth } from '@/lib/customer-session'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import type { Order } from '@/types'

export const metadata = {
  title: 'Order Details - Creamy Heaven',
}

export default async function AccountOrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await requireCustomerAuth()
  const resolved = await params

  const doc = await adminDb.collection('orders').doc(resolved.id).get()
  
  if (!doc.exists) {
    notFound()
  }

  const order = { id: doc.id, ...doc.data() } as Order

  // Verify order belongs to session user (or session email)
  if (order.customer?.email !== session.email) {
    notFound()
  }

  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  })

  return (
    <ScrollReveal direction="up" className="space-y-8">
      <div>
        <Link href="/account/orders" className="text-brand-muted hover:text-brand-black transition-colors font-label-sm text-label-sm flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">Order #{order.id.slice(0,8).toUpperCase()}</h1>
            <p className="font-body-lead text-body-lead text-brand-muted">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3">
            <span className={`status-${order.status} capitalize px-4 py-2 text-sm`}>{order.status}</span>
            <span className={`status-pending capitalize px-4 py-2 text-sm`}>
              Payment: COD
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-brand-border rounded-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6 border-b border-brand-border pb-4">Items Ordered</h2>
          
          <div className="space-y-4 mb-8">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <span className="font-label-md text-label-md text-brand-black">{item.quantity}x</span>
                  <span className="font-body-md text-body-md text-brand-black">{item.productName}</span>
                </div>
                <span className="font-body-md text-body-md text-brand-black">{formatter.format(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-brand-border mb-6">
            <div className="flex justify-between font-body-md text-body-md text-brand-muted">
              <span>Subtotal</span>
              <span>{formatter.format(order.subtotal)}</span>
            </div>
            <div className="flex justify-between font-body-md text-body-md text-brand-muted">
              <span>Delivery</span>
              <span>{formatter.format(order.deliveryFee)}</span>
            </div>
          </div>

          <div className="flex justify-between font-price-display text-price-display text-brand-black pt-6 border-t border-brand-border">
            <span>Total</span>
            <span>{formatter.format(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-6">
          <h2 className="font-headline-sm text-headline-sm text-brand-black mb-4">Customer Details</h2>
          <div className="space-y-2">
            <p className="font-body-md text-body-md text-brand-black"><span className="text-brand-muted w-24 inline-block">Name:</span> {order.customer?.name}</p>
            <p className="font-body-md text-body-md text-brand-black"><span className="text-brand-muted w-24 inline-block">Email:</span> {order.customer?.email}</p>
            <p className="font-body-md text-body-md text-brand-black"><span className="text-brand-muted w-24 inline-block">Phone:</span> {order.customer?.phone}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-6">
          <h2 className="font-headline-sm text-headline-sm text-brand-black mb-4">Fulfillment Details</h2>
          <div className="space-y-2">
            <p className="font-body-md text-body-md text-brand-black capitalize"><span className="text-brand-muted w-24 inline-block">Method:</span> {order.fulfilmentType}</p>
            {order.fulfilmentType === 'delivery' && order.deliveryAddress && (
              <p className="font-body-md text-body-md text-brand-black flex">
                <span className="text-brand-muted w-24 shrink-0">Address:</span> 
                <span>
                  {order.deliveryAddress.addressLine1}<br/>
                  {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}<br/>
                  Sri Lanka
                </span>
              </p>
            )}
            {order.notes && (
              <p className="font-body-md text-body-md text-brand-black mt-4"><span className="text-brand-muted block mb-1">Notes:</span> {order.notes}</p>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}
