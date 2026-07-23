import { adminDb } from '@/lib/firebase-admin'
import type { UserProfile } from '@/types'

function toUser(doc: FirebaseFirestore.QueryDocumentSnapshot): UserProfile {
  const data = doc.data()
  return {
    uid: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    lastLoginAt: data.lastLoginAt?.toDate?.() ?? undefined,
  } as UserProfile
}

export async function fetchUsers(): Promise<UserProfile[]> {
  const snapshot = await adminDb
    .collection('users')
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map(toUser)
}

export async function fetchUser(uid: string): Promise<UserProfile | null> {
  const doc = await adminDb.collection('users').doc(uid).get()
  return doc.exists
    ? toUser(doc as FirebaseFirestore.QueryDocumentSnapshot)
    : null
}
