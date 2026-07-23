---
name: creamy-heaven-storefront-builder
description: >
  Build the Creamy Heaven customer-facing storefront — the public shopping website for a Sri
  Lankan cakes & desserts business. Server-first (RSC + Server Actions), same tech stack and
  design tokens as the admin panel. Covers: Home, Shop (listing + filters), Product Detail,
  Cart, Checkout (COD), Order Confirmation, About, Contact, FAQs, Delivery Policy, and shared
  storefront layout (header/footer/nav). Triggers on any request to build, design, extend, or
  fix a public-facing storefront page, customer shopping flow, cart/checkout experience, or
  storefront layout component for the Creamy Heaven project.
---

# Creamy Heaven — Storefront Builder Skill (Customer-Facing Website)

You are building the **public, customer-facing storefront** for **Creamy Heaven** — a Sri
Lankan cakes & desserts ecommerce site. This is the shopping website that customers visit to
browse products, add items to their cart, and place Cash on Delivery (COD) orders. It shares
the same codebase, tech stack, type system, design tokens, and server-first philosophy as the
admin panel that is already built and running.

> **Critical prerequisite**: Read `references/architecture.md` and `references/storefront-design.md`
> before writing any storefront code. They contain the full type system, component anatomy,
> page-by-page design spec, and data-flow patterns you must follow.

---

## 0. Relationship to the Admin Panel (What's Already Built)

The admin panel is **complete and working**. It lives under `src/app/admin/` and establishes
every convention the storefront must follow. You are NOT rebuilding the admin — you are adding
the customer-facing `(storefront)` route group alongside it. Both share:

| Shared Layer | Location | Already Built |
|---|---|---|
| Type system | `src/types/index.ts` | ✅ All types (Product, Order, Category, Cart, etc.) |
| Firebase Admin SDK | `src/lib/firebase-admin.ts` | ✅ `adminDb`, `adminAuth` |
| Data access layer | `src/lib/data/*.ts` | ✅ `fetchProducts`, `fetchCategories`, etc. |
| Validation schemas | `src/lib/validations.ts` | ✅ `checkoutSchema`, `productSchema` |
| Utilities | `src/lib/utils.ts` | ✅ `cn()`, `formatPrice()`, `slugify()`, etc. |
| Design tokens | `src/app/globals.css` | ✅ Brand colors, animations, hover classes |
| Fonts | `src/app/fonts.ts` | ✅ Cormorant Garamond + Manrope |
| Cloudinary | `src/lib/cloudinary.ts` | ✅ Image upload/hosting |
| Email service | `src/lib/email.ts` | ✅ Brevo transactional email stubs |
| Root layout | `src/app/layout.tsx` | ✅ Font variables, globals |

**Do NOT duplicate or rewrite** any of these. Import and reuse them.

---

## 1. Server-First Rendering — Same Rules as Admin

Everything in section 0 of the admin skill applies here. Default to zero client JavaScript.

### Storefront-specific Server Component patterns
- **Shop page**: `searchParams` drives all filtering (category, sub-category, price range,
  sort order). Filter UI is plain `<Link>` elements and `<form method="GET">`. No client
  state for filters.
- **Product Detail**: Server Component fetches the product by slug. Related products fetched
  server-side and rendered statically.
- **Cart**: Stored as a **JSON cookie** (`cart` cookie, `httpOnly: false` so the client add-
  to-cart island can read/write it). The Cart page itself is a Server Component that reads the
  cookie and renders the items.
- **Checkout**: Server Component renders the form. `placeOrder` Server Action handles
  validation, stock checking, order creation, stock decrement, email dispatch, and redirect
  to confirmation.
- **Order confirmation**: Server Component reads order from Firestore by ID. No client state.

### Storefront Client Component allow-list (ONLY these)
1. **Add-to-Cart button** — needs immediate optimistic feedback (update cart cookie + show
   animation) before the server round-trip. Keep it a thin leaf component; the product page
   around it stays server-rendered.
2. **Cart quantity stepper** — increment/decrement buttons that update the cart cookie
   client-side for instant feedback, then optionally sync via a Server Action.
3. **Mobile navigation toggle** — prefer the CSS-only `<input type="checkbox">` + `:checked`
   pattern first. Only use `'use client'` if the design needs a complex slide animation.
