'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HeaderNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/faqs', label: 'FAQs' },
  ]

  return (
    <nav className="hidden md:flex gap-7 lg:gap-9 items-center text-sm font-bold text-[#151413]">
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors py-2 ${
              isActive ? 'text-amber-900 font-extrabold' : 'hover:text-brand-muted'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
