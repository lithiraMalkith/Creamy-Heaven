'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

interface MobileNavProps {
  cartItemCount: number
}

export function MobileNav({ cartItemCount }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  useGSAP(() => {
    if (!menuRef.current) return
    
    if (isOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out'
      })
    } else {
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in'
      })
    }
  }, { dependencies: [isOpen] })

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
        className="fixed top-0 right-0 h-screen w-[280px] bg-brand-cream border-l border-brand-border z-50 flex flex-col transform translate-x-full md:hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <span className="font-headline-sm text-headline-sm text-brand-black">Menu</span>
          <button onClick={closeMenu} className="text-brand-black hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-6 flex-grow">
          <Link href="/" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">Home</Link>
          <Link href="/shop" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">Shop</Link>
          <Link href="/about" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">About</Link>
          <Link href="/contact" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">Contact</Link>
          <Link href="/faqs" onClick={closeMenu} className="font-label-md text-label-md text-brand-black text-lg">FAQs</Link>
          
          <hr className="border-brand-border my-2" />
          
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
