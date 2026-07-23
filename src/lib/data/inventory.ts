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

export async function fetchInventory(params?: {
  status?: string
  q?: string
}): Promise<Product[]> {
  const snapshot = await adminDb
    .collection('products')
    .orderBy('stockQty', 'asc')
    .get()

  let items = snapshot.docs.map(toProduct)

  if (params?.status === 'low_stock') {
    items = items.filter((item) => item.stockQty > 0 && item.stockQty <= 10)
  } else if (params?.status === 'out_of_stock') {
    items = items.filter((item) => item.stockQty === 0)
  } else if (params?.status === 'in_stock') {
    items = items.filter((item) => item.stockQty > 10)
  }

  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
    )
  }

  return items
}
