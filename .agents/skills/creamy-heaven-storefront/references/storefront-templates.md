# Storefront Code Templates — Copy-Paste-Ready Patterns

These templates complement the admin panel's `templates.md`. They cover every storefront-
specific file type. `Product` and other entity names are real — these are ready to use.

---

## Template S1: Storefront Layout (`(storefront)/layout.tsx`)

```tsx
import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { getCartItemCount } from '@/lib/cart'
import { FlashMessage } from '@/components/flash-message'

const NAV_LINKS = [
  { label: 'Home',    href: '/' },
  { label: 'Shop',    href: '/shop' },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQs',    href: '/faqs' },
]

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cartCount = await getCartItemCount()

  return (
    <>
      {/* Mobile nav toggle (CSS-only) */}
      <input type="checkbox" id="mobile-nav" className="peer hidden" />

      {/* Header */}
      <header className="bg-brand-white/90 backdrop-blur-md border-b border-brand-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Mobile hamburger */}
          <label htmlFor="mobile-nav" className="md:hidden p-2 -ml-2 cursor-pointer text-brand-black">
            <Menu className="w-5 h-5" />
          </label>

          {/* Logo */}
          <Link href="/" className="font-heading text-2xl font-bold text-brand-black">
            Creamy Heaven
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-black-soft hover:text-brand-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart icon */}
          <Link href="/cart" className="relative btn-hover p-2 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-brand-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-black text-brand-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <label
        htmlFor="mobile-nav"
        className="hidden peer-checked:block fixed inset-0 bg-brand-black/40 z-40 md:hidden"
      />

      {/* Mobile nav panel */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-brand-white border-r border-brand-border z-50
                       -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-brand-border">
          <span className="font-heading text-lg font-bold text-brand-black">Menu</span>
          <label htmlFor="mobile-nav" className="p-1 cursor-pointer text-brand-muted hover:text-brand-black">
            <X className="w-5 h-5" />
          </label>
        </div>
        <div className="py-4 px-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brand-black-soft hover:text-brand-black hover:bg-brand-cream transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-black text-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">Creamy Heaven</h3>
            <p className="text-sm text-brand-white/60 leading-relaxed">
              Handcrafted cakes & desserts, made with love and delivered fresh across Sri Lanka.
            </p>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-3 text-brand-white/40">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[...NAV_LINKS, { label: 'Delivery Policy', href: '/delivery-policy' }].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-white/60 hover:text-brand-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-3 text-brand-white/40">
              Follow Us
            </h4>
            {/* Fetch social links from SiteSettings server-side */}
            <p className="text-sm text-brand-white/60">TikTok · Instagram · Facebook</p>
          </div>
        </div>
        <div className="border-t border-brand-white/10 py-6 text-center">
          <p className="text-xs text-brand-white/30">
            © {new Date().getFullYear()} Creamy Heaven. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
```

---

## Template S2: Home Page (`(storefront)/page.tsx`)

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchFeaturedProducts } from '@/lib/data/products'
import { ProductCard } from '@/components/storefront/product-card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creamy Heaven — Handcrafted Cakes & Desserts',
  description: 'Order handcrafted cakes, cupcakes, and desserts online. Fresh delivery across Sri Lanka. Cash on Delivery available.',
}

