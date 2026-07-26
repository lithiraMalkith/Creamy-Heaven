'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {items.map((item) => {
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-brand-black text-brand-white shadow-sm'
                : 'text-brand-black-soft hover:text-brand-black hover:bg-brand-cream'
            }`}
          >
            <span className={isActive ? 'text-brand-white' : 'text-brand-muted'}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
