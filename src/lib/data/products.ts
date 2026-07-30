import { unstable_cache } from 'next/cache'
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

const normalize = (str?: string) =>
  (str || '').toLowerCase().replace(/[^a-z0-9]/g, '')

export async function fetchProducts(params?: {
  q?: string
  category?: string
  subCategory?: string
  visibility?: string
  page?: number
}): Promise<Product[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection('products')
    .orderBy('createdAt', 'desc')
    .limit(100)

  if (params?.visibility) {
    query = query.where('visibility', '==', params.visibility)
  }

  const snapshot = await query.get()
  let items = snapshot.docs.map(toProduct)

  // Filter Category
  if (params?.category && params.category !== 'all') {
    const targetCat = normalize(params.category)
    items = items.filter((item) => {
      const itemCat = normalize(item.category)
      return (
        itemCat === targetCat ||
        (targetCat === 'cakes' && (itemCat.includes('cake') || itemCat.includes('bake'))) ||
        (targetCat === 'desserts' && (itemCat.includes('dessert') || itemCat.includes('mousse'))) ||
        (targetCat === 'giftsets' && itemCat.includes('gift'))
      )
    })
  }

  // Filter SubCategory
  if (params?.subCategory && params.subCategory !== 'all') {
    const targetSub = normalize(params.subCategory)
    items = items.filter((item) => {
      const itemSub = normalize(item.subCategory)
      const itemName = normalize(item.name)
      return (
        itemSub === targetSub ||
        itemSub.includes(targetSub) ||
        itemName.includes(targetSub)
      )
    })
  }

  // Filter Keyword Search
  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
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

async function _fetchPublishedProducts(params?: {
  q?: string
  category?: string
  subCategory?: string
  page?: number
}): Promise<Product[]> {
  return fetchProducts({ ...params, visibility: 'published' })
}

export const fetchPublishedProducts = (params?: {
  q?: string
  category?: string
  subCategory?: string
  page?: number
}) => {
  // If there is an active search query or filter, query live; otherwise use 60s cache
  if (params?.q || params?.category || params?.subCategory) {
    return _fetchPublishedProducts(params)
  }
  return unstable_cache(
    () => _fetchPublishedProducts(params),
    ['published-products-all'],
    { tags: ['products'], revalidate: 60 }
  )()
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

async function _fetchFeaturedProducts(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection('products')
    .where('visibility', '==', 'published')
    .where('isFeatured', '==', true)
    .limit(4)
    .get()
  
  return snapshot.docs.map(toProduct)
}

/**
 * Cached fetchFeaturedProducts — revalidates every 2 minutes or on-demand
 * via revalidateTag('featured-products'). Prevents Firestore hit on every
 * homepage load.
 */
export const fetchFeaturedProducts = unstable_cache(
  _fetchFeaturedProducts,
  ['featured-products'],
  { tags: ['featured-products'], revalidate: 120 }
)
