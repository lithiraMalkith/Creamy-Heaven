'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types'

interface ShopFiltersProps {
  categories: Category[]
  activeCategory?: string
  activeSubCategory?: string
  searchQuery?: string
}

export function ShopFilters({
  categories,
  activeCategory,
  activeSubCategory,
  searchQuery,
}: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Find currently selected category object if matched
  const selectedCategoryObj = categories.find((c) => {
    if (!activeCategory) return false
    const target = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '')
    const catName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const catSlug = c.slug.toLowerCase().replace(/[^a-z0-9]/g, '')
    return (
      catName === target ||
      catSlug === target ||
      (target === 'cakes' && catName.includes('cake')) ||
      (target === 'desserts' && catName.includes('dessert'))
    )
  })

  const subCategories = selectedCategoryObj?.subCategories || []

  const isCategoryActive = (catName: string) => {
    if (!activeCategory) return false
    const target = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '')
    const cat = catName.toLowerCase().replace(/[^a-z0-9]/g, '')
    return (
      cat === target ||
      (target === 'cakes' && cat.includes('cake')) ||
      (target === 'desserts' && cat.includes('dessert'))
    )
  }

  const isSubCategoryActive = (subName: string) => {
    if (!activeSubCategory) return false
    const target = activeSubCategory.toLowerCase().replace(/[^a-z0-9]/g, '')
    const sub = subName.toLowerCase().replace(/[^a-z0-9]/g, '')
    return sub === target
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q')?.toString() || ''
    
    const params = new URLSearchParams(searchParams.toString())
    if (q.trim()) {
      params.set('q', q.trim())
    } else {
      params.delete('q')
    }
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="space-y-4 mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Main Category Pills */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <Link
            href="/shop"
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
              !activeCategory
                ? 'bg-brand-black text-surface-container-lowest shadow-sm'
                : 'bg-surface-container-lowest border border-brand-border text-brand-black hover:border-brand-black'
            }`}
          >
            All Products
          </Link>

          {categories.map((cat) => {
            const isActive = isCategoryActive(cat.name)
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-brand-black text-surface-container-lowest shadow-sm'
                    : 'bg-surface-container-lowest border border-brand-border text-brand-black hover:border-brand-black'
                }`}
              >
                {cat.name}
              </Link>
            )
          })}
        </div>

        {/* Search Input Bar inside Shop */}
        <div className="w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-[20px]">
              search
            </span>
            <input
              name="q"
              defaultValue={searchQuery || ''}
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-brand-border rounded-xl font-body text-sm focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors placeholder:text-brand-muted"
            />
          </form>
        </div>
      </div>

      {/* Secondary Subcategories Row (revealed when a category with subcategories is active) */}
      {selectedCategoryObj && subCategories.length > 0 && (
        <div className="pt-2 border-t border-brand-border/60 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              {selectedCategoryObj.name} Subcategories:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/shop?category=${encodeURIComponent(selectedCategoryObj.name)}`}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !activeSubCategory
                  ? 'bg-amber-900 text-brand-white shadow-xs font-semibold'
                  : 'bg-brand-cream/80 border border-brand-border text-brand-black hover:bg-brand-white'
              }`}
            >
              All {selectedCategoryObj.name}
            </Link>

            {subCategories.map((sub) => {
              const isSubActive = isSubCategoryActive(sub.name)
              return (
                <Link
                  key={sub.id}
                  href={`/shop?category=${encodeURIComponent(
                    selectedCategoryObj.name
                  )}&subCategory=${encodeURIComponent(sub.name)}`}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSubActive
                      ? 'bg-amber-900 text-brand-white shadow-xs font-semibold'
                      : 'bg-brand-cream/80 border border-brand-border text-brand-black hover:bg-brand-white'
                  }`}
                >
                  {sub.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
