import { fetchFeaturedProducts, fetchPublishedProducts } from '@/lib/data/products'
import TestHomeClient from './test-home-client'
import type { Product } from '@/types'

export const metadata = {
  title: 'Creamy Heaven - Artisanal Bakery Showcase',
  description: 'Experience 3D interactive dessert showcase and handcrafted bakes delivered across Sri Lanka.',
}

// Fallback high-quality product bakes with real product images if Firestore has no published items yet
const defaultFallbackProducts: Product[] = [
  {
    id: 'ceylon-ribbon-cake',
    name: 'Ceylon Ribbon Cake',
    description: 'Classic Sri Lankan ribbon cake with delicate vanilla buttercream and almond sponge.',
    price: 6500,
    category: 'Signature Bakes',
    subCategory: 'Ribbon Cakes',
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    ],
    isCustomizable: true,
    isFeatured: true,
    stockQty: 10,
    availabilityStatus: 'in_stock',
    sku: 'CRC-001',
    visibility: 'published',
    slug: 'ceylon-ribbon-cake',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
  },
  {
    id: 'royal-dark-chocolate-fudge',
    name: 'Royal Dark Chocolate Fudge',
    description: '70% pure cocoa ganache layered with moist dark chocolate cake and sea salt caramel.',
    price: 8200,
    category: 'Chocolate Gateaux',
    subCategory: 'Fudge Cakes',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    ],
    isCustomizable: true,
    isFeatured: true,
    stockQty: 8,
    availabilityStatus: 'in_stock',
    sku: 'RCF-002',
    visibility: 'published',
    slug: 'royal-dark-chocolate-fudge',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
  },
  {
    id: 'tropical-passion-mousse',
    name: 'Tropical Passion Mousse',
    description: 'Fresh Sri Lankan passionfruit curds over light white chocolate bavarian cream.',
    price: 7400,
    category: 'Fruit Desserts',
    subCategory: 'Mousse',
    images: [
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    ],
    isCustomizable: false,
    isFeatured: true,
    stockQty: 12,
    availabilityStatus: 'in_stock',
    sku: 'TPM-003',
    visibility: 'published',
    slug: 'tropical-passion-mousse',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
  },
  {
    id: 'artisanal-macaron-box',
    name: 'Artisanal Macaron Box',
    description: 'Handcrafted French macarons infused with cardamom, pistachio, and rose water.',
    price: 4800,
    category: 'Gift Sets',
    subCategory: 'Macarons',
    images: [
      'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
    ],
    isCustomizable: false,
    isFeatured: true,
    stockQty: 15,
    availabilityStatus: 'in_stock',
    sku: 'AMB-004',
    visibility: 'published',
    slug: 'artisanal-macaron-box',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
  },
]

export default async function TestHomePage() {
  let products: Product[] = []

  try {
    // 1. Attempt fetching featured products from Firestore
    products = await fetchFeaturedProducts()

    // 2. If no featured items are marked, fetch top published products
    if (!products || products.length === 0) {
      products = await fetchPublishedProducts()
    }
  } catch (error) {
    console.error('Error fetching storefront featured products:', error)
  }

  // 3. Ensure fallback default products with real images are shown if database returns empty
  const finalProducts =
    products && products.length > 0
      ? products.slice(0, 4)
      : defaultFallbackProducts

  return <TestHomeClient initialProducts={finalProducts} />
}