4. **Image carousel/gallery** — product detail page image switching (thumbnail click → main
   image swap). Keep it a small isolated island.
5. **Customer login form** — Firebase Auth client SDK (`signInWithEmailAndPassword`,
   `createUserWithEmailAndPassword`, `signInWithPopup` for Google) runs in the browser.
   After sign-in, POST the ID token to `/api/auth/customer-session` to mint a `customer-
   session` cookie. This is the same pattern as the admin login, but with a separate cookie
   name and no role/permission — just customer identity.
6. **Checkout fulfilment toggle** — the delivery/pickup radio that conditionally shows/hides
   the address fields. Prefer CSS-only `:has(input[value="delivery"]:checked)` first; only
   use `'use client'` if the CSS approach doesn't work in target browsers.

Everything else — header, footer, navigation, product cards, product grid, cart page, checkout
form, order confirmation, about, contact, account pages — is a Server Component.

---

## 2. Storefront Route Structure

All storefront pages live in the `(storefront)` route group for a separate layout:

```
src/app/
├── (storefront)/
│   ├── layout.tsx                    # Storefront layout: header + nav + footer
│   ├── page.tsx                      # Home page
│   ├── shop/
│   │   ├── page.tsx                  # Product listing with filters
│   │   └── [slug]/page.tsx           # Product detail
│   ├── cart/
│   │   ├── page.tsx                  # Cart page (reads cookie)
│   │   └── actions.ts               # Server Actions: addToCart, updateQty, removeFromCart
│   ├── checkout/
│   │   ├── page.tsx                  # Checkout form (2-column: form + order summary)
│   │   └── actions.ts               # Server Action: placeOrder
│   ├── order-confirmation/
│   │   └── [id]/page.tsx             # Order confirmation / thank-you page
│   ├── about/page.tsx                # Brand story, values, team, bakery photos
│   ├── contact/
│   │   ├── page.tsx                  # Contact form + business info + map embed
│   │   └── actions.ts               # Server Action: submitContactMessage
│   ├── faqs/page.tsx                 # FAQ accordion (CSS-only <details>)
│   ├── delivery-policy/page.tsx      # Delivery zones + fees table
│   └── account/
│       ├── layout.tsx                # Account layout — sidebar nav + auth guard
│       ├── page.tsx                  # Account dashboard (order summary + quick links)
│       ├── orders/
│       │   ├── page.tsx              # Order history list
│       │   └── [id]/page.tsx         # Order detail (status timeline, items, address)
│       ├── profile/
│       │   ├── page.tsx              # View profile
│       │   └── actions.ts           # Server Action: updateProfile
│       └── addresses/
│           ├── page.tsx              # Saved delivery addresses
│           └── actions.ts           # Server Actions: addAddress, updateAddress, deleteAddress
├── (auth)/
│   ├── customer-login/page.tsx       # 'use client' — Firebase Auth sign-in/sign-up
│   └── customer-register/page.tsx    # 'use client' — Firebase Auth registration
├── api/
│   └── auth/
│       ├── session/route.ts          # POST — admin session cookie exchange (already built)
│       └── customer-session/route.ts # POST — customer session cookie exchange
├── admin/                            # ← Already built, don't touch
└── layout.tsx                        # Root layout (shared, already built)
```

---

## 3. Design System — Storefront Visual Language

Use the **exact same brand tokens** from `globals.css`. The storefront and admin share one
palette — no separate storefront theme.

### Color Usage on Storefront
| Element | Color Token |
|---|---|
| Page background | `bg-brand-cream` (main) / `bg-brand-white` (section contrast) |
| Product cards | `bg-brand-white` on cream sections, `border-brand-border` |
| Primary CTA ("Add to Cart", "Place Order") | `bg-brand-black text-brand-white` |
| Secondary CTA ("View Details", "Continue Shopping") | `bg-brand-white border-brand-border text-brand-black` |
| Headings (h1-h4, logo) | `font-heading` (Cormorant Garamond), `text-brand-black` |
| Body text | `font-body` (Manrope), `text-brand-black` or `text-brand-black-soft` |
| Muted text (prices sublabel, "in stock") | `text-brand-muted` |
| Prices | `font-body tabular-nums`, `text-brand-black` |
| Out of stock badge | `text-brand-danger` |
| Success messages | `text-brand-success` |
| Navigation links | `text-brand-black-soft hover:text-brand-black` |
| Footer background | `bg-brand-black text-brand-white` |

