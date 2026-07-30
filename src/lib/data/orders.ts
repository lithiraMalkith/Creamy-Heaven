import { unstable_cache } from 'next/cache'
import { adminDb } from '@/lib/firebase-admin'
import type { Order, OrderStatus } from '@/types'

function parseTimestamp(ts: unknown): Date {
  if (!ts) return new Date()
  if (typeof (ts as { toDate?: () => Date }).toDate === 'function') {
    return (ts as { toDate: () => Date }).toDate()
  }
  if (ts instanceof Date) return ts
  if (typeof ts === 'string' || typeof ts === 'number') {
    const d = new Date(ts)
    if (!isNaN(d.getTime())) return d
  }
  return new Date()
}

function toOrder(doc: FirebaseFirestore.QueryDocumentSnapshot): Order {
  const data = doc.data()
  const fallbackRef = `CH-${doc.id.substring(0, 8).toUpperCase()}`

  return {
    id: doc.id,
    orderRef: data.orderRef && data.orderRef.trim() ? data.orderRef : fallbackRef,
    ...data,
    statusHistory: (data.statusHistory ?? []).map((entry: Record<string, unknown>) => ({
      ...entry,
      timestamp: parseTimestamp(entry.timestamp),
    })),
    createdAt: parseTimestamp(data.createdAt),
    updatedAt: parseTimestamp(data.updatedAt),
  } as Order
}

export async function fetchOrders(params?: {
  q?: string
  status?: string
  page?: number
}): Promise<Order[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection('orders')
    .orderBy('createdAt', 'desc')
    .limit(100)

  if (params?.status && params.status !== 'all') {
    query = query.where('status', '==', params.status as OrderStatus)
  }

  const snapshot = await query.get()
  let items = snapshot.docs.map(toOrder)

  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter(
      (item) =>
        item.orderRef.toLowerCase().includes(q) ||
        item.customer.name.toLowerCase().includes(q) ||
        item.customer.email.toLowerCase().includes(q) ||
        item.customer.phone.includes(q)
    )
  }

  return items
}

export async function fetchOrder(id: string): Promise<Order | null> {
  const doc = await adminDb.collection('orders').doc(id).get()
  return doc.exists
    ? toOrder(doc as FirebaseFirestore.QueryDocumentSnapshot)
    : null
}

async function _fetchPendingOrderCount(): Promise<number> {
  const snapshot = await adminDb
    .collection('orders')
    .where('status', '==', 'pending')
    .count()
    .get()
  return snapshot.data().count
}

export const fetchPendingOrderCount = unstable_cache(
  _fetchPendingOrderCount,
  ['pending-orders-count'],
  { tags: ['orders'], revalidate: 10 }
)
