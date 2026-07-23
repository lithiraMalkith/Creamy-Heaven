import { requireCustomerAuth } from '@/lib/customer-session'
import { adminDb } from '@/lib/firebase-admin'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export const metadata = {
  title: 'My Orders - Creamy Heaven',
}

export default async function AccountOrdersPage() {
  const session = await requireCustomerAuth()

  const ordersSnapshot = await adminDb
    .collection('orders')
    .where('customer.email', '==', session.email)
    .orderBy('createdAt', 'desc')
    .get()

  const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]

  return (
    <ScrollReveal direction="up" className="space-y-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">Order History</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">View all your past and current orders.</p>
      </div>

      {orders.length > 0 ? (
        <div className="bg-surface-container-lowest border border-brand-border rounded-xl overflow-hidden divide-y divide-brand-border">
          {orders.map(order => (
            <div key={order.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-grow">
                <div>
                  <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider mb-1">Order</p>
                  <p className="font-label-md text-label-md text-brand-black">#{order.id.slice(0,8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider mb-1">Date</p>
                  <p className="font-body-md text-body-md text-brand-black">{new Date(order.createdAt.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider mb-1">Status</p>
                  <span className={`status-${order.status} capitalize`}>{order.status}</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider mb-1">Total</p>
                  <p className="font-price-display text-[18px] text-brand-black">{formatPrice(order.total)}</p>
                </div>
              </div>
              
              <Link href={`/account/orders/${order.id}`} className="whitespace-nowrap px-6 py-2 rounded-full border border-brand-black text-brand-black font-label-md text-label-md hover:bg-brand-black hover:text-on-primary transition-colors text-center">
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-12 text-center">
          <p className="font-body-md text-body-md text-brand-muted mb-6">No orders found.</p>
          <Link href="/shop" className="px-6 py-3 rounded-full bg-brand-black text-on-primary font-label-md text-label-md hover:bg-surface-tint transition-colors">
            Start Shopping
          </Link>
        </div>
      )}
    </ScrollReveal>
  )
}
