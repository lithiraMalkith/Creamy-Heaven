'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Filter, X, Sparkles } from 'lucide-react'
import type { Category } from '@/types'

interface ShopSidebarProps {
  categories: Category[]
  activeCategory?: string
  activeSubCategory?: string
  searchQuery?: string
}

export function ShopSidebar({
  categories,
  activeCategory,
  activeSubCategory,
  searchQuery,
}: ShopSidebarProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const isCategoryActive = (catName: string, catSlug?: string) => {
    if (!activeCategory) return false
    const target = activeCategory.trim().toLowerCase()
    const name = catName.trim().toLowerCase()
    const slug = (catSlug || '').trim().toLowerCase()

    if (name === target || (slug !== '' && slug === target)) return true
    if (target === 'signature bakes' && name === 'cakes') return true
    if (target === 'fruit desserts' && name === 'desserts') return true
    if (target === 'cakes' && name === 'signature bakes') return true
    if (target === 'desserts' && name === 'fruit desserts') return true

    return false
  }

  const isSubCategoryActive = (subName: string, subSlug?: string) => {
    if (!activeSubCategory) return false
    const target = activeSubCategory.trim().toLowerCase()
    const name = subName.trim().toLowerCase()
    const slug = (subSlug || '').trim().toLowerCase()

    return name === target || (slug !== '' && slug === target)
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
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-white border border-brand-border rounded-xl font-body font-semibold text-sm text-brand-black shadow-xs hover:bg-brand-cream transition-colors"
        >
          <Filter className="w-4 h-4 text-amber-800" />
          <span>Filter Categories</span>
          {(activeCategory || activeSubCategory) && (
            <span className="ml-1 w-2 h-2 rounded-full bg-amber-800" />
          )}
        </button>

        {/* Search Bar Mobile */}
        <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-[18px]">
            search
          </span>
          <input
            name="q"
            defaultValue={searchQuery || ''}
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-brand-white border border-brand-border rounded-xl font-body text-xs focus:outline-none focus:border-brand-black"
          />
        </form>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-brand-black/30 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-0 w-80 max-w-full bg-brand-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
              <h2 className="font-heading text-lg font-bold text-brand-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Categories</span>
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-brand-black hover:bg-brand-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SidebarContent
              categories={categories}
              activeCategory={activeCategory}
              activeSubCategory={activeSubCategory}
              isCategoryActive={isCategoryActive}
              isSubCategoryActive={isSubCategoryActive}
              onSelect={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar Card */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-6">
        {/* Search Input Box */}
        <div className="bg-brand-white border border-brand-border rounded-2xl p-4 shadow-2xs">
          <form onSubmit={handleSearchSubmit} className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-[18px]">
              search
            </span>
            <input
              name="q"
              defaultValue={searchQuery || ''}
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 bg-[#eeedec]/60 border border-transparent rounded-xl font-body text-xs text-brand-black placeholder:text-brand-muted focus:bg-brand-white focus:border-brand-black/40 outline-none transition-all"
            />
          </form>
        </div>

        {/* Left Side Category Navigation Card */}
        <div className="bg-brand-white border border-brand-border rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-brand-border">
            <h3 className="font-heading text-base font-bold text-brand-black flex items-center gap-2">
              <span>Categories</span>
            </h3>
            {(activeCategory || activeSubCategory || searchQuery) && (
              <Link
                href="/shop"
                className="text-[11px] font-bold text-amber-900 hover:underline"
              >
                Reset
              </Link>
            )}
          </div>

          <SidebarContent
            categories={categories}
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            isCategoryActive={isCategoryActive}
            isSubCategoryActive={isSubCategoryActive}
          />
        </div>
      </aside>
    </>
  )
}

function SidebarContent({
  categories,
  activeCategory,
  activeSubCategory,
  isCategoryActive,
  isSubCategoryActive,
  onSelect,
}: {
  categories: Category[]
  activeCategory?: string
  activeSubCategory?: string
  isCategoryActive: (catName: string, catSlug?: string) => boolean
  isSubCategoryActive: (subName: string, subSlug?: string) => boolean
  onSelect?: () => void
}) {
  return (
    <div className="space-y-1.5 font-body">
      {/* All Products Link */}
      <Link
        href="/shop"
        onClick={onSelect}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
          !activeCategory && !activeSubCategory
            ? 'bg-brand-black text-brand-white shadow-xs'
            : 'text-brand-black hover:bg-brand-cream/70'
        }`}
      >
        <span>All Products</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
      </Link>

      {/* Main Categories List */}
      {categories.map((cat) => {
        const catActive = isCategoryActive(cat.name, cat.slug)
        const hasSubs = cat.subCategories && cat.subCategories.length > 0

        return (
          <div key={cat.id} className="space-y-1">
            {/* Category Header Link */}
            <Link
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              onClick={onSelect}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                catActive && !activeSubCategory
                  ? 'bg-brand-black text-brand-white shadow-xs'
                  : catActive
                  ? 'bg-amber-950/10 text-amber-950 font-extrabold border border-amber-900/20'
                  : 'text-brand-black hover:bg-brand-cream/70'
              }`}
            >
              <span>{cat.name}</span>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  catActive ? 'rotate-90 text-amber-800' : 'opacity-40'
                }`}
              />
            </Link>

            {/* Subcategories Indented Under Category */}
            {hasSubs && (
              <div className="pl-3.5 pr-1 py-1 space-y-1 border-l-2 border-brand-border/60 ml-3.5">
                {cat.subCategories.map((sub) => {
                  const subActive = isSubCategoryActive(sub.name, sub.slug)
                  return (
                    <Link
                      key={sub.id}
                      href={`/shop?category=${encodeURIComponent(
                        cat.name
                      )}&subCategory=${encodeURIComponent(sub.name)}`}
                      onClick={onSelect}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        subActive
                          ? 'bg-brand-black text-brand-white font-bold shadow-2xs'
                          : 'text-brand-black/80 hover:text-brand-black hover:bg-brand-cream/50'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
