import Link from 'next/link'
import { fetchPublishedProducts } from '@/lib/data/products'
import { fetchCategories } from '@/lib/data/categories'
import { ProductCard } from '@/components/storefront/product-card'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import { ShopSidebar } from '@/components/storefront/shop-sidebar'

export const metadata = {
  title: 'Shop - Creamy Heaven',
  description: 'Browse our collection of artisanal handcrafted cakes and luxury desserts.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams

  // Extract query parameters
  const categoryFilter =
    typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined
  const subCategoryFilter =
    typeof resolvedParams.subCategory === 'string'
      ? resolvedParams.subCategory
      : undefined
  const searchFilter =
    typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined

  // Fetch backend categories and published products concurrently
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchPublishedProducts({
      category: categoryFilter,
      subCategory: subCategoryFilter,
      q: searchFilter,
    }),
  ])

  const pageTitle = subCategoryFilter
    ? `${subCategoryFilter}`
    : categoryFilter
    ? `${categoryFilter}`
    : 'Shop All'

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site py-section-v-space min-h-[calc(100vh-200px)] w-full">
      {/* Breadcrumb & Header */}
      <ScrollReveal direction="up" className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-brand-muted font-label-sm text-label-sm mb-4">
          <Link href="/" className="hover:text-brand-black transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link href="/shop" className="hover:text-brand-black transition-colors">
            Shop
          </Link>

          {categoryFilter && (
            <>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <Link
                href={`/shop?category=${encodeURIComponent(categoryFilter)}`}
                className="hover:text-brand-black transition-colors"
              >
                {categoryFilter}
              </Link>
            </>
          )}

          {subCategoryFilter && (
            <>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-brand-black font-semibold">{subCategoryFilter}</span>
            </>
          )}
        </div>

        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">
          {pageTitle}
        </h1>
        <p className="font-body-lead text-body-lead text-brand-muted">
          {subCategoryFilter
            ? `Handcrafted ${subCategoryFilter.toLowerCase()} baked fresh daily.`
            : categoryFilter
            ? `Browse our ${categoryFilter.toLowerCase()} collection.`
            : 'Browse our complete artisanal collection.'}
        </p>
      </ScrollReveal>

      {/* Main Shop Layout: Left Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        {/* Left Side Category & Subcategory Selection Sidebar */}
        <ShopSidebar
          categories={categories}
          activeCategory={categoryFilter}
          activeSubCategory={subCategoryFilter}
          searchQuery={searchFilter}
        />

        {/* Right Main Content */}
        <div className="flex-1 w-full min-w-0">
          {/* Active Filter Pills Bar */}
          {(categoryFilter || subCategoryFilter || searchFilter) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3.5 bg-brand-white border border-brand-border rounded-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted mr-1">
                Active Filters:
              </span>
              {categoryFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-900/10 text-amber-950 font-bold text-xs rounded-full">
                  Category: {categoryFilter}
                </span>
              )}
              {subCategoryFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-900 text-brand-white font-bold text-xs rounded-full">
                  Subcategory: {subCategoryFilter}
                </span>
              )}
              {searchFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-black text-brand-white font-bold text-xs rounded-full">
                  Query: "{searchFilter}"
                </span>
              )}
              <Link
                href="/shop"
                className="ml-auto text-xs font-bold text-brand-black underline hover:text-amber-900 transition-colors"
              >
                Clear All
              </Link>
            </div>
          )}

          {/* Product Grid */}
          {products.length > 0 ? (
            <ScrollReveal stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ScrollReveal>
          ) : (
            /* Empty State */
            <ScrollReveal direction="up" className="flex flex-col items-center justify-center py-20 text-center bg-brand-white rounded-2xl border border-brand-border p-8">
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[36px] text-brand-muted">
                  search_off
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">
                No products found
              </h3>
              <p className="font-body-md text-body-md text-brand-muted max-w-md mx-auto mb-6">
                We couldn't find any items matching your selected criteria
                {subCategoryFilter ? ` in "${subCategoryFilter}"` : categoryFilter ? ` in "${categoryFilter}"` : ''}.
              </p>
              <Link
                href="/shop"
                className="px-6 py-2.5 rounded-full bg-brand-black text-surface-container-lowest font-label-md text-label-md transition-transform hover:scale-105 active:scale-95"
              >
                View All Products
              </Link>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  )
}