export default async function HomePage() {
  const featured = await fetchFeaturedProducts()

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background image — replace src with Cloudinary URL */}
        <img
          src="/hero-placeholder.jpg"
          alt="Creamy Heaven bakery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-brand-white mb-4">
            Creamy Heaven
          </h1>
          <p className="text-lg md:text-xl text-brand-white/80 mb-8 max-w-lg mx-auto font-body">
            Handcrafted cakes & desserts, made with love
          </p>
          <Link
            href="/shop"
            className="btn-hover inline-flex items-center gap-2 px-8 py-3 bg-brand-white text-brand-black rounded-lg text-sm font-semibold"
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-fade-in-up text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-brand-black">
            Our Bestsellers
          </h2>
          <p className="text-brand-muted mt-2 font-body">Freshly made, loved by all</p>
        </div>
        <div className="animate-in-stagger grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="btn-hover inline-flex items-center gap-2 px-6 py-2.5 border border-brand-border rounded-lg text-sm font-medium text-brand-black hover:bg-brand-cream transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Promise Strip */}
      <section className="bg-brand-black py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-brand-white/80 text-sm font-body">
          <span>🎂 Fresh Daily</span>
          <span>💰 Cash on Delivery</span>
          <span>🚚 Island-Wide Delivery</span>
          <span>🎁 Custom Orders Welcome</span>
        </div>
      </section>

      {/* About Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-2xl bg-brand-cream overflow-hidden">
            {/* About image — replace with Cloudinary URL */}
            <div className="w-full h-full flex items-center justify-center text-brand-muted">
              Bakery image
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-semibold text-brand-black">Our Story</h2>
            <p className="text-brand-black-soft leading-relaxed font-body">
              At Creamy Heaven, every cake tells a story. We handcraft each dessert with the finest
              ingredients, bringing joy to celebrations across Sri Lanka.
            </p>
            <Link
              href="/about"
              className="btn-hover inline-flex items-center gap-2 text-sm font-semibold text-brand-black"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
