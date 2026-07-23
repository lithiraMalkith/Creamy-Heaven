import Link from 'next/link'
import type { Product } from '@/types'
import { AddToCartButton } from '@/components/storefront/add-to-cart-button'

export function ProductCard({ product }: { product: Product }) {
  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  })

  // Use the first image if available, else a placeholder
  const imageSrc = product.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpV9dZpk8MT3-D0sn-7QGjkV4qRsnTsx4PcPiQsegJq_3i1xFlxot32s0BMFuSdq5YJaXZRaa8B-lsRwJhVHGhKQ_vB_pwQIvc3e-GQyCjqu0OZ5l3LR5YSKiNetPt4DaOqOsXWD_bP6YGR1MkAJ0c-4njAQzFeNcnniYQSFuBYLafhgKqS70iLl92xFpI5pIPg1YZ8SEHFOmyzkihl4N9138V9BHILUA8v8tEUCJs1koIrwlGzTsuKp2Sq2UV-4aT0A37GR7uaFg'

  return (
    <div className="group bg-surface-container-lowest border border-brand-border rounded-xl overflow-hidden hover:shadow-[0_10px_30px_rgba(21,18,16,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link href={`/shop/${product.slug}`} className="relative h-64 overflow-hidden bg-surface-container block shrink-0">
        <img 
          src={imageSrc} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3 bg-brand-cream px-3 py-1 rounded-full font-label-sm text-label-sm text-brand-black">
          {product.category}
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-headline-sm text-headline-sm text-brand-black mb-1 line-clamp-1">{product.name}</h3>
          <p className="font-body-md text-body-md text-brand-muted mb-4 line-clamp-2 min-h-[3rem]">{product.description}</p>
        </Link>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-price-display text-price-display text-brand-black">
            {formatter.format(product.price)}
          </span>
          <AddToCartButton 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              slug: product.slug,
              image: imageSrc
            }} 
            compact 
          />
        </div>
      </div>
    </div>
  )
}
