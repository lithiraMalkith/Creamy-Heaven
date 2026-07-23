import { adminDb } from '@/lib/firebase-admin'
import type { Customer } from '@/types'

function toCustomer(doc: FirebaseFirestore.QueryDocumentSnapshot): Customer {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    firstOrderAt: data.firstOrderAt?.toDate?.() ?? undefined,
    lastOrderAt: data.lastOrderAt?.toDate?.() ?? undefined,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  } as Customer
}

export async function fetchCustomers(params?: {
  q?: string
}): Promise<Customer[]> {
  const snapshot = await adminDb
    .collection('customers')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get()

  let items = snapshot.docs.map(toCustomer)

  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.includes(q)
    )
  }

  return items
}

export async function fetchCustomer(id: string): Promise<Customer | null> {
  const doc = await adminDb.collection('customers').doc(id).get()
  return doc.exists
    ? toCustomer(doc as FirebaseFirestore.QueryDocumentSnapshot)
    : null
}
