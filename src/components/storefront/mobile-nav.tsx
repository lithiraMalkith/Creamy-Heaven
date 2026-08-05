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
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const toggleCategoriesAccordion = () => {
    if (isCategoriesOpen) {
      // Collapse categories → also reset any open subcategory
      setExpandedCategory(null)
    }
    setIsCategoriesOpen(!isCategoriesOpen)
  }

  const toggleSubcategoryAccordion = (catId: string) => {
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

          {/* Categories Accordion — wraps all category items */}
          {categories.length > 0 && (
            <div className="flex flex-col">
              {/* Categories Toggle Row */}
              <button
                type="button"
                onClick={toggleCategoriesAccordion}
                className="flex items-center justify-between py-1 w-full text-left group"
                aria-expanded={isCategoriesOpen}
                aria-label="Toggle categories"
              >
                <span className="flex items-center gap-2.5 font-label-md text-label-md text-brand-black text-lg">
                  {/* <span className="material-symbols-outlined text-[20px] text-amber-900/70">grid_view</span> */}
                  Categories
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-amber-900/10 text-amber-950 text-[11px] font-bold leading-none">
                    {categories.length}
                  </span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180 text-amber-800' : 'text-brand-muted'
                    }`}
                />
              </button>

              {/* Collapsible Categories Container — CSS grid-rows transition */}
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isCategoriesOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-1 pl-4 pt-2 pb-1 mt-1 border-l-2 border-amber-800/30">
                    {categories.map((cat) => {
                      const hasSubs = cat.subCategories && cat.subCategories.length > 0
                      const isSubExpanded = expandedCategory === cat.id

                      return (
                        <div key={cat.id} className="flex flex-col">
                          <div className="flex items-center justify-between py-1.5">
                            <Link
                              href={`/shop?category=${encodeURIComponent(cat.name)}`}
                              onClick={closeMenu}
                              className="text-[15px] font-medium text-brand-black hover:text-amber-900 transition-colors flex-grow"
                            >
                              {cat.name}
                            </Link>
                            {hasSubs && (
                              <button
                                type="button"
                                onClick={() => toggleSubcategoryAccordion(cat.id)}
                                className="p-1 text-brand-muted hover:text-brand-black hover:bg-black/5 rounded-md transition-colors"
                                aria-label={`Toggle ${cat.name} subcategories`}
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${isSubExpanded ? 'rotate-180 text-amber-800' : ''
                                    }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Subcategories Nested Accordion */}
                          {hasSubs && (
                            <div
                              className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                              style={{ gridTemplateRows: isSubExpanded ? '1fr' : '0fr' }}
                            >
                              <div className="overflow-hidden">
                                <div className="flex flex-col pl-4 py-1 gap-1.5 border-l-2 border-brand-border my-0.5">
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
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

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
