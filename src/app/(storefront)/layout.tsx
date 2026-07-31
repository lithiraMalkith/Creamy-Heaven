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
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eeedec] px-4 md:px-10 h-16 bg-white/80 backdrop-blur-md sticky top-0 z-[60] max-w-max-width-content mx-auto rounded-b-xl shadow-sm">
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-3 text-[#151413] hover:text-amber-900 transition-colors group shrink-0"
              >
                <div className="w-5 h-5 text-[#151413] flex items-center justify-center shrink-0">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V44Z" fill="currentColor" fillRule="evenodd"></path>
                  </svg>
                </div>
                <h2 className="text-[#151413] text-xl font-bold leading-tight tracking-[-0.015em] font-heading">Creamy Heaven</h2>
              </Link>

              {/* Desktop Nav */}
              <HeaderNav />
            </div>

            {/* Right Actions: Search + Cart + Account + Mobile Nav */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
              <StorefrontSearch />

              {/* Cart Action Button */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 sm:w-auto bg-[#eeedec] hover:bg-[#e4e2e0] text-[#151413] gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-2.5 transition-colors"
                aria-label="Shopping Cart"
              >
                <div className="text-[#151413] flex items-center justify-center" data-icon="ShoppingCart" data-size="20px" data-weight="regular">
                  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"></path>
                  </svg>
                </div>
                {cartItemCount > 0 && (
                  <span className="bg-brand-black text-brand-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account Button */}
              <Link
                href="/account"
                className="hidden sm:flex items-center justify-center rounded-full size-10 bg-[#eeedec] hover:bg-[#e4e2e0] text-[#151413] transition-colors"
                aria-label="My Account"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
              </Link>

              {/* Mobile Drawer Trigger */}
              <MobileNav cartItemCount={cartItemCount} categories={categories} />
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
                  {/* <span className="w-7 h-7 rounded-full bg-brand-cream text-brand-black flex items-center justify-center font-serif text-xs font-bold">
                    C
                  </span> */}
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
                  {/* TikTok */}
                  <a
                    href={settings.socialLinks?.tiktok || 'https://www.tiktok.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all"
                    aria-label="TikTok"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.47V8.98a6.33 6.33 0 0 0-5.83 6.3 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.64a8.28 8.28 0 0 0 4.84 1.54V7.74a4.85 4.85 0 0 1-1.58-1.05z" />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href={settings.socialLinks?.facebook || 'https://www.facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all"
                    aria-label="Facebook"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href={settings.socialLinks?.instagram || 'https://www.instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center text-brand-cream hover:bg-brand-white hover:text-brand-black transition-all"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
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
