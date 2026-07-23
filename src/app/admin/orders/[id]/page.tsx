import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, MapPin, User, Phone, Mail } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchOrder } from '@/lib/data/orders'
import { formatPrice, formatDate, formatDateLong } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { FlashMessage } from '@/components/flash-message'
import { updateOrderStatus, updateOrderDetails } from '../actions'
import { STATUS_ORDER, ALL_STATUSES } from '../constants'
import type { OrderStatus } from '@/types'

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('orders:read')
  const { id } = await params
  const { flash } = await searchParams
  const order = await fetchOrder(id)
  if (!order) notFound()

  const currentIndex = STATUS_ORDER[order.status] ?? -1
  const isTerminal = order.status === 'completed' || order.status === 'cancelled'
  
  const validTransitions = ALL_STATUSES.filter(s => {
    if (s === 'cancelled') return !isTerminal
    if (s === 'completed' && order.status === 'completed') return false
    
    const sIndex = STATUS_ORDER[s] ?? -1
    
    if (s === 'dispatched' && order.fulfilmentType !== 'delivery') return false
    if (s === 'ready_for_pickup' && order.fulfilmentType !== 'pickup') return false
    
    return sIndex > currentIndex
  })

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-semibold text-brand-black">{order.orderRef}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-brand-muted text-sm mt-1">{formatDateLong(order.createdAt)}</p>
        </div>
        <div>
          <Link href={`/admin/orders/${order.id}/edit`} className="btn-hover px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium">
            Edit Order
          </Link>
        </div>
      </div>

      <div className="animate-in-stagger grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
              <Package className="w-4 h-4 inline mr-1.5" />Order Items
            </h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-brand-cream/40">
                  {item.image ? (
                    <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-brand-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-brand-cream flex items-center justify-center text-brand-muted text-xs">IMG</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-black text-sm">{item.productName}</p>
                    <p className="text-xs text-brand-muted font-body tabular-nums">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-body tabular-nums">{formatPrice(item.price)} × {item.quantity}</p>
                    <p className="text-sm font-semibold font-body tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border space-y-2 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span className="font-body tabular-nums">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Delivery Fee</span>
                <span className="font-body tabular-nums">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-brand-black text-base">
                <span>Total</span>
                <span className="font-body tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Status History</h2>
            <div className="space-y-4">
              {order.statusHistory.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-black mt-1.5" />
                    {i < order.statusHistory.length - 1 && <div className="w-px flex-1 bg-brand-border" />}
                  </div>
                  <div className="pb-4">
                    <StatusBadge status={entry.status} />
                    <p className="text-xs text-brand-muted mt-1 tabular-nums">{formatDate(entry.timestamp)}</p>
                    <p className="text-xs text-brand-muted">by {entry.updatedBy}</p>
                    {entry.note && <p className="text-sm text-brand-black-soft mt-1">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.cancellationReason && (
            <div className="form-section bg-brand-danger/5 rounded-xl border border-brand-danger/20 p-6">
              <h2 className="text-sm font-semibold text-brand-danger uppercase tracking-wider mb-2">Cancellation Reason</h2>
              <p className="text-sm text-brand-black-soft">{order.cancellationReason}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          {!isTerminal && (
            <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6">
              <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Update Status</h2>
              <form action={updateOrderStatus} className="space-y-3">
                <input type="hidden" name="orderId" value={order.id} />
                <select name="status" required className="form-select">
                  <option value="">Choose next status...</option>
                  {validTransitions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
                <input name="note" className="form-input" placeholder="Add a note (optional)" />
                {validTransitions.includes('cancelled') && (
                  <input name="cancellationReason" className="form-input" placeholder="Cancellation reason (required if cancelling)" />
                )}
                <button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium">
                  Update Status
                </button>
              </form>
            </div>
          )}

          {/* Customer Info */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
              <User className="w-4 h-4 inline mr-1.5" />Customer
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-brand-black">{order.customer.name}</p>
              <div className="flex items-center gap-2 text-brand-muted">
                <Mail className="w-3.5 h-3.5" /> {order.customer.email}
              </div>
              <div className="flex items-center gap-2 text-brand-muted">
                <Phone className="w-3.5 h-3.5" /> {order.customer.phone}
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Info */}
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
              {order.fulfilmentType === 'delivery' ? (
                <><Truck className="w-4 h-4 inline mr-1.5" />Delivery</>
              ) : (
                <><MapPin className="w-4 h-4 inline mr-1.5" />Pickup</>
              )}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Type</span>
                <span className="capitalize text-brand-black">{order.fulfilmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Payment</span>
                <span className="uppercase text-brand-black">{order.paymentMethod}</span>
              </div>
              {order.deliveryAddress && (
                <div className="mt-3 pt-3 border-t border-brand-border text-brand-black-soft">
                  <p>{order.deliveryAddress.addressLine1}</p>
                  {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.district}</p>
                  <p>{order.deliveryAddress.postalCode}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex justify-between mt-2">
                  <span className="text-brand-muted">Tracking</span>
                  <span className="font-body tabular-nums text-brand-black">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tracking / Delivery Date Update */}
          {order.fulfilmentType === 'delivery' && !isTerminal && (
            <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6">
              <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Delivery Details</h2>
              <form action={updateOrderDetails} className="space-y-3">
                <input type="hidden" name="orderId" value={order.id} />
                <div>
                  <label className="text-xs text-brand-muted">Tracking Number</label>
                  <input name="trackingNumber" defaultValue={order.trackingNumber ?? ''} className="form-input" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted">Est. Delivery Date</label>
                  <input name="estimatedDeliveryDate" type="date" defaultValue={order.estimatedDeliveryDate ?? ''} className="form-input" />
                </div>
                <button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-white border border-brand-border rounded-lg text-sm font-medium text-brand-black hover:bg-brand-cream">
                  Update
                </button>
              </form>
            </div>
          )}

          {order.notes && (
            <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
              <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-2">Notes</h2>
              <p className="text-sm text-brand-black-soft">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
