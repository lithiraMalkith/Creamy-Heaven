'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SearchResult {
  id: string
  name: string
  price: number
  category: string
  image: string
  slug: string
}

export function StorefrontSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.products || [])
          setIsOpen(true)
        }
      } catch (err) {
        console.error('Failed to fetch search suggestions', err)
      } finally {
        setIsLoading(false)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto focus mobile input when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus()
    }
  }, [isMobileSearchOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      setIsMobileSearchOpen(false)
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div ref={searchRef} className="relative flex items-center">
      {/* Desktop Search Bar (Stitch Design) */}
      <form
        onSubmit={handleSubmit}
        className="hidden lg:flex items-center w-48 xl:w-64 h-10 bg-[#eeedec] rounded-lg border border-transparent focus-within:border-brand-black/30 focus-within:bg-brand-white transition-all px-3.5 gap-2 text-brand-black"
      >
        <span className="material-symbols-outlined text-[#78726d] text-[20px] shrink-0">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search products..."
          className="w-full bg-transparent text-sm font-normal text-brand-black placeholder-[#78726d] outline-none border-none p-0 focus:ring-0"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
            className="text-brand-muted hover:text-brand-black p-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </form>

      {/* Mobile Search Icon Trigger */}
      <button
        type="button"
        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        className="lg:hidden p-2 rounded-full text-brand-black hover:bg-black/5 transition-colors"
        aria-label="Open search"
      >
        <span className="material-symbols-outlined text-[24px]">search</span>
      </button>

      {/* Mobile Search Top Bar Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-x-0 top-0 z-[70] bg-brand-cream border-b border-brand-border p-4 shadow-lg lg:hidden animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-max-width-content mx-auto">
            <div className="flex-grow flex items-center h-11 bg-brand-white border border-brand-border rounded-xl px-3.5 gap-2">
              <span className="material-symbols-outlined text-brand-muted text-[20px]">
                search
              </span>
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cakes, desserts, flavors..."
                className="w-full bg-transparent text-base text-brand-black placeholder-brand-muted outline-none border-none p-0 focus:ring-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setResults([])
                  }}
                  className="text-brand-muted hover:text-brand-black"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false)
                setIsOpen(false)
              }}
              className="text-sm font-semibold text-brand-black px-2 py-1"
            >
              Cancel
            </button>
          </form>

          {/* Mobile Instant Results List */}
          {isOpen && results.length > 0 && (
            <div className="mt-3 max-h-[60vh] overflow-y-auto divide-y divide-brand-border bg-brand-white rounded-xl border border-brand-border shadow-md">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop?q=${encodeURIComponent(product.name)}`}
                  onClick={() => {
                    setIsOpen(false)
                    setIsMobileSearchOpen(false)
                  }}
                  className="flex items-center gap-3.5 p-3 hover:bg-brand-cream/50 transition-colors"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-brand-cream flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-brand-muted">cake</span>
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-brand-black truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-brand-muted">{product.category}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-black shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full text-center py-3 text-xs font-bold uppercase tracking-wider text-brand-black hover:bg-brand-cream/80 transition-colors"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Desktop Search Instant Dropdown Overlay */}
      {isOpen && query.trim() && (
        <div className="hidden lg:block absolute top-full right-0 mt-2 w-80 bg-brand-white rounded-xl border border-brand-border shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            <div className="p-4 text-center text-xs font-medium text-brand-muted flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-brand-border/60">
              <div className="px-3.5 py-2 bg-brand-cream/40 text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                Matching Desserts
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop?q=${encodeURIComponent(product.name)}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-brand-cream/50 transition-colors group"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-surface-container shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-brand-muted text-[20px]">cake</span>
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate group-hover:text-amber-900 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-brand-muted">{product.category}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-black shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full text-center py-2.5 text-xs font-bold text-brand-black hover:bg-brand-cream transition-colors border-t border-brand-border flex items-center justify-center gap-1.5"
              >
                <span>View all results for "{query}"</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-brand-muted">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