### Typography Scale (Storefront)
- **Hero heading** (Home page): `font-heading text-5xl md:text-7xl font-bold`
- **Section heading**: `font-heading text-3xl md:text-4xl font-semibold`
- **Product card name**: `font-heading text-lg font-semibold`
- **Product detail name**: `font-heading text-3xl font-bold`
- **Price (large)**: `font-body text-2xl font-semibold tabular-nums`
- **Body text**: `font-body text-base` (16px)
- **Small/muted**: `font-body text-sm text-brand-muted`

### Storefront Motion
Use the same CSS animation classes from `globals.css`:
- `.animate-fade-in-up` for section entrances on page load
- `.animate-in-stagger` on product grids so cards cascade in
- `.card-hover` on product cards and CTA buttons
- `.btn-hover` on all interactive buttons
- **Product image**: `hover:scale-105 transition-transform duration-300` (gentle zoom)
- **NO animation library** — CSS `transform` + `transition` only

### Storefront-Specific CSS Classes (add to `globals.css`)
```css
/* Product card image zoom */
.img-zoom {
  transition: transform 300ms ease;
  overflow: hidden;
}
.img-zoom:hover img,
.img-zoom img:hover {
  transform: scale(1.05);
}

/* Hero section gradient overlay */
.hero-overlay {
  background: linear-gradient(to bottom, transparent, rgb(21 18 16 / 0.6));
}

/* FAQ accordion (CSS-only, <details>/<summary>) */
.faq-item summary {
  cursor: pointer;
  list-style: none;
}
.faq-item summary::-webkit-details-marker {
  display: none;
}
.faq-item[open] > summary ~ * {
  animation: fade-in-up 0.3s ease-out both;
}
```

---

## 4. Storefront Layout (`(storefront)/layout.tsx`)

Server Component. Contains:
- **Header**: Logo (Cormorant Garamond), navigation links, cart icon with item count badge
- **Footer**: Brand info, quick links, social links, delivery zones summary

```tsx
// app/(storefront)/layout.tsx — Server Component
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { getCartItemCount } from '@/lib/cart'

const NAV_LINKS = [
  { label: 'Home',    href: '/' },
  { label: 'Shop',    href: '/shop' },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQs',    href: '/faqs' },
]

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const cartCount = await getCartItemCount()

  return (
    <>
      {/* Header */}
      <header className="bg-brand-white/90 backdrop-blur-md border-b border-brand-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold text-brand-black">
            Creamy Heaven
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-brand-black-soft hover:text-brand-black transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
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

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-black text-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-heading text-xl font-bold mb-3">Creamy Heaven</h3>
              <p className="text-sm text-brand-white/60">
                Handcrafted cakes & desserts, delivered fresh across Sri Lanka.
              </p>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-brand-white/60 hover:text-brand-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/delivery-policy" className="text-sm text-brand-white/60 hover:text-brand-white transition-colors">
                    Delivery Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-3">Follow Us</h4>
              {/* Social links from SiteSettings — fetched server-side */}
            </div>
          </div>
          <div className="border-t border-brand-white/10 mt-8 pt-8 text-center">
            <p className="text-xs text-brand-white/40">
              © {new Date().getFullYear()} Creamy Heaven. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
```

---

## 5. Page-by-Page Implementation Guide

### 5.1 Home Page (`(storefront)/page.tsx`)
**Purpose**: Hero banner, featured products, brand story teaser, CTA to shop.

- **Hero section**: Full-width background image (from Cloudinary), overlaid with the brand
  name in `font-heading text-7xl`, tagline, and a "Shop Now" CTA button.
- **Featured Products**: Grid of `isFeatured: true` products. Fetch server-side:
  `fetchProducts({ featured: true })`. Display as product cards with image, name, price, and
  "View Details" link.
- **Brand Story teaser**: 2-3 sentences + "Learn More" link to `/about`.
- **Delivery promise**: Callout strip ("Fresh delivery across Sri Lanka · COD Available").

### 5.2 Shop Page (`(storefront)/shop/page.tsx`)
**Purpose**: Browse all published products. Filter by category, sub-category, sort.

