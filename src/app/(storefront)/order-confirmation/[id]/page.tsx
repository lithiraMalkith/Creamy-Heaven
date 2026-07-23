import Link from 'next/link'
import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import type { Order } from '@/types'

export const metadata = {
  title: 'Order Confirmation - Creamy Heaven',
}

export default async function OrderConfirmationPage({
  params
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
  })

  return (
    <div className="max-w-3xl mx-auto px-margin-site-mobile md:px-margin-site pt-24 pb-section-v-space w-full flex flex-col items-center">
      
      <ScrollReveal direction="up" className="text-center mb-12">
        <div className="w-24 h-24 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[48px] text-brand-success">check_circle</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-4">Order Confirmed!</h1>
        <p className="font-body-lead text-body-lead text-brand-muted max-w-lg mx-auto">
          Thank you for your order, {order.customer?.name || 'guest'}. We've received your request and will begin preparing your artisanal treats.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1} className="w-full bg-surface-container-lowest border border-brand-border rounded-xl overflow-hidden mb-12">
        <div className="p-6 bg-surface-container border-b border-brand-border flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider mb-1">Order Number</p>
            <p className="font-label-md text-label-md text-brand-black">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider mb-1">Date</p>
            <p className="font-label-md text-label-md text-brand-black">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider mb-1">Payment Method</p>
            <p className="font-label-md text-label-md text-brand-black">Cash on Delivery</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6 border-b border-brand-border pb-4">Order Details</h2>
          
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
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2} className="w-full flex flex-col md:flex-row gap-4 justify-center">
        <Link href="/shop" className="px-8 py-4 rounded-full bg-brand-black text-on-primary font-label-md text-label-md transition-transform hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          Continue Shopping
        </Link>
        <Link href="/" className="px-8 py-4 rounded-full bg-surface-container-lowest border border-brand-border text-brand-black font-label-md text-label-md transition-all hover:scale-105 active:scale-95 hover:border-brand-black text-center">
          Back to Home
        </Link>
      </ScrollReveal>
    </div>
  )
}
