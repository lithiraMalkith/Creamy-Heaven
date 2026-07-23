import { adminDb } from '@/lib/firebase-admin'
import type { CustomRole } from '@/types'

function toRole(doc: FirebaseFirestore.QueryDocumentSnapshot): CustomRole {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    isCustom: true,
  } as CustomRole
}

export async function fetchRoles(): Promise<CustomRole[]> {
  const snapshot = await adminDb
    .collection('roles')
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map(toRole)
}

export async function fetchRole(id: string): Promise<CustomRole | null> {
  const doc = await adminDb.collection('roles').doc(id).get()
  return doc.exists
    ? toRole(doc as FirebaseFirestore.QueryDocumentSnapshot)
    : null
}
