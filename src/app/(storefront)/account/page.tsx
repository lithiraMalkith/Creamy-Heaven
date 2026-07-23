import { requireCustomerAuth } from '@/lib/customer-session'
import { adminDb } from '@/lib/firebase-admin'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export const metadata = {
  title: 'My Account - Creamy Heaven',
}

export default async function AccountDashboardPage() {
  const session = await requireCustomerAuth()

  // Fetch recent orders
  const ordersSnapshot = await adminDb
    .collection('orders')
    .where('customer.email', '==', session.email)
    .orderBy('createdAt', 'desc')
    .limit(3)
    .get()

  const recentOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]

  return (
    <ScrollReveal direction="up" className="space-y-12">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">Welcome back, {session.name || 'Guest'}</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">Manage your orders and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-brand-black">receipt_long</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">Recent Orders</h3>
            <p className="font-body-md text-body-md text-brand-muted mb-4">View status and history</p>
            <Link href="/account/orders" className="font-label-md text-label-md text-brand-black hover:underline inline-flex items-center gap-1">
              View all <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-brand-black">person</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">Profile Details</h3>
            <p className="font-body-md text-body-md text-brand-muted mb-4">Update your information</p>
            <Link href="/account/profile" className="font-label-md text-label-md text-brand-black hover:underline inline-flex items-center gap-1">
              Edit profile <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6">Recent Activity</h2>
        {recentOrders.length > 0 ? (
          <div className="bg-surface-container-lowest border border-brand-border rounded-xl overflow-hidden divide-y divide-brand-border">
            {recentOrders.map(order => (
              <div key={order.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-label-md text-label-md text-brand-black mb-1">Order #{order.id.slice(0,8).toUpperCase()}</p>
                  <p className="font-body-md text-body-md text-brand-muted">{new Date(order.createdAt.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`status-${order.status} capitalize`}>{order.status}</span>
                  <span className="font-price-display text-[18px] text-brand-black">{formatPrice(order.total)}</span>
                  <Link href={`/account/orders/${order.id}`} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-brand-black transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-12 text-center">
            <p className="font-body-md text-body-md text-brand-muted mb-6">You haven't placed any orders yet.</p>
            <Link href="/shop" className="px-6 py-3 rounded-full bg-brand-black text-on-primary font-label-md text-label-md hover:bg-surface-tint transition-colors">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </ScrollReveal>
  )
}
