import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchOrders } from '@/lib/data/orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { FlashMessage } from '@/components/flash-message'
import { OrderRowActions } from './row-actions'

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; flash?: string }>
}) {
  await requirePermission('orders:read')
  const { q, status, flash } = await searchParams
  const orders = await fetchOrders({ q, status })

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Orders</h1>
          <p className="text-brand-muted text-sm mt-1">{orders.length} total</p>
        </div>
        <Link
          href="/admin/orders/new"
          className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Order
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = (status ?? 'all') === tab.value
          const params = new URLSearchParams()
          if (tab.value !== 'all') params.set('status', tab.value)
          if (q) params.set('q', q)
          const href = `/admin/orders${params.toString() ? '?' + params.toString() : ''}`

          return (
            <Link
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? 'bg-brand-black text-brand-white border-brand-black'
                  : 'bg-brand-white text-brand-muted border-brand-border hover:text-brand-black'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Search */}
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        {status && <input type="hidden" name="status" value={status} />}
        <input type="text" name="q" defaultValue={q ?? ''} placeholder="Search by order ref, customer..." className="form-input !pl-10" />
      </form>

      {/* Table */}
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="animate-in-stagger">
              {orders.map((order) => (
                <tr key={order.id} className="row-hover">
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="font-body tabular-nums font-medium text-brand-black hover:underline">
                      {order.orderRef}
                    </Link>
                  </td>
                  <td>
                    <p className="font-medium text-brand-black">{order.customer.name}</p>
                    <p className="text-xs text-brand-muted">{order.customer.phone}</p>
                  </td>
                  <td>
                    <span className="text-sm tabular-nums">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td>
                    <span className="font-body tabular-nums font-medium">{formatPrice(order.total)}</span>
                  </td>
                  <td>
                    <span className="text-sm capitalize text-brand-muted">{order.fulfilmentType}</span>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <span className="text-sm text-brand-muted tabular-nums">{formatDate(order.createdAt)}</span>
                  </td>
                  <td>
                    <OrderRowActions id={order.id} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <p className="text-brand-muted text-sm">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
