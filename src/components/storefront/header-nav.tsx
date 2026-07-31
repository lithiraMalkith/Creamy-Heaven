'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HeaderNav() {
  const pathname = usePathname()

  const links = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
    { href: '/faqs', label: 'FAQs' },
  ]

  return (
    <nav className="hidden md:flex items-center gap-9">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href.startsWith('/shop') && pathname === '/shop')
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[#151413] text-sm font-medium leading-normal hover:text-amber-900 transition-colors ${
              isActive ? 'font-bold text-amber-950 underline underline-offset-4 decoration-amber-900/40' : ''
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
