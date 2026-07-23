import { adminDb } from '@/lib/firebase-admin'
import type { Product } from '@/types'

function toProduct(doc: FirebaseFirestore.QueryDocumentSnapshot): Product {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    isCustomizable: data.isCustomizable ?? false,
    isFeatured: data.isFeatured ?? false,
    images: data.images ?? [],
    allergens: data.allergens ?? [],
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Product
}

export async function fetchProducts(params?: {
  q?: string
  category?: string
  visibility?: string
  page?: number
}): Promise<Product[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection('products')
    .orderBy('createdAt', 'desc')
    .limit(100)

  if (params?.category) {
    query = query.where('category', '==', params.category)
  }

  if (params?.visibility) {
    query = query.where('visibility', '==', params.visibility)
  }

  const snapshot = await query.get()
  let items = snapshot.docs.map(toProduct)

  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }

  return items
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const doc = await adminDb.collection('products').doc(id).get()
  return doc.exists
    ? toProduct(doc as FirebaseFirestore.QueryDocumentSnapshot)
    : null
}

export async function fetchPublishedProducts(params?: {
  q?: string
  category?: string
  page?: number
}): Promise<Product[]> {
  return fetchProducts({ ...params, visibility: 'published' })
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const snapshot = await adminDb
    .collection('products')
    .where('slug', '==', slug)
    .limit(1)
    .get()
  
  if (snapshot.empty) return null
  return toProduct(snapshot.docs[0])
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection('products')
    .where('visibility', '==', 'published')
    .where('isFeatured', '==', true)
    .limit(4)
    .get()
  
  return snapshot.docs.map(toProduct)
}