- All filtering via `searchParams`: `?category=cakes&sub=birthday-cakes&sort=price_asc&q=chocolate`
- Filter sidebar/bar: plain `<Link>` elements that update the URL. No client filter state.
- Products fetched via `fetchProducts()` filtered to `visibility: 'published'` and
  `availabilityStatus !== 'out_of_stock'` (or show out-of-stock with disabled "Add to Cart").
- Product card: image (Cloudinary URL), name, price, category tag, "Add to Cart" client island.
- Categories fetched via `fetchCategories()` server-side for the sidebar filter.

```tsx
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sub?: string; sort?: string; q?: string }>
}) {
  const params = await searchParams
  const [products, categories] = await Promise.all([
    fetchPublishedProducts(params),
    fetchCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      {/* Category filter tabs — plain <Link> elements */}
      {/* Search — <form method="GET"> */}
      {/* Product grid — .animate-in-stagger */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in-stagger">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### 5.3 Product Detail (`(storefront)/shop/[slug]/page.tsx`)
**Purpose**: Full product information, image gallery, add-to-cart.

- Fetch product by slug: `fetchProductBySlug(slug)` (add this to `lib/data/products.ts`).
- Display: main image + thumbnails, product name, price, description, ingredients (if
  present), allergens (if present), size/weight, flavor options.
- **Add to Cart**: Client Component island with quantity selector + button.
- **Related products**: Fetch 4 products from the same category, rendered server-side.
- If `isCustomizable: true`, show a "Custom Order" note with lead time info.
- If `availabilityStatus === 'out_of_stock'`, disable the Add to Cart button and show a
  "Currently Unavailable" badge.
- SEO: `generateMetadata()` with product name, description, and OG image.

### 5.4 Cart Page (`(storefront)/cart/page.tsx`)
**Purpose**: View cart contents, adjust quantities, proceed to checkout.

- Server Component reads the cart cookie, resolves product IDs from Firestore to get current
  prices (NEVER trust cached client prices), and renders the line items.
- Each line item: image, name, unit price, quantity stepper (client island), line total,
  remove button (Server Action form).
- Cart summary: subtotal, delivery fee estimate, total.
- "Proceed to Checkout" CTA → `/checkout`.
- Empty cart state with "Continue Shopping" CTA → `/shop`.

### 5.5 Checkout Page (`(storefront)/checkout/page.tsx`)
**Purpose**: Collect customer details, confirm order (COD).

**Layout**: 2-column on desktop (customer form 2/3, order summary 1/3). Single column stacked
on mobile (form first, summary at bottom).

**Server Component** — renders the form with `action={placeOrder}`.

#### Form Sections
1. **Customer Information**
   - Full Name (`name`) — `form-input`, required, min 2 chars
   - Email (`email`) — `form-input`, required, validated as email
   - Phone (`phone`) — `form-input`, required, Sri Lankan format `^(?:\+94|0)\d{9}$`
   - If customer is logged in, pre-fill from their profile

2. **Fulfilment Type**
   - Radio buttons: `delivery` / `pickup`
   - Use CSS `:has()` to conditionally show/hide address section:
     ```css
     .checkout-form:not(:has(input[value="delivery"]:checked)) .delivery-address {
       display: none;
     }
     ```
   - If `:has()` doesn't work in target browsers, use a minimal client island

3. **Delivery Address** (shown only when fulfilment = delivery)
   - Address Line 1 (`addressLine1`) — required for delivery
   - Address Line 2 (`addressLine2`) — optional
   - City (`city`) — required for delivery
   - District (`district`) — required, use `<select>` with Sri Lankan districts
   - Postal Code (`postalCode`) — required

4. **Delivery Zone Selection** (when delivery)
   - Fetch `SiteSettings.deliveryZones` server-side
   - Display as radio buttons or `<select>` with zone name + fee
   - Include a hidden `deliveryFee` field that updates based on zone

5. **Order Notes** (`notes`) — `form-textarea`, optional, max 500 chars
   - Placeholder: "Any special requests? Cake message text, preferred delivery time..."

#### Order Summary Sidebar
- Fetch cart items server-side via `getCart()` + resolve product details from Firestore
- Display each item: image thumbnail, name, qty × price, line total
- Subtotal, delivery fee (from selected zone), total
- "Place Order (COD)" submit button — `btn-hover bg-brand-black text-brand-white w-full py-3`
- Show COD badge/note: "💰 Cash on Delivery — pay when your order arrives"

#### `placeOrder` Server Action Flow
```
validate(checkoutSchema) → getCart() → re-fetch prices from Firestore →
check stock (redirect to /cart if insufficient) → create Order document →
decrement stockQty via FieldValue.increment(-qty) → clearCart() →
sendOrderConfirmationEmail().catch() → sendNewOrderAlertEmail().catch() →
revalidatePath('/admin/orders') → redirect('/order-confirmation/{id}?ref={orderRef}')
```

**CRITICAL**: Never trust prices from the cart cookie. Always re-fetch from Firestore.
See `references/storefront-templates.md` Template S9 for the full implementation.

### 5.6 Order Confirmation (`(storefront)/order-confirmation/[id]/page.tsx`)
**Purpose**: Thank-you page with order details.

- Server Component fetches the order by ID, validates the `?ref=` query param matches.
- Displays: order ref, items ordered, total, payment method (COD), delivery/pickup details,
  estimated timeline.
- Fire `Purchase` pixel event from an inline `<script>` (server-rendered).

### 5.7 About Us Page (`(storefront)/about/page.tsx`)
**Purpose**: Tell the Creamy Heaven brand story, build trust, showcase the bakery.

**Server Component** — fully static, no data fetching needed (or optionally fetch
`SiteSettings` for social links).

#### Page Sections
1. **Hero Banner**
   - Full-width bakery/kitchen image (Cloudinary) with text overlay
   - Heading: "Our Story" — `font-heading text-5xl font-bold text-brand-white`
   - Subtitle: one-liner about the brand

2. **Brand Story** (2-column: text left, image right)
   - "Who We Are" heading
   - 2-3 paragraphs about the bakery's origin, passion for baking, Sri Lankan roots
   - Bakery/team image on the right

3. **Our Values / Promises** (3-column grid of icon + text cards)
   - 🎂 "Freshly Made" — Every order is baked fresh, never from frozen
   - 🌿 "Quality Ingredients" — Premium, locally sourced ingredients
   - 💛 "Made with Love" — Handcrafted with care for every celebration
   - Each card: `bg-brand-white rounded-xl border border-brand-border p-6 card-hover`
   - Icon: `w-12 h-12` Lucide icon in a `bg-brand-cream rounded-xl p-3` container

4. **Why Choose Us** (alternating image-text rows)
   - Custom cakes for every occasion
   - Island-wide delivery with COD
   - Made-to-order specialties

5. **CTA Section**
   - "Ready to order?" heading
   - [Shop Now →] and [Contact Us →] buttons

#### SEO Metadata
```typescript
export const metadata: Metadata = {
  title: 'About Us — Creamy Heaven',
  description: 'Learn about Creamy Heaven — handcrafted cakes and desserts made with love in Sri Lanka. Freshly baked, delivered island-wide.',
}
```

### 5.8 Contact Us Page (`(storefront)/contact/page.tsx`)
**Purpose**: Let customers reach out with questions, custom order inquiries, or feedback.

**Server Component** — renders the contact form + business info.

#### Page Layout (2-column on desktop, stacked on mobile)

**Left Column — Contact Form** (`<form action={submitContactMessage}>`)
- Full Name (`name`) — `form-input`, required
- Email (`email`) — `form-input`, required
- Phone (`phone`) — `form-input`, optional
- Subject (`subject`) — `form-select` with options:
  - General Inquiry
  - Custom Cake Order
  - Delivery Question
  - Feedback
  - Other
- Message (`body`) — `form-textarea`, required, min 10 chars
- Submit button: "Send Message" — `btn-hover bg-brand-black text-brand-white px-6 py-3`
- Flash message for success/error (read from `searchParams.flash`)

**Right Column — Business Information**
- **Get in Touch** heading
- 📞 Phone number (from `SiteSettings.ownerPhone` or hardcoded)
- 📧 Email address (from `SiteSettings.ownerEmail`)
- 📍 Business address / location
- 🕐 Operating hours
- Social media links (TikTok, Instagram, Facebook) — icons with links
- Optional: embedded Google Maps iframe or static map image

#### `submitContactMessage` Server Action
Validates form data with Zod → creates a `Message` document in Firestore with
`status: 'unread'` → redirects to `/contact?flash=success:...`.
The admin panel's Messages module already displays these.
See `references/storefront-templates.md` Template S8 and S10 for full implementations.

#### SEO Metadata
```typescript
export const metadata: Metadata = {
  title: 'Contact Us — Creamy Heaven',
  description: 'Get in touch with Creamy Heaven. Questions about custom cakes, delivery, or orders? We\'re here to help.',
}
```

### 5.9 Account Pages (`(storefront)/account/`)
**Purpose**: Let customers view their order history, manage their profile, and save delivery
addresses. Authentication is required — unauthenticated users are redirected to login.

#### Account Authentication Architecture

Customer auth follows the **same session-cookie pattern** as admin auth, but with a
separate cookie name (`customer-session`) and no RBAC permissions:

```typescript
// lib/customer-session.ts
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'

