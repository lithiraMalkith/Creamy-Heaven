import { adminDb } from '@/lib/firebase-admin'
import type { Category } from '@/types'

function toCategory(doc: FirebaseFirestore.QueryDocumentSnapshot): Category {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    subCategories: data.subCategories ?? [],
    order: data.order ?? 0,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Category
}

export async function fetchCategories(): Promise<Category[]> {
  const snapshot = await adminDb
    .collection('categories')
    .orderBy('order', 'asc')
    .get()

  return snapshot.docs.map(toCategory)
}

export async function fetchCategory(id: string): Promise<Category | null> {
  const doc = await adminDb.collection('categories').doc(id).get()
  return doc.exists
    ? toCategory(doc as FirebaseFirestore.QueryDocumentSnapshot)
    : null
}
