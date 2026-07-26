import Link from 'next/link'
import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import type { Order } from '@/types'

export const metadata = {
  title: 'Order Confirmation - Creamy Heaven',
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolved = await params

  const doc = await adminDb.collection('orders').doc(resolved.id).get()

  if (!doc.exists) {
    notFound()
  }

  const order = { id: doc.id, ...doc.data() } as Order
  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  })

  // Safely parse the createdAt date which might be a Firestore Timestamp
  const orderDate = (order.createdAt as any)?.toDate
    ? (order.createdAt as any).toDate()
    : new Date(order.createdAt)

  const isPickup = order.fulfilmentType === 'pickup'

  return (
    <div className="max-w-3xl mx-auto px-margin-site-mobile md:px-margin-site pt-20 pb-section-v-space w-full flex flex-col items-center">
      <ScrollReveal direction="up" className="text-center mb-10">
        <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[44px] text-brand-success">
            check_circle
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-3">
          Order Confirmed!
        </h1>
        <p className="font-body-lead text-body-lead text-brand-muted max-w-lg mx-auto">
          Thank you for your order, {order.customer?.name || 'guest'}. We've received your request and will begin preparing your artisanal treats.
        </p>
      </ScrollReveal>

      <ScrollReveal
        direction="up"
        delay={0.1}
        className="w-full bg-brand-white border border-brand-border rounded-2xl overflow-hidden mb-10 shadow-xs"
      >
        <div className="p-6 bg-brand-cream/40 border-b border-brand-border grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-body text-xs text-brand-muted uppercase tracking-wider mb-1">
              Order Ref
            </p>
            <p className="font-body font-bold text-sm text-brand-black">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-brand-muted uppercase tracking-wider mb-1">
              Date
            </p>
            <p className="font-body font-bold text-sm text-brand-black">
              {orderDate.toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-brand-muted uppercase tracking-wider mb-1">
              Fulfillment
            </p>
            <p className="font-body font-bold text-sm text-amber-950 capitalize">
              {isPickup ? 'Store Pickup' : 'Local Delivery'}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-brand-muted uppercase tracking-wider mb-1">
              Payment
            </p>
            <p className="font-body font-bold text-sm text-brand-black">
              {isPickup ? 'Cash on Pickup' : 'Cash on Delivery'}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <h2 className="font-heading text-lg font-bold text-brand-black border-b border-brand-border pb-4">
            Order Items
          </h2>

          <div className="space-y-3.5 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm font-body">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-brand-black bg-brand-cream px-2 py-0.5 rounded text-xs">
                    {item.quantity}x
                  </span>
                  <span className="text-brand-black">{item.productName}</span>
                </div>
                <span className="font-semibold text-brand-black">
                  {formatter.format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Fulfillment Instructions Card */}
          <div className="p-4 bg-brand-cream/50 border border-brand-border rounded-xl font-body text-xs space-y-1.5">
            {isPickup ? (
              <>
                <p className="font-bold text-brand-black">📍 Collection Address:</p>
                <p className="text-brand-black/80">Creamy Heaven Bakery — 45 Galle Road, Colombo 03</p>
                <p className="text-brand-muted">Pickup Hours: Mon – Sun: 9:00 AM – 7:00 PM</p>
              </>
            ) : (
              <>
                <p className="font-bold text-brand-black">🚚 Delivery Address:</p>
                <p className="text-brand-black/80">
                  {order.deliveryAddress?.addressLine1}, {order.deliveryAddress?.city}
                </p>
              </>
            )}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-brand-border font-body text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal</span>
              <span className="text-brand-black font-medium">{formatter.format(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>Fulfillment ({isPickup ? 'Store Pickup' : 'Delivery'})</span>
              <span className="text-brand-black font-medium">
                {isPickup ? 'FREE' : formatter.format(order.deliveryFee)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-brand-border">
            <span className="font-heading text-lg font-bold text-brand-black">Total Paid</span>
            <span className="font-heading text-2xl font-bold text-amber-950">
              {formatter.format(order.total)}
            </span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal
        direction="up"
        delay={0.2}
        className="w-full flex flex-col md:flex-row gap-4 justify-center"
      >
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full bg-brand-black text-brand-white font-body font-bold text-sm hover:bg-brand-black/90 transition-transform hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>Continue Shopping</span>
        </Link>
        <Link
          href="/"
          className="px-8 py-3.5 rounded-full bg-brand-white border border-brand-border text-brand-black font-body font-semibold text-sm hover:bg-brand-cream transition-all hover:scale-105 active:scale-95 text-center"
        >
          Back to Home
        </Link>
      </ScrollReveal>
    </div>
  )
}