```

---

## Template S3: Product Card Component

```tsx
// components/storefront/product-card.tsx — Server Component
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.availabilityStatus === 'out_of_stock'

  return (
    <Link href={`/shop/${product.slug}`} className="group card-hover block">
      <div className="aspect-square overflow-hidden rounded-xl bg-brand-cream relative">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted text-sm">
            No image
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-brand-white/60 flex items-center justify-center">
            <span className="px-3 py-1 bg-brand-black text-brand-white text-xs font-semibold rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-brand-muted uppercase tracking-wider font-body">{product.category}</p>
        <h3 className="font-heading text-lg font-semibold text-brand-black group-hover:text-brand-black-soft transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="font-body text-base font-semibold tabular-nums text-brand-black">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
```

---

## Template S4: Add to Cart Button (Client Component — Allowed Exception)

```tsx
// components/storefront/add-to-cart-button.tsx
'use client'

import { useState, useTransition } from 'react'
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react'
import { addToCart } from '@/app/(storefront)/cart/actions'

export function AddToCartButton({
  productId,
  disabled = false,
}: {
  productId: string
  disabled?: boolean
}) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    const formData = new FormData()
    formData.set('productId', productId)
    formData.set('quantity', String(quantity))

    startTransition(async () => {
      await addToCart(formData)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    })
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-brand-black">Qty:</span>
        <div className="flex items-center border border-brand-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-brand-muted hover:text-brand-black hover:bg-brand-cream transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 text-brand-muted hover:text-brand-black hover:bg-brand-cream transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || isPending}
        className={`btn-hover w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors ${
          added
            ? 'bg-brand-success text-brand-white'
            : disabled
              ? 'bg-brand-muted/20 text-brand-muted cursor-not-allowed'
              : 'bg-brand-black text-brand-white'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Added to Cart
          </>
        ) : disabled ? (
          'Sold Out'
        ) : isPending ? (
          <span className="animate-spin w-4 h-4 border-2 border-brand-white/30 border-t-brand-white rounded-full" />
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}
```

---

## Template S5: Cart Library (`lib/cart.ts`)

```typescript
import { cookies } from 'next/headers'

export interface CartItem {
  productId: string
  quantity: number
}

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('cart')?.value
  if (!raw) return []
  try {
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart()
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

export async function setCart(items: CartItem[]): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('cart', JSON.stringify(items), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    sameSite: 'lax',
  })
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('cart', '[]', { path: '/', maxAge: 0 })
}
```

---

## Template S6: FAQ Page (CSS-Only Accordion)

```tsx
// app/(storefront)/faqs/page.tsx — Server Component
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQs — Creamy Heaven',
  description: 'Frequently asked questions about ordering, delivery, and our products.',
}

const FAQS = [
  {
    question: 'Do you offer delivery across Sri Lanka?',
    answer: 'Yes! We deliver island-wide. Delivery fees vary by zone — check our Delivery Policy page for details.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We currently accept Cash on Delivery (COD). Online payment options are coming soon.',
  },
  {
    question: 'How far in advance should I place a custom cake order?',
    answer: 'We recommend placing custom cake orders at least 48 hours in advance. Lead times vary by product and are shown on each product page.',
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'You can request changes by contacting us before your order moves to "Processing" status. Once processing begins, modifications may not be possible.',
  },
  {
    question: 'Do you cater for allergies?',
    answer: 'All allergen information is listed on each product page. If you have specific dietary requirements, please contact us before ordering.',
  },
]

export default function FAQsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-brand-black">
          Frequently Asked Questions
        </h1>
        <p className="text-brand-muted mt-2 font-body">
          Everything you need to know about ordering from Creamy Heaven
        </p>
      </div>

      <div className="animate-in-stagger space-y-3">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="faq-item bg-brand-white rounded-xl border border-brand-border overflow-hidden group"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-brand-black font-medium hover:bg-brand-cream/50 transition-colors">
              <span>{faq.question}</span>
              <span className="text-brand-muted text-lg transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-6 pb-4 text-brand-black-soft text-sm leading-relaxed font-body">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
```

---

## Template S7: Checkout Server Action (`(storefront)/checkout/actions.ts`)

See Template 7 in `references/templates.md` (admin panel templates) — the `placeOrder`
Server Action pattern there is the definitive version. Key reminders:

1. Validate with `checkoutSchema.safeParse()`
2. Read cart from cookie via `getCart()`
3. **Re-fetch every product price from Firestore** — never trust the cart cookie's prices
4. Check stock for each item — redirect to `/cart` with error if insufficient
5. Create the order document in Firestore
6. Decrement `stockQty` using `FieldValue.increment(-quantity)` for each item
7. Clear the cart cookie via `clearCart()`
8. Fire confirmation + admin alert emails (fire-and-forget with `.catch()`)
9. `revalidatePath('/admin/orders')` so the admin panel sees the new order
10. `redirect(\`/order-confirmation/${docRef.id}?ref=${orderRef}\`)`

---

## Template S8: Contact Form Server Action

```typescript
// app/(storefront)/contact/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  body: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactMessage(formData: FormData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const msg = encodeURIComponent(
      Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Please check your details'
    )
    redirect(`/contact?flash=error:${msg}`)
  }

  await adminDb.collection('messages').add({
    ...parsed.data,
    status: 'unread',
    createdAt: new Date(),
  })

  redirect('/contact?flash=success:Message sent! We\'ll get back to you soon.')
}
```

---

## Template S9: Checkout Page (`(storefront)/checkout/page.tsx`)

```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, MapPin } from 'lucide-react'
import { getCart } from '@/lib/cart'
import { getCustomerSession } from '@/lib/customer-session'
import { fetchProduct } from '@/lib/data/products'
import { fetchSiteSettings } from '@/lib/data/settings'
import { formatPrice } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'
import { placeOrder } from './actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout — Creamy Heaven',
  description: 'Complete your order. Cash on Delivery available across Sri Lanka.',
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  const { flash } = await searchParams
  const cartItems = await getCart()

  if (cartItems.length === 0) {
    redirect('/cart?flash=error:Your cart is empty')
  }

  // Resolve product details for each cart item (server-side price truth)
  const resolvedItems = await Promise.all(
    cartItems.map(async (item) => {
      const product = await fetchProduct(item.productId)
      return product
        ? { ...item, product }
        : null
    })
  )
  const validItems = resolvedItems.filter(Boolean) as Array<{
    productId: string
    quantity: number
    product: NonNullable<Awaited<ReturnType<typeof fetchProduct>>>
  }>

  const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Fetch delivery zones for zone selection
  const settings = await fetchSiteSettings()
  const deliveryZones = settings?.deliveryZones?.filter((z) => z.isActive) ?? []

  // Pre-fill customer info if logged in
  const session = await getCustomerSession()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FlashMessage value={flash} />

      {/* Breadcrumb */}
      <nav className="text-sm text-brand-muted mb-6 font-body">
        <Link href="/" className="hover:text-brand-black">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/cart" className="hover:text-brand-black">Cart</Link>
        <span className="mx-2">›</span>
        <span className="text-brand-black">Checkout</span>
      </nav>

      <h1 className="animate-fade-in-up font-heading text-3xl font-bold text-brand-black mb-8">
        Checkout
      </h1>

      <form action={placeOrder} className="checkout-form grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — Form Fields (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer Information */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 animate-fade-in-up">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="text-sm font-medium text-brand-black">Full Name</label>
                <input
                  id="name" name="name" required
                  defaultValue={session?.name ?? ''}
                  className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-brand-black">Email</label>
                <input
                  id="email" name="email" type="email" required
                  defaultValue={session?.email ?? ''}
                  className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-brand-black">Phone</label>
                <input
                  id="phone" name="phone" type="tel" required
                  placeholder="+94 XX XXX XXXX"
                  pattern="^(?:\+94|0)\d{9}$"
                  className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Fulfilment Type */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 animate-fade-in-up">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">
              Fulfilment
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-4 border border-brand-border rounded-lg cursor-pointer has-[:checked]:border-brand-black has-[:checked]:bg-brand-cream/50 transition-colors">
                <input type="radio" name="fulfilmentType" value="delivery" defaultChecked className="accent-brand-black" />
                <Truck className="w-5 h-5 text-brand-black" />
                <span className="text-sm font-medium text-brand-black">Delivery</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-brand-border rounded-lg cursor-pointer has-[:checked]:border-brand-black has-[:checked]:bg-brand-cream/50 transition-colors">
                <input type="radio" name="fulfilmentType" value="pickup" className="accent-brand-black" />
                <Package className="w-5 h-5 text-brand-black" />
                <span className="text-sm font-medium text-brand-black">Pickup</span>
              </label>
            </div>
          </div>

          {/* Delivery Address — shown only when delivery is selected (CSS :has) */}
          <div className="delivery-address bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 animate-fade-in-up">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="addressLine1" className="text-sm font-medium text-brand-black">Address Line 1</label>
                <input id="addressLine1" name="addressLine1" className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="addressLine2" className="text-sm font-medium text-brand-black">Address Line 2 (optional)</label>
                <input id="addressLine2" name="addressLine2" className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div>
                <label htmlFor="city" className="text-sm font-medium text-brand-black">City</label>
                <input id="city" name="city" className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div>
                <label htmlFor="district" className="text-sm font-medium text-brand-black">District</label>
                <select id="district" name="district" className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1">
                  <option value="">Select district</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Kandy">Kandy</option>
                  {/* Add all 25 Sri Lankan districts */}
                </select>
              </div>
              <div>
                <label htmlFor="postalCode" className="text-sm font-medium text-brand-black">Postal Code</label>
                <input id="postalCode" name="postalCode" className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1" />
              </div>
            </div>

            {/* Delivery Zone Selection */}
            {deliveryZones.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-brand-black">Delivery Zone</p>
                {deliveryZones.map((zone) => (
                  <label key={zone.id} className="flex items-center justify-between p-3 border border-brand-border rounded-lg cursor-pointer has-[:checked]:border-brand-black has-[:checked]:bg-brand-cream/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <input type="radio" name="deliveryZone" value={zone.id} className="accent-brand-black" />
                      <span className="text-sm text-brand-black">{zone.name}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatPrice(zone.fee)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Order Notes */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 animate-fade-in-up">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Order Notes</h2>
            <textarea
              name="notes"
              rows={3}
              maxLength={500}
              placeholder="Any special requests? Cake message text, preferred delivery time..."
              className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 resize-none"
            />
          </div>
        </div>

        {/* Right — Order Summary (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 sticky top-20 animate-fade-in-up">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Order Summary</h2>

            <div className="divide-y divide-brand-border">
              {validItems.map((item) => (
                <div key={item.productId} className="flex gap-3 py-3">
                  <div className="w-14 h-14 rounded-lg bg-brand-cream overflow-hidden shrink-0">
                    {item.product.images[0] && (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">{item.product.name}</p>
                    <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-brand-black shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Delivery</span>
                <span className="font-medium tabular-nums text-brand-muted">Calculated at zone selection</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-brand-border pt-2">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="bg-brand-cream/50 rounded-lg p-3 text-xs text-brand-muted text-center">
              💰 Cash on Delivery — pay when your order arrives
            </div>

            <button
              type="submit"
              className="btn-hover w-full bg-brand-black text-brand-white py-3 rounded-lg font-semibold text-sm"
            >
              Place Order (COD)
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
```

---

## Template S10: About Us Page (`(storefront)/about/page.tsx`)

```tsx
import Link from 'next/link'
import { ArrowRight, Cake, Leaf, Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Creamy Heaven',
  description: 'Learn about Creamy Heaven — handcrafted cakes and desserts made with love in Sri Lanka. Freshly baked, delivered island-wide.',
}

const VALUES = [
  {
    icon: Cake,
    title: 'Freshly Made',
    description: 'Every order is baked fresh to perfection. We never use frozen or pre-made bases — your cake is crafted from scratch.',
  },
  {
    icon: Leaf,
    title: 'Quality Ingredients',
    description: 'We source premium, locally available ingredients to ensure every bite is rich, flavorful, and unforgettable.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each creation is handcrafted with care and attention to detail, bringing joy to every celebration across Sri Lanka.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-cream" />
        {/* Replace with Cloudinary bakery image */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-brand-black mb-4">
            Our Story
          </h1>
          <p className="text-lg text-brand-black-soft max-w-lg mx-auto font-body">
            Handcrafted with love in Sri Lanka
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-brand-black">
              Who We Are
            </h2>
            <p className="text-brand-black-soft leading-relaxed font-body">
              At Creamy Heaven, every cake tells a story. What started as a passion for baking
              in a small kitchen has grown into a beloved bakery serving celebrations across
              Sri Lanka. We believe that the best desserts are made with love, patience, and
              the finest ingredients.
            </p>
            <p className="text-brand-black-soft leading-relaxed font-body">
              From elaborate wedding cakes to simple cupcakes for a Tuesday treat, we pour
              the same dedication and craftsmanship into every creation. Our recipes blend
              time-honored techniques with modern flavors to create desserts that are as
              beautiful as they are delicious.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-brand-cream overflow-hidden">
            {/* Replace with Cloudinary bakery/team image */}
            <div className="w-full h-full flex items-center justify-center text-brand-muted font-body">
              Bakery image
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-cream/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-brand-black">
              Our Promise
            </h2>
            <p className="text-brand-muted mt-2 font-body">What sets us apart</p>
          </div>
          <div className="animate-in-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 card-hover text-center"
              >
                <div className="w-14 h-14 bg-brand-cream rounded-xl flex items-center justify-center mx-auto">
                  <value.icon className="w-7 h-7 text-brand-black" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-black">{value.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed font-body">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-fade-in-up space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-brand-black">
            Ready to Order?
          </h2>
          <p className="text-brand-muted font-body max-w-md mx-auto">
            Browse our collection of handcrafted cakes and desserts, or get in touch for a custom creation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="btn-hover inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-white rounded-lg text-sm font-semibold"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="btn-hover inline-flex items-center gap-2 px-6 py-3 border border-brand-border text-brand-black rounded-lg text-sm font-semibold hover:bg-brand-cream transition-colors"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
```

---

## Template S11: Contact Us Page (`(storefront)/contact/page.tsx`)

```tsx
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { submitContactMessage } from './actions'
import { FlashMessage } from '@/components/flash-message'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Creamy Heaven',
  description: 'Get in touch with Creamy Heaven. Questions about custom cakes, delivery, or orders? We\'re here to help.',
}

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Custom Cake Order',
  'Delivery Question',
  'Feedback',
  'Other',
]

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  const { flash } = await searchParams

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-black">
          Contact Us
        </h1>
        <p className="text-brand-muted mt-2 font-body text-lg">
          We'd love to hear from you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up">

        {/* Contact Form (3/5) */}
        <div className="lg:col-span-3">
          <form
            action={submitContactMessage}
            className="bg-brand-white rounded-xl border border-brand-border p-6 md:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium text-brand-black">
                  Full Name <span className="text-brand-danger">*</span>
                </label>
                <input
                  id="contact-name" name="name" required minLength={2}
                  className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium text-brand-black">
                  Email <span className="text-brand-danger">*</span>
                </label>
                <input
                  id="contact-email" name="email" type="email" required
                  className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-phone" className="text-sm font-medium text-brand-black">
                  Phone (optional)
                </label>
                <input
                  id="contact-phone" name="phone" type="tel"
                  className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
                  placeholder="+94 XX XXX XXXX"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="text-sm font-medium text-brand-black">
                  Subject <span className="text-brand-danger">*</span>
                </label>
                <select
                  id="contact-subject" name="subject" required
                  className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Select a subject</option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-body" className="text-sm font-medium text-brand-black">
                Message <span className="text-brand-danger">*</span>
              </label>
              <textarea
                id="contact-body" name="body" required minLength={10}
                rows={5}
                className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1 resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              className="btn-hover w-full sm:w-auto bg-brand-black text-brand-white px-8 py-3 rounded-lg font-semibold text-sm"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Business Info (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-5">
            <h2 className="font-heading text-xl font-semibold text-brand-black">Get in Touch</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-brand-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-black">Phone</p>
                  <a href="tel:+94XXXXXXXXX" className="text-sm text-brand-muted hover:text-brand-black transition-colors">
                    +94 XX XXX XXXX
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-brand-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-black">Email</p>
                  <a href="mailto:hello@creamyheaven.lk" className="text-sm text-brand-muted hover:text-brand-black transition-colors">
                    hello@creamyheaven.lk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-black">Location</p>
                  <p className="text-sm text-brand-muted">Colombo, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-brand-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-black">Hours</p>
                  <p className="text-sm text-brand-muted">Mon — Sat: 9:00 AM — 6:00 PM</p>
                  <p className="text-sm text-brand-muted">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-3">
            <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Follow Us</h3>
            <div className="flex gap-3">
              {/* Fetch from SiteSettings.socialLinks, or hardcode */}
              <a href="#" className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-brand-white transition-colors">
                {/* TikTok icon */}
                <span className="text-sm font-bold">Tk</span>
              </a>
              <a href="#" className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-brand-white transition-colors">
                {/* Instagram icon */}
                <span className="text-sm font-bold">Ig</span>
              </a>
              <a href="#" className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-brand-white transition-colors">
                {/* Facebook icon */}
                <span className="text-sm font-bold">Fb</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Template S12: Customer Session Library (`lib/customer-session.ts`)

```typescript
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth } from '@/lib/firebase-admin'

export interface CustomerSessionData {
  uid: string
  email: string
  name?: string
}

/**
 * Get the current customer session from the `customer-session` cookie.
 * Returns null if no session or if the session is invalid/expired.
 */
export async function getCustomerSession(): Promise<CustomerSessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('customer-session')?.value
  if (!sessionCookie) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return {
      uid: decoded.uid,
      email: decoded.email ?? '',
      name: decoded.name ?? undefined,
    }
  } catch {
    return null
  }
}