export interface CustomerSessionData {
  uid: string
  email: string
  name?: string
}

export async function getCustomerSession(): Promise<CustomerSessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('customer-session')?.value
  if (!sessionCookie) return null
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return { uid: decoded.uid, email: decoded.email ?? '', name: decoded.name }
  } catch {
    return null
  }
}

export async function requireCustomerAuth(): Promise<CustomerSessionData> {
  const session = await getCustomerSession()
  if (!session) redirect('/customer-login')
  return session
}
```

#### Customer Login Page (`(auth)/customer-login/page.tsx`)
- `'use client'` — uses Firebase Auth client SDK
- Email/password sign-in + Google sign-in option
- "Create Account" link to registration page
- After sign-in, POST ID token to `/api/auth/customer-session` → mint `customer-session`
  cookie → redirect to `/account`
- Styled with the same brand tokens as the storefront (not the admin login style)

#### Account Layout (`(storefront)/account/layout.tsx`)
- Server Component with `requireCustomerAuth()` guard
- Sidebar navigation (on desktop) or top tabs (on mobile):
  - 📦 My Orders → `/account/orders`
  - 👤 My Profile → `/account/profile`
  - 📍 My Addresses → `/account/addresses`
- Displays customer name + email in the sidebar header
- Sign-out form (`<form action={customerSignOut}>`)

#### Account Dashboard (`(storefront)/account/page.tsx`)
- Server Component — fetches customer's recent orders + profile
- **Welcome section**: "Welcome back, {name}" heading
- **Quick stats**: Total orders, total spent (fetched from `/customers/{uid}`)
- **Recent Orders**: Last 3-5 orders in a compact card list
  - Each card: order ref, date, total, status badge, "View Details →" link
- **Quick Links**: Profile, Addresses, Browse Shop

#### Order History (`(storefront)/account/orders/page.tsx`)
- Server Component — fetches all orders for this customer from Firestore
  (`adminDb.collection('orders').where('customer.uid', '==', session.uid)`)
- Filterable by status via `searchParams` (same pattern as admin orders)
- Each order row: order ref, date, items count, total, status badge, view link
- Empty state: "No orders yet" + [Start Shopping →]

#### Order Detail (`(storefront)/account/orders/[id]/page.tsx`)
- Server Component — fetch order by ID, verify `customer.uid` matches session
- **Order Status Timeline**: Visual progress bar showing status history
  - Each step: status label, timestamp, note (if any)
  - Active step highlighted, completed steps checked
- **Order Items**: Image, name, qty, price per item
- **Order Summary**: Subtotal, delivery fee, total, payment method
- **Delivery/Pickup Details**: Address or pickup location
- **Tracking**: Tracking number (if `dispatched`), estimated delivery date
- If `status === 'pending'`, show a cancel request option (optional)

#### Profile Page (`(storefront)/account/profile/page.tsx`)
- Server Component — fetch customer profile from Firestore `/customers/{uid}`
- View mode by default showing: name, email, phone
- Edit form: `<form action={updateProfile}>` with `form-input` fields
- Phone validation: Sri Lankan format
- Flash message on success

#### Saved Addresses (`(storefront)/account/addresses/page.tsx`)
- Server Component — fetch saved addresses from customer document
- List of saved addresses as cards with edit/delete actions
- "Add New Address" form (Server Action)
- Each address card: address line, city, district, postal code, set-as-default toggle
- Default address auto-fills at checkout

---

## 6. Cart System (Cookie-Based, Server-Validated)

### Cart Cookie Structure
```typescript
// lib/cart.ts
import { cookies } from 'next/headers'

