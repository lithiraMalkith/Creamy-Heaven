import { ReactNode } from 'react'
import Link from 'next/link'
import { getCartItemCount } from '@/lib/cart'
import { fetchCategories } from '@/lib/data/categories'
import { fetchSettings } from '@/lib/data/settings'
import { GsapProvider } from '@/components/storefront/gsap-provider'
import { MobileNav } from '@/components/storefront/mobile-nav'
import { HeaderNav } from '@/components/storefront/header-nav'
import { StorefrontSearch } from '@/components/storefront/storefront-search'
import { AnnouncementBar } from '@/components/storefront/announcement-bar'

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const [cartItemCount, categories, settings] = await Promise.all([
    getCartItemCount(),
    fetchCategories(),
    fetchSettings(),
  ])

  return (
    <GsapProvider>
      <div className="bg-brand-cream text-brand-black min-h-screen flex flex-col pt-[116px] overflow-x-hidden">
        {/* Top Fixed Header Wrapper */}
        <div className="fixed top-0 w-full z-50">
          {/* Top Announcement Bar */}
          <AnnouncementBar
            announcements={settings.announcements}
            enabled={settings.announcementsEnabled ?? true}
          />

          {/* Header Navigation */}
          <header className="bg-brand-white/85 backdrop-blur-lg border-b border-brand-border/60 shadow-sm h-[76px] transition-all">
            <div className="flex justify-between items-center px-margin-site-mobile md:px-margin-site h-full max-w-max-width-content mx-auto gap-4">
              {/* Brand Logo & Main Nav */}
              <div className="flex items-center gap-6 lg:gap-10">
                <Link
                  href="/"
                  className="font-heading text-2xl font-bold tracking-tight text-brand-black hover:text-amber-900 transition-colors flex items-center gap-2 group shrink-0"
                >
                  {/* <span className="w-8 h-8 rounded-full bg-brand-black text-brand-cream flex items-center justify-center font-serif text-sm font-extrabold group-hover:scale-105 transition-transform">
                    C
                  </span> */}
                  <span>Creamy Heaven</span>
                </Link>

                {/* Desktop Nav */}
                <HeaderNav />
              </div>

              {/* Right Actions: Search + Cart + Account + Mobile Nav */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <StorefrontSearch />

                {/* Cart Action Button */}
                <Link
                  href="/cart"
                  className="relative p-2.5 rounded-full hover:bg-black/5 text-brand-black transition-all duration-200 hover:scale-105 active:scale-95 group"
                  aria-label="Shopping Cart"
                >
                  <span className="material-symbols-outlined text-[22px] group-hover:text-amber-900 transition-colors">
                    shopping_bag
                  </span>
                  {cartItemCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-brand-black text-brand-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold shadow-md animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Account Button */}
                <Link
                  href="/account"
                  className="hidden sm:flex p-2.5 rounded-full hover:bg-black/5 text-brand-black transition-all duration-200 hover:scale-105 group"
                  aria-label="My Account"
                >
                  <span className="material-symbols-outlined text-[22px] group-hover:text-amber-900 transition-colors">
                    person
                  </span>
                </Link>

                {/* Mobile Drawer Trigger */}
                <MobileNav cartItemCount={cartItemCount} categories={categories} />
              </div>
            </div>
          </header>
        </div>

        {/* Main Canvas */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-brand-black text-brand-cream w-full rounded-t-2xl mt-auto shadow-2xl border-t border-brand-white/10">
          <div className="px-margin-site-mobile md:px-margin-site pt-section-v-space pb-8 max-w-max-width-content mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
              {/* Column 1 */}
              <div className="col-span-1">
                <div className="font-heading text-2xl font-bold mb-4 text-brand-white tracking-tight flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-brand-cream text-brand-black flex items-center justify-center font-serif text-xs font-bold">
                    C
                  </span>
                  Creamy Heaven
                </div>
                <p className="font-body-md text-body-md text-brand-cream/80 leading-relaxed pr-4">
                  Handcrafted cakes and desserts, baked fresh every morning in Colombo. Delivered island-wide.
                </p>
              </div>

              {/* Column 2 */}
              <div className="col-span-1">
                <h3 className="font-label-md text-label-md uppercase tracking-wider mb-6 text-brand-white font-semibold">
                  EXPLORE
                </h3>
                <div className="flex flex-col gap-3">
                  <Link href="/shop" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">Shop All</Link>
                  <Link href="/about" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">Our Story</Link>
                  <Link href="/faqs" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">FAQs</Link>
                  <Link href="/contact" className="font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">Contact Us</Link>
                </div>
              </div>

              {/* Column 3 */}
              <div className="col-span-1">
                <h3 className="font-label-md text-label-md uppercase tracking-wider mb-6 text-brand-white font-semibold">
                  CONTACT
                </h3>
                <div className="flex flex-col gap-3">
                  <a href={`tel:${settings.ownerPhone || '+94771234567'}`} className="flex items-center gap-3 font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    {settings.ownerPhone || '+94 77 123 4567'}
                  </a>
                  <a href={`mailto:${settings.ownerEmail || 'hi@creamyheaven.lk'}`} className="flex items-center gap-3 font-body-md text-body-md text-brand-cream/80 hover:text-brand-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    {settings.ownerEmail || 'hi@creamyheaven.lk'}
                  </a>
                  <div className="flex items-center gap-3 font-body-md text-body-md text-brand-cream/80">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                    Colombo, Sri Lanka
                  </div>
                </div>
              </div>

              {/* Column 4 */}
              <div className="col-span-1">
                <h3 className="font-label-md text-label-md uppercase tracking-wider mb-6 text-brand-white font-semibold">
                  FOLLOW US
                </h3>
                <div className="flex gap-3">
                  {settings.socialLinks?.instagram && (
                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all">
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                  )}
                  {settings.socialLinks?.facebook && (
                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all">
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                  )}
                  {settings.socialLinks?.tiktok && (
                    <a href={settings.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all font-bold text-xs">
                      TT
                    </a>
                  )}
                  {!settings.socialLinks?.instagram && !settings.socialLinks?.facebook && !settings.socialLinks?.tiktok && (
                    <span className="text-xs text-brand-cream/60">@creamyheaven</span>
                  )}
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
