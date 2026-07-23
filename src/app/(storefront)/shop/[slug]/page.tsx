import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { fetchProductBySlug, fetchPublishedProducts } from '@/lib/data/products'
import { ProductCard } from '@/components/storefront/product-card'
import { AddToCartButton } from '@/components/storefront/add-to-cart-button'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolved = await params
  const product = await fetchProductBySlug(resolved.slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} - Creamy Heaven`,
    description: product.description,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolved = await params
  const product = await fetchProductBySlug(resolved.slug)

  if (!product) {
    notFound()
  }

  // Fetch some related products (just 4 published ones for now)
  const relatedProducts = await fetchPublishedProducts({ category: product.category })
  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4)

  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  })

  // Use product images or placeholder
  const images = product.images?.length 
    ? product.images 
    : ['https://lh3.googleusercontent.com/aida-public/AB6AXuDpV9dZpk8MT3-D0sn-7QGjkV4qRsnTsx4PcPiQsegJq_3i1xFlxot32s0BMFuSdq5YJaXZRaa8B-lsRwJhVHGhKQ_vB_pwQIvc3e-GQyCjqu0OZ5l3LR5YSKiNetPt4DaOqOsXWD_bP6YGR1MkAJ0c-4njAQzFeNcnniYQSFuBYLafhgKqS70iLl92xFpI5pIPg1YZ8SEHFOmyzkihl4N9138V9BHILUA8v8tEUCJs1koIrwlGzTsuKp2Sq2UV-4aT0A37GR7uaFg']

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site pt-12 pb-section-v-space min-h-screen">
      {/* Breadcrumbs */}
      <ScrollReveal direction="up" className="mb-8">
        <nav aria-label="Breadcrumb" className="flex text-brand-muted font-label-sm text-label-sm">
          <ol className="inline-flex items-center space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-brand-black transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                <Link href="/shop" className="hover:text-brand-black transition-colors">Shop</Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-black transition-colors">{product.category}</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                <span className="text-brand-black font-semibold">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </ScrollReveal>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md lg:gap-12 mb-section-v-space">
        
        {/* Image Gallery (Left) */}
        <ScrollReveal direction="right" className="flex flex-col gap-4">
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-surface-container border border-brand-border">
            <img 
              src={images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button key={idx} className={`aspect-square rounded-lg overflow-hidden border ${idx === 0 ? 'border-2 border-brand-black' : 'border border-brand-border hover:border-brand-black transition-colors opacity-70 hover:opacity-100'}`}>
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* Product Details (Right) */}
        <ScrollReveal direction="left" className="flex flex-col">
          <div className="mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm bg-surface-container-lowest border border-brand-border text-brand-black">
              {product.category}
            </span>
            {product.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm bg-brand-cream text-brand-black ml-2">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="font-headline-lg text-headline-lg text-brand-black mb-4">{product.name}</h1>
          <p className="font-price-display text-price-display text-brand-black mb-6">{formatter.format(product.price)}</p>
          
          <p className="font-body-lead text-body-lead text-on-surface-variant mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8 pt-6 border-t border-brand-border">
            {product.allergens && product.allergens.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="font-label-sm text-label-sm text-brand-muted mb-1 uppercase tracking-wider">Allergens</dt>
                <dd className="font-body-md text-body-md text-brand-black">
                  Contains <span className="font-semibold">{product.allergens.join(', ')}</span>.
                </dd>
              </div>
            )}
            <div>
              <dt className="font-label-sm text-label-sm text-brand-muted mb-1 uppercase tracking-wider">SKU</dt>
              <dd className="font-body-md text-body-md text-brand-black font-semibold">{product.sku}</dd>
            </div>
            <div>
              <dt className="font-label-sm text-label-sm text-brand-muted mb-1 uppercase tracking-wider">Customizable</dt>
              <dd className="font-body-md text-body-md text-brand-black">{product.isCustomizable ? 'Yes' : 'No'}</dd>
            </div>
          </div>

          {/* Add to Cart Island */}
          <div className="mt-auto bg-surface-container-lowest p-6 rounded-xl border border-brand-border shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  slug: product.slug,
                  image: images[0]
                }} 
              />
            </div>
            <p className="font-label-sm text-label-sm text-brand-muted mt-4 text-center">Available for store pickup or local delivery.</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Related Products Section */}
      {filteredRelated.length > 0 && (
        <section className="pt-section-v-space border-t border-brand-border">
          <ScrollReveal direction="up">
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-8">You May Also Like</h2>
          </ScrollReveal>
          
          <ScrollReveal stagger={0.05} className="grid grid-cols-2 lg:grid-cols-4 gap-gutter-md md:gap-6">
            {filteredRelated.map(related => (
              <ProductCard key={related.id} product={related} />
            ))}
          </ScrollReveal>
        </section>
      )}
    </div>
  )
}