/**
 * Require a valid customer session. Redirects to login if not authenticated.
 * Use at the top of every account page and account Server Action.
 */
export async function requireCustomerAuth(): Promise<CustomerSessionData> {
  const session = await getCustomerSession()
  if (!session) redirect('/customer-login')
  return session
}
```

---

## Template S13: Customer Session API Route (`api/auth/customer-session/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 })
    }

    // Verify the ID token and create a session cookie
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_MS,
    })

    const response = NextResponse.json({ success: true, uid: decodedToken.uid })
    response.cookies.set('customer-session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 5, // 5 days in seconds
    })

    return response
  } catch (error) {
    console.error('Customer session creation failed:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('customer-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
```

---

## Template S14: Account Layout (`(storefront)/account/layout.tsx`)

```tsx
import Link from 'next/link'
import { Package, User, MapPin, LogOut } from 'lucide-react'
import { requireCustomerAuth } from '@/lib/customer-session'
import { customerSignOut } from './actions'

const ACCOUNT_NAV = [
  { label: 'My Orders',    href: '/account/orders',    icon: Package },
  { label: 'My Profile',   href: '/account/profile',   icon: User },
  { label: 'My Addresses', href: '/account/addresses',  icon: MapPin },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCustomerAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar (desktop) / Tab bar (mobile) */}
        <aside className="lg:col-span-1">
          <div className="bg-brand-white rounded-xl border border-brand-border p-4 space-y-4 lg:sticky lg:top-20">
            {/* User info */}
            <div className="pb-4 border-b border-brand-border">
              <p className="font-heading text-lg font-semibold text-brand-black truncate">
                {session.name ?? 'Customer'}
              </p>
              <p className="text-xs text-brand-muted truncate">{session.email}</p>
            </div>

            {/* Nav links */}
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {ACCOUNT_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-black-soft hover:text-brand-black hover:bg-brand-cream transition-colors whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Sign out */}
            <div className="pt-4 border-t border-brand-border">
              <form action={customerSignOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-brand-danger hover:bg-brand-danger/5 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  )
}
```

---

## Template S15: Account Dashboard (`(storefront)/account/page.tsx`)

```tsx
import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'
import { requireCustomerAuth } from '@/lib/customer-session'
import { fetchCustomerOrders } from '@/lib/data/orders'
import { formatPrice, formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account — Creamy Heaven',
  description: 'Manage your Creamy Heaven account, view order history, and update your profile.',
}

export default async function AccountDashboardPage() {
  const session = await requireCustomerAuth()
  const recentOrders = await fetchCustomerOrders(session.uid, { limit: 5 })

  const totalOrders = recentOrders.length // TODO: fetch from customer aggregate
  const totalSpent = recentOrders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = recentOrders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="animate-fade-in-up">
        <h1 className="font-heading text-2xl font-semibold text-brand-black">
          Welcome back, {session.name ?? 'there'}!
        </h1>
        <p className="text-brand-muted text-sm mt-1 font-body">Here's a summary of your account</p>
      </div>

      {/* Quick Stats */}
      <div className="animate-in-stagger grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: totalOrders, icon: Package },
          { label: 'Total Spent', value: formatPrice(totalSpent), icon: Package },
          { label: 'Pending', value: pendingOrders, icon: Package },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-brand-white rounded-xl border border-brand-border p-4 card-hover"
          >
            <p className="text-xs text-brand-muted uppercase tracking-wider font-body">{stat.label}</p>
            <p className="font-heading text-2xl font-semibold text-brand-black mt-1 tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="animate-fade-in-up space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-brand-black">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-brand-muted hover:text-brand-black transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-brand-white rounded-xl border border-brand-border p-8 text-center">
            <Package className="w-10 h-10 text-brand-muted mx-auto mb-3" />
            <p className="text-brand-muted text-sm font-body">No orders yet</p>
            <Link
              href="/shop"
              className="btn-hover inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between bg-brand-white rounded-xl border border-brand-border p-4 card-hover group"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-brand-black font-body tabular-nums">
                    {order.orderRef}
                  </p>
                  <p className="text-xs text-brand-muted font-body tabular-nums">
                    {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-semibold tabular-nums text-brand-black">
                    {formatPrice(order.total)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-black transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## Template S16: Account Order Detail (`(storefront)/account/orders/[id]/page.tsx`)

```tsx
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import { requireCustomerAuth } from '@/lib/customer-session'
import { fetchOrder } from '@/lib/data/orders'
import { formatPrice, formatDate } from '@/lib/utils'

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'dispatched', 'completed'] as const

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await requireCustomerAuth()
  const { id } = await params
  const order = await fetchOrder(id)

  if (!order) notFound()

  // CRITICAL: Verify this order belongs to the logged-in customer
  if (order.customer.uid !== session.uid) {
    redirect('/account/orders?flash=error:Order not found')
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number])

  return (
    <div className="space-y-6">
      {/* Back link + heading */}
      <div className="animate-fade-in-up flex items-center gap-3">
        <Link
          href="/account/orders"
          className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">
            Order #{order.orderRef}
          </h1>
          <p className="text-sm text-brand-muted font-body tabular-nums">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="animate-fade-in-up bg-brand-white rounded-xl border border-brand-border p-6">
        <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
          Order Status
        </h2>
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((step, i) => {
            const isCompleted = i <= currentStepIndex
            const isCurrent = i === currentStepIndex
            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div className={`flex-1 h-0.5 ${i <= currentStepIndex ? 'bg-brand-black' : 'bg-brand-border'}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted ? 'bg-brand-black' : 'bg-brand-cream border-2 border-brand-border'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-brand-muted" />
                    )}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 ${i < currentStepIndex ? 'bg-brand-black' : 'bg-brand-border'}`} />
                  )}
                </div>
                <span className={`text-xs mt-2 capitalize font-body ${
                  isCurrent ? 'font-semibold text-brand-black' : 'text-brand-muted'
                }`}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items (2/3) */}
        <div className="lg:col-span-2 bg-brand-white rounded-xl border border-brand-border p-6">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Items</h2>
          <div className="divide-y divide-brand-border">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 py-4">
                <div className="w-16 h-16 rounded-lg bg-brand-cream overflow-hidden shrink-0">
                  {item.image && <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-black">{item.productName}</p>
                  <p className="text-sm text-brand-muted">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="font-semibold tabular-nums text-brand-black shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details (1/3) */}
        <div className="space-y-4">
          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-3">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Subtotal</span>
                <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Delivery</span>
                <span className="tabular-nums">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-brand-border pt-2">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-3">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Details</h2>
            <div className="text-sm space-y-2">
              <div>
                <span className="text-brand-muted">Payment: </span>
                <span className="text-brand-black capitalize">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-brand-muted">Fulfilment: </span>
                <span className="text-brand-black capitalize">{order.fulfilmentType}</span>
              </div>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-3">
              <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Delivery Address</h2>
              <div className="text-sm text-brand-black space-y-0.5">
                <p>{order.deliveryAddress.addressLine1}</p>
                {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.district}</p>
                {order.deliveryAddress.postalCode && <p>{order.deliveryAddress.postalCode}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Template S17: Account Profile Page (`(storefront)/account/profile/page.tsx`)

```tsx
import { requireCustomerAuth } from '@/lib/customer-session'
import { adminDb } from '@/lib/firebase-admin'
import { updateProfile } from './actions'
import { FlashMessage } from '@/components/flash-message'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile — Creamy Heaven',
  description: 'Update your Creamy Heaven profile information.',
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  const session = await requireCustomerAuth()
  const { flash } = await searchParams

  // Fetch customer profile from Firestore
  const customerDoc = await adminDb.collection('customers').doc(session.uid).get()
  const customer = customerDoc.exists ? customerDoc.data() : null

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up">
        <h1 className="font-heading text-2xl font-semibold text-brand-black">My Profile</h1>
        <p className="text-brand-muted text-sm mt-1">Update your personal information</p>
      </div>

      <form
        action={updateProfile}
        className="animate-fade-in-up bg-brand-white rounded-xl border border-brand-border p-6 space-y-5 max-w-xl"
      >
        <div>
          <label htmlFor="profile-name" className="text-sm font-medium text-brand-black">
            Full Name
          </label>
          <input
            id="profile-name" name="name" required minLength={2}
            defaultValue={customer?.name ?? session.name ?? ''}
            className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="text-sm font-medium text-brand-black">
            Email
          </label>
          <input
            id="profile-email" name="email" type="email" disabled
            value={session.email}
            className="form-input w-full bg-brand-cream/50 border border-brand-border rounded-lg px-3 py-2 mt-1 text-brand-muted cursor-not-allowed"
          />
          <p className="text-xs text-brand-muted mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="profile-phone" className="text-sm font-medium text-brand-black">
            Phone
          </label>
          <input
            id="profile-phone" name="phone" type="tel"
            defaultValue={customer?.phone ?? ''}
            pattern="^(?:\+94|0)\d{9}$"
            placeholder="+94 XX XXX XXXX"
            className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <button
          type="submit"
          className="btn-hover bg-brand-black text-brand-white px-6 py-2.5 rounded-lg font-semibold text-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
```

### Profile Update Server Action

```typescript
// app/(storefront)/account/profile/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requireCustomerAuth } from '@/lib/customer-session'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^(?:\+94|0)\d{9}$/, 'Invalid Sri Lankan phone number').optional().or(z.literal('')),
})

export async function updateProfile(formData: FormData) {
  const session = await requireCustomerAuth()

  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const msg = encodeURIComponent(
      Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Please check your details'
    )
    redirect(`/account/profile?flash=error:${msg}`)
  }

  await adminDb.collection('customers').doc(session.uid).set(
    {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: session.email,
      updatedAt: new Date(),
    },
    { merge: true }
  )

  redirect('/account/profile?flash=success:Profile updated')
}
```

### Account Sign Out Server Action

```typescript
// app/(storefront)/account/actions.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function customerSignOut() {
  const cookieStore = await cookies()
  cookieStore.set('customer-session', '', { path: '/', maxAge: 0 })
  redirect('/')
}
```