interface CartItem {
  productId: string
  quantity: number
}

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('cart')?.value
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
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
    httpOnly: false,  // client add-to-cart island needs to read it
    sameSite: 'lax',
  })
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('cart', '[]', { path: '/', maxAge: 0 })
}
```

### Cart Server Actions (`(storefront)/cart/actions.ts`)
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCart, setCart } from '@/lib/cart'

export async function addToCart(formData: FormData) {
  const productId = formData.get('productId') as string
  const quantity = Number(formData.get('quantity') ?? 1)

  const cart = await getCart()
  const existing = cart.find((item) => item.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }

  await setCart(cart)
  revalidatePath('/cart')
}

export async function updateCartQuantity(formData: FormData) {
  const productId = formData.get('productId') as string
  const quantity = Number(formData.get('quantity'))

  const cart = await getCart()
  const item = cart.find((i) => i.productId === productId)
  if (item) item.quantity = Math.max(1, quantity)

  await setCart(cart)
  revalidatePath('/cart')
}

export async function removeFromCart(formData: FormData) {
  const productId = formData.get('productId') as string
  const cart = (await getCart()).filter((i) => i.productId !== productId)
  await setCart(cart)
  revalidatePath('/cart')
}
```

---

## 7. Data Access Additions for Storefront

Add to `src/lib/data/products.ts`:

