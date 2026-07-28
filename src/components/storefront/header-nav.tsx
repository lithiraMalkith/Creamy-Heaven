'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HeaderNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
    { href: '/faqs', label: 'FAQs' },
  ]

  return (
    <nav className="hidden md:flex items-center gap-1 bg-brand-cream/40 p-1.5 rounded-full border border-brand-border/40 shadow-inner">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
              isActive
                ? 'bg-brand-black text-brand-white shadow-sm font-bold scale-[1.02]'
                : 'text-brand-black/70 hover:text-brand-black hover:bg-black/5'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
