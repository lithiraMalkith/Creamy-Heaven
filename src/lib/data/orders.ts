import { adminDb } from '@/lib/firebase-admin'
import type { Order, OrderStatus } from '@/types'

function toOrder(doc: FirebaseFirestore.QueryDocumentSnapshot): Order {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    statusHistory: (data.statusHistory ?? []).map((entry: Record<string, unknown>) => ({
      ...entry,
      timestamp: (entry.timestamp as FirebaseFirestore.Timestamp)?.toDate?.() ?? new Date(),
    })),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
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

export async function fetchPendingOrderCount(): Promise<number> {
  const snapshot = await adminDb
    .collection('orders')
    .where('status', '==', 'pending')
    .count()
    .get()
  return snapshot.data().count
}
