import { ReactNode } from 'react'
import Link from 'next/link'
import { getCartItemCount } from '@/lib/cart'
import { fetchCategories } from '@/lib/data/categories'
import { GsapProvider } from '@/components/storefront/gsap-provider'
import { MobileNav } from '@/components/storefront/mobile-nav'
import { HeaderNav } from '@/components/storefront/header-nav'
import { StorefrontSearch } from '@/components/storefront/storefront-search'

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const [cartItemCount, categories] = await Promise.all([
    getCartItemCount(),
    fetchCategories(),
  ])

  return (
    <GsapProvider>
      <div className="bg-brand-cream text-brand-black min-h-screen flex flex-col pt-[80px] overflow-x-hidden">
        {/* TopNavBar */}
        <header className="bg-brand-white-translucent fixed top-0 w-full z-50 backdrop-blur-md border-b border-brand-border h-[80px]">
          <div className="flex justify-between items-center px-margin-site-mobile md:px-margin-site h-full max-w-max-width-content mx-auto gap-4">
            <div className="flex items-center gap-8 lg:gap-10">
              <Link href="/" className="text-xl font-bold tracking-[-0.015em] text-[#151413] shrink-0">
                Creamy Heaven
              </Link>

              {/* Desktop Nav */}
              <HeaderNav />
            </div>

            {/* Right Actions: Search + Cart + Account */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Responsive Search Input / Icon Popup */}
              <StorefrontSearch />

              {/* Cart Action */}
              <Link href="/cart" className="relative hover:scale-105 transition-transform duration-200 active:scale-95 text-brand-black p-2 rounded-full hover:bg-black/5" aria-label="Cart">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-black text-brand-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account Action */}
              <Link href="/account" className="hidden sm:flex hover:scale-105 transition-transform duration-200 text-brand-black p-2 rounded-full hover:bg-black/5" aria-label="My Account">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </Link>

              <MobileNav cartItemCount={cartItemCount} categories={categories} />
            </div>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-brand-black text-brand-cream w-full rounded-t-xl mt-auto">
          <div className="px-margin-site-mobile md:px-margin-site pt-section-v-space pb-8 max-w-max-width-content mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
              {/* Column 1 */}
              <div className="col-span-1">
                <div className="font-headline-md text-headline-md mb-4 text-brand-white">Creamy Heaven</div>
                <p className="font-body-md text-body-md text-brand-cream/80 leading-relaxed pr-4">
                  Handcrafted cakes and desserts, baked fresh every morning in Colombo. Delivered island-wide.
                </p>
              </div>

              {/* Column 2 */}
              <div className="col-span-1">
                <h3 className="font-label-md text-label-md uppercase tracking-wider mb-6 text-brand-white">EXPLORE</h3>
                <div className="flex flex-col gap-4">
                  <Link href="/shop" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">Shop</Link>
                  <Link href="/about" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">Our story</Link>
                  <Link href="/faqs" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">FAQs</Link>
                  <Link href="/contact" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">Contact-us</Link>
                </div>
              </div>

              {/* Column 3 */}
              <div className="col-span-1">
                <h3 className="font-label-md text-label-md uppercase tracking-wider mb-6 text-brand-white">CONTACT</h3>
                <div className="flex flex-col gap-4">
                  <a href="tel:+94771234567" className="flex items-center gap-3 font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    +94 77 123 4567
                  </a>
                  <a href="mailto:hi@creamyheaven.lk" className="flex items-center gap-3 font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    hi@creamyheaven.lk
                  </a>
                  <div className="flex items-center gap-3 font-body-md text-body-md text-brand-cream/80">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                    Colombo, Sri Lanka
                  </div>
                </div>
              </div>

              {/* Column 4 */}
              <div className="col-span-1">
                <h3 className="font-label-md text-label-md uppercase tracking-wider mb-6 text-brand-white">FOLLOW</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-body-sm text-body-sm text-brand-cream/60">
                © {new Date().getFullYear()} Creamy Heaven. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </GsapProvider>
  )
}
