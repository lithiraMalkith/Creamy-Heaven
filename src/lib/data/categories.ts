import { unstable_cache } from 'next/cache'
import { adminDb } from '@/lib/firebase-admin'
import type { Category } from '@/types'

export const defaultFallbackCategories: Category[] = [
  {
    id: 'cakes-cat',
    name: 'Cakes',
    slug: 'cakes',
    description: 'Artisanal handcrafted cakes for every occasion',
    order: 1,
    subCategories: [
      { id: 'wedding-cakes', name: 'Wedding Cakes', slug: 'wedding-cakes', description: 'Multi-tiered bespoke wedding centerpieces' },
      { id: 'birthday-cakes', name: 'Birthday Cakes', slug: 'birthday-cakes', description: 'Celebration cakes designed for unforgettable birthdays' },
      { id: 'anniversary-cakes', name: 'Anniversary Cakes', slug: 'anniversary-cakes', description: 'Romantic handcrafted gateaux' },
      { id: 'cupcakes', name: 'Cupcakes', slug: 'cupcakes', description: 'Delicate piped cupcakes in rich flavors' },
      { id: 'ribbon-cakes', name: 'Ribbon Cakes', slug: 'ribbon-cakes', description: 'Classic Sri Lankan multi-layered ribbon bakes' },
      { id: 'fudge-cakes', name: 'Fudge Cakes', slug: 'fudge-cakes', description: 'Rich dark cocoa ganache fudge gateaux' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'desserts-cat',
    name: 'Desserts',
    slug: 'desserts',
    description: 'Decadent mousses, pastries, cheesecakes and mini bites',
    order: 2,
    subCategories: [
      { id: 'mini-desserts', name: 'Mini Desserts', slug: 'mini-desserts', description: 'Bite-sized luxury dessert shots & tartlets' },
      { id: 'cheesecakes', name: 'Cheesecakes', slug: 'cheesecakes', description: 'Creamy New York & fruit-topped cheesecakes' },
      { id: 'puddings', name: 'Puddings', slug: 'puddings', description: 'Traditional & gourmet dessert puddings' },
      { id: 'pastries', name: 'Pastries', slug: 'pastries', description: 'Flaky French choux pastries and eclairs' },
      { id: 'mousse', name: 'Mousse', slug: 'mousse', description: 'Velvety fruit & chocolate mousses' },
      { id: 'macarons', name: 'Macarons', slug: 'macarons', description: 'Handcrafted almond flour macarons' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'gift-sets-cat',
    name: 'Gift Sets',
    slug: 'gift-sets',
    description: 'Curated dessert boxes and festive gifting packs',
    order: 3,
    subCategories: [
      { id: 'macaron-boxes', name: 'Macaron Boxes', slug: 'macaron-boxes', description: 'Assorted artisan macaron gift sets' },
      { id: 'cookie-boxes', name: 'Cookie Boxes', slug: 'cookie-boxes', description: 'Freshly baked butter cookie collections' },
      { id: 'party-packs', name: 'Party Packs', slug: 'party-packs', description: 'Assorted dessert platters for events' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

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

async function _fetchCategories(): Promise<Category[]> {
  try {
    const snapshot = await adminDb
      .collection('categories')
      .orderBy('order', 'asc')
      .get()

    const categories = snapshot.docs.map(toCategory)
    if (categories.length > 0) {
      return categories
    }
  } catch (error) {
    console.error('Error fetching categories from Firestore:', error)
  }

  return defaultFallbackCategories
}

/**
 * Cached fetchCategories — revalidates every 5 minutes or on-demand via
 * revalidateTag('categories'). Categories change at most weekly.
 */
export const fetchCategories = unstable_cache(
  _fetchCategories,
  ['categories'],
  { tags: ['categories'], revalidate: 300 }
)

export async function fetchCategory(id: string): Promise<Category | null> {
  try {
    const doc = await adminDb.collection('categories').doc(id).get()
    if (doc.exists) {
      return toCategory(doc as FirebaseFirestore.QueryDocumentSnapshot)
    }
  } catch (error) {
    console.error('Error fetching category:', error)
  }

  return defaultFallbackCategories.find((c) => c.id === id || c.slug === id) || null
}
