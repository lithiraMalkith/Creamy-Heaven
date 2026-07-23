import Link from 'next/link'
import { fetchPublishedProducts } from '@/lib/data/products'
import { ProductCard } from '@/components/storefront/product-card'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'

export const metadata = {
  title: 'Shop - Creamy Heaven',
  description: 'Browse our collection of artisanal cakes and desserts.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  
  // Extract parameters
  const categoryFilter = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined
  const searchFilter = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined
  
  // Fetch products based on filters
  const products = await fetchPublishedProducts({
    category: categoryFilter,
    q: searchFilter,
  })

  // Categories list for pills
  const categories = ['Cakes', 'Desserts', 'Custom']

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site py-section-v-space min-h-[calc(100vh-200px)] w-full">
      {/* Breadcrumb & Header */}
      <ScrollReveal direction="up" className="mb-12">
        <div className="flex items-center gap-2 text-brand-muted font-label-sm text-label-sm mb-4">
          <Link href="/" className="hover:text-brand-black transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-brand-black">Shop</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">Shop</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">Browse our handcrafted collection</p>
      </ScrollReveal>

      {/* Controls: Filters & Search */}
      <ScrollReveal direction="up" delay={0.1} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/shop"
            className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all hover:scale-105 active:scale-95 ${!categoryFilter ? 'bg-brand-black text-surface-container-lowest' : 'bg-surface-container-lowest border border-brand-border text-brand-black hover:border-brand-black'}`}
          >
            All
          </Link>
          {categories.map(cat => (
            <Link 
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all hover:scale-105 active:scale-95 ${categoryFilter === cat ? 'bg-brand-black text-surface-container-lowest' : 'bg-surface-container-lowest border border-brand-border text-brand-black hover:border-brand-black'}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-auto">
          <form action="/shop" method="GET" className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">search</span>
            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
            <input 
              name="q"
              defaultValue={searchFilter || ''}
              type="text" 
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors placeholder:text-brand-muted"
            />
          </form>
        </div>
      </ScrollReveal>

      {/* Product Grid */}
      {products.length > 0 ? (
        <ScrollReveal stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollReveal>
      ) : (
        /* Empty State */
        <ScrollReveal direction="up" className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[48px] text-brand-muted">search_off</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">No products found</h3>
          <p className="font-body-md text-body-md text-brand-muted max-w-md mx-auto mb-8">
            We couldn't find any items matching your current filters. Try adjusting your search or clearing filters.
          </p>
          <Link href="/shop" className="px-8 py-3 rounded-full bg-brand-black text-surface-container-lowest font-label-md text-label-md transition-transform hover:scale-105 active:scale-95">
            Clear All Filters
          </Link>
        </ScrollReveal>
      )}
    </div>
  )
}
