import type { OrderStatus } from '@/types'

export const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  dispatched: 3,
  ready_for_pickup: 3,
  completed: 4,
  cancelled: -1,
}

export const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'dispatched',
  'ready_for_pickup',
  'completed',
  'cancelled'
]
