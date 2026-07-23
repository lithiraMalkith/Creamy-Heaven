import { adminDb } from '@/lib/firebase-admin'
import type { Message } from '@/types'

function toMessage(doc: FirebaseFirestore.QueryDocumentSnapshot): Message {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    body: data.body || data.message || '',
    repliedAt: data.repliedAt?.toDate?.() ?? undefined,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  } as Message
}

export async function fetchMessages(params?: {
  status?: string
  q?: string
}): Promise<Message[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(100)

  if (params?.status && params.status !== 'all') {
    query = query.where('status', '==', params.status)
  }

  const snapshot = await query.get()
  let items = snapshot.docs.map(toMessage)

  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q)
    )
  }

  return items
}

export async function fetchMessage(id: string): Promise<Message | null> {
  const doc = await adminDb.collection('messages').doc(id).get()
  return doc.exists
    ? toMessage(doc as FirebaseFirestore.QueryDocumentSnapshot)
    : null
}