```typescript
export async function fetchPublishedProducts(params?: {
  category?: string
  sub?: string
  sort?: string
  q?: string
}): Promise<Product[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection('products')
    .where('visibility', '==', 'published')
    .orderBy('createdAt', 'desc')
    .limit(100)

  if (params?.category) query = query.where('category', '==', params.category)

  const snapshot = await query.get()
  let items = snapshot.docs.map(toProduct)

  if (params?.sub) items = items.filter((p) => p.subCategory === params.sub)
  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter((p) => p.name.toLowerCase().includes(q) || p.flavor?.toLowerCase().includes(q))
  }

  // Sort
  if (params?.sort === 'price_asc') items.sort((a, b) => a.price - b.price)
  else if (params?.sort === 'price_desc') items.sort((a, b) => b.price - a.price)
  else if (params?.sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name))

  return items
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const snapshot = await adminDb
    .collection('products')
    .where('slug', '==', slug)
    .where('visibility', '==', 'published')
    .limit(1)
    .get()
  return snapshot.empty ? null : toProduct(snapshot.docs[0])
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const snapshot = await adminDb
    .collection('products')
    .where('isFeatured', '==', true)
    .where('visibility', '==', 'published')
    .orderBy('createdAt', 'desc')
    .limit(8)
    .get()
  return snapshot.docs.map(toProduct)
}
```

---

## 8. SEO & Metadata

Every storefront page must export `generateMetadata()`:

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.name} — Creamy Heaven`,
    description: product.description.substring(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 155),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}
```

### Static page metadata pattern:
```typescript
export const metadata: Metadata = {
  title: 'Shop — Creamy Heaven',
  description: 'Browse our handcrafted cakes, cupcakes, and desserts. Fresh delivery across Sri Lanka.',
}
```

---

## 9. Marketing Pixels

Fire pixel events from inline `<script>` tags, NOT from client components:

```tsx
// In the root storefront layout or individual pages:
<script
  dangerouslySetInnerHTML={{
    __html: `
      // Meta Pixel - PageView (fires on every storefront page)
      if (typeof fbq !== 'undefined') fbq('track', 'PageView');
      if (typeof ttq !== 'undefined') ttq.track('PageView');
    `,
  }}
/>
```

| Event | Page | Implementation |
|---|---|---|
| `PageView` | All storefront pages | Inline `<script>` in storefront layout |
| `ViewContent` | Product Detail | Inline `<script>` with product data |
| `AddToCart` | Product Detail | Fire from the client Add-to-Cart island |
| `InitiateCheckout` | Checkout | Inline `<script>` on checkout page |
| `Purchase` | Order Confirmation | Inline `<script>` with order total |

---

## 10. Storefront Component Library

Build these reusable components in `src/components/storefront/`:

