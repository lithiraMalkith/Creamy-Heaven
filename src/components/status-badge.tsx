import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  ShoppingBag,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pending:          { label: 'Pending',          className: 'status-pending',    icon: <Clock className="w-3 h-3" /> },
  confirmed:        { label: 'Confirmed',        className: 'status-confirmed',  icon: <CheckCircle2 className="w-3 h-3" /> },
  processing:       { label: 'Processing',       className: 'status-processing', icon: <Package className="w-3 h-3" /> },
  dispatched:       { label: 'Dispatched',        className: 'status-dispatched', icon: <Truck className="w-3 h-3" /> },
  ready_for_pickup: { label: 'Ready for Pickup', className: 'status-pickup',     icon: <ShoppingBag className="w-3 h-3" /> },
  completed:        { label: 'Completed',        className: 'status-completed',  icon: <CheckCircle className="w-3 h-3" /> },
  cancelled:        { label: 'Cancelled',        className: 'status-cancelled',  icon: <XCircle className="w-3 h-3" /> },
}

/**
 * Server-renderable status badge.
 * Works for order status, visibility, and stock status.
 */
export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as OrderStatus]

  if (config) {
    return (
      <span className={config.className}>
        {config.icon}
        {config.label}
      </span>
    )
  }

  // Fallback for non-order statuses (visibility, stock, etc.)
  return (
    <span className={`status-${status}`}>
      {status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  )
}
