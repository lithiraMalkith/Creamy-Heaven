'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Category } from '@/types'

interface MobileNavProps {
  cartItemCount: number
  categories?: Category[]
}

export function MobileNav({ cartItemCount, categories = [] }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const toggleAccordion = (catId: string) => {
    setExpandedCategory(expandedCategory === catId ? null : catId)
  }

  useGSAP(
    () => {
      if (!menuRef.current) return

      if (isOpen) {
        gsap.to(menuRef.current, {
          x: 0,
          duration: 0.4,
          ease: 'power3.out',
        })
      } else {
        gsap.to(menuRef.current, {
          x: '100%',
          duration: 0.3,
          ease: 'power3.in',
        })
      }
    },
    { dependencies: [isOpen] }
  )

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden hover:scale-105 transition-transform duration-300 active:scale-95 text-brand-black ml-2"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-screen w-[300px] bg-brand-cream border-l border-brand-border z-50 flex flex-col transform translate-x-full md:hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <span className="font-headline-sm text-headline-sm text-brand-black">Menu</span>
          <button onClick={closeMenu} className="text-brand-black hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-4 flex-grow overflow-y-auto">
          <Link href="/" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">
            Home
          </Link>
          <Link href="/shop" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">
            Shop All
          </Link>

          {/* Dynamic Categories & Accordion Subcategories */}
          {categories.map((cat) => {
            const hasSubs = cat.subCategories && cat.subCategories.length > 0
            const isExpanded = expandedCategory === cat.id

            return (
              <div key={cat.id} className="flex flex-col">
                <div className="flex items-center justify-between py-1">
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={closeMenu}
                    className="font-label-md text-label-md text-brand-black text-lg flex-grow"
                  >
                    {cat.name}
                  </Link>
                  {hasSubs && (
                    <button
                      type="button"
                      onClick={() => toggleAccordion(cat.id)}
                      className="p-1 text-brand-black hover:bg-black/5 rounded-md"
                      aria-label={`Toggle ${cat.name} subcategories`}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-amber-800' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories Accordion */}
                {hasSubs && isExpanded && (
                  <div className="flex flex-col pl-4 py-1.5 gap-2 border-l-2 border-brand-border my-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {cat.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/shop?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub.name)}`}
                        onClick={closeMenu}
                        className="text-sm text-brand-muted hover:text-brand-black transition-colors py-0.5"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <Link href="/about" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">
            About Us
          </Link>
          <Link href="/contact" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">
            Contact
          </Link>
          <Link href="/faqs" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">
            FAQs
          </Link>

          <hr className="border-brand-border my-2" />

          <Link href="/shop" onClick={closeMenu} className="font-label-md text-label-md text-brand-black flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">search</span>
            Search Products
          </Link>
          <Link href="/account" onClick={closeMenu} className="font-label-md text-label-md text-brand-black flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">person</span>
            My Account
          </Link>
          <Link href="/cart" onClick={closeMenu} className="font-label-md text-label-md text-brand-black flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            Cart {cartItemCount > 0 ? `(${cartItemCount})` : ''}
          </Link>
        </nav>
      </div>
    </>
  )
}