```
src/components/storefront/
├── product-card.tsx        # Server Component — image, name, price, category tag
├── product-grid.tsx        # Server Component — responsive grid wrapper
├── add-to-cart-button.tsx  # 'use client' — the one interactive island
├── cart-quantity.tsx        # 'use client' — increment/decrement stepper
├── breadcrumb.tsx          # Server Component — Home > Shop > Category > Product
├── price-display.tsx       # Server Component — formatted LKR price
├── section-heading.tsx     # Server Component — consistent section header
├── hero-banner.tsx         # Server Component — full-width hero with CTA
├── category-filter.tsx     # Server Component — filter pills (plain <Link>)
└── image-gallery.tsx       # 'use client' — product detail image switcher
```

### Product Card Template
```tsx
// components/storefront/product-card.tsx — Server Component
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group card-hover block">
      <div className="aspect-square overflow-hidden rounded-xl bg-brand-cream">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted text-sm">
            No image
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-brand-muted uppercase tracking-wider">{product.category}</p>
        <h3 className="font-heading text-lg font-semibold text-brand-black group-hover:text-brand-black-soft transition-colors">
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

## 11. Critical Rules (Storefront-Specific)

All 17 admin critical rules (section 13 of admin SKILL.md) apply. Additionally:

18. **ALWAYS** hide `out_of_stock` products from the shop grid or show them with a disabled
    "Sold Out" overlay — never let a customer add an out-of-stock item to their cart.
19. **ALWAYS** re-fetch and validate product prices server-side in `placeOrder` — never trust
    the prices stored in the cart cookie.
20. **ALWAYS** show `ingredients` and `allergens` on the Product Detail page when present.
21. **ALWAYS** show the lead time notice on `isCustomizable` products.
22. **ALWAYS** default the checkout to COD — do not show a payment gateway selector until
    PayHere is integrated in Phase 4+.
23. **ALWAYS** validate phone numbers against the Sri Lankan format `^(?:\+94|0)\d{9}$`.
24. **NEVER** store sensitive data (prices, totals) only in client state or cookies — always
    recompute server-side in Server Actions.
25. **ALWAYS** decrement `stockQty` only after order creation in the `placeOrder` Server
    Action, NOT when items are added to cart.
26. **ALWAYS** export `generateMetadata()` from every storefront page for SEO.
27. **ALWAYS** use `<Link>` for navigation (soft navigation), never `<a>` for internal links.
28. **ALWAYS** fire pixel events from inline `<script>` or the thin client island — never
    create a client component just to fire a pixel.
29. **ALWAYS** make the storefront fully responsive — mobile-first, then scale up to desktop.
30. **ALWAYS** verify `customer.uid` matches the session when fetching order details in the
    account section — never allow a customer to see another customer's orders.
31. **ALWAYS** use a separate `customer-session` cookie for customer auth, NOT the admin
    `session` cookie — customers and admin users are completely separate auth flows.
32. **ALWAYS** pre-fill checkout fields from the customer profile when they're logged in.
33. **ALWAYS** store the customer's `uid` on orders placed while logged in, so orders
    appear in their account order history.
34. **NEVER** expose customer account pages without `requireCustomerAuth()` at the top.
35. **ALWAYS** show the Contact form subject as a `<select>` dropdown, not a free-text input
    — this helps the admin panel categorize/triage messages.
36. **ALWAYS** include business hours, phone, and email on the Contact page alongside the form.

---

## 12. Adding a New Storefront Page Checklist

1. **Route**: Create the page file in `src/app/(storefront)/`.
2. **Server Component**: Default to Server Component. Only add `'use client'` for items in
   the allow-list (section 1).
3. **Data**: Fetch data directly from Firestore via `lib/data/*.ts` helpers.
4. **Metadata**: Export `metadata` or `generateMetadata()` for SEO.
5. **Design**: Use brand tokens, `font-heading` for headings, `font-body` for text.
6. **Motion**: Apply `.animate-fade-in-up` on the main content, `.animate-in-stagger` on
   grids/lists, `.card-hover` on interactive cards.
7. **Responsive**: Mobile-first layout with Tailwind responsive prefixes.
8. **Pixel**: Fire appropriate pixel events if it's a conversion-relevant page.
9. **Test**: Verify the page works with JavaScript disabled (forms submit, links navigate,
   content renders). The only exceptions are the client islands in section 1.
