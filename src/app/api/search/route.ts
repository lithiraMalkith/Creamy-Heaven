import { NextResponse } from 'next/server'
import { fetchPublishedProducts } from '@/lib/data/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  if (!q.trim()) {
    return NextResponse.json({ products: [] })
  }

  try {
    const products = await fetchPublishedProducts({ q })
    // Return max 6 top matches for live instant search popup
    const matches = products.slice(0, 6).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.images[0] || '',
      slug: p.slug,
    }))

    return NextResponse.json({ products: matches })
  } catch (error) {
    console.error('API search error:', error)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}
