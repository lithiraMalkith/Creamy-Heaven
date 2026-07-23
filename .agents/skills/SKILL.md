---
name: creamy-heaven-ecommerce-builder
description: >
  Build the Creamy Heaven storefront + admin panel with Next.js App Router as a
  server-first (RSC + Server Actions) application, Firebase Auth (session cookies) +
  Firestore, RBAC permissions, CSS-only motion, and full CRUD via Server Actions.
  Covers both the customer-facing COD storefront (Home, Shop, Product Detail, Cart,
  Checkout, About, Contact, FAQs, Delivery Policy) and the internal admin back-office
  (dashboard, product/category/inventory/order/customer/marketing management).
  Triggers on requests to build or extend any page, module, or action for the Creamy
  Heaven cakes & desserts ecommerce project, or any COD-first food/dessert storefront
  with a Firebase-backed admin panel built server-first.
---

# Creamy Heaven — Master Skill (Storefront + Admin Panel)

You are building the **Creamy Heaven** website: a customer-facing COD storefront for a Sri
Lankan cakes & desserts business, paired with an admin panel, built **server-first** —
React Server Components render and fetch data on the server by default, mutations go through
Server Actions bound directly to `<form>` elements, and Client Components are the exception,
not the default. This skill encodes every convention so the build stays architecturally
consistent, adapted from the original Lola Studio (furniture, client-rendered) reference to a
made-to-order bakery/dessert domain built on modern Next.js.

> Business context (from the project research doc): orders currently flow through Facebook
> Messenger with Cash on Delivery. The goal of this build is to move that traffic into a
> controlled ordering experience — full storefront with cart/checkout, COD at launch, and a
> modular payment layer so PayHere can be added later without changing the order data shape.

> **Read `references/architecture.md` before writing any code.** It contains the full type system, Server Action patterns, component anatomy, and file-by-file implementation guide.

---

## 0. Rendering Philosophy — Server-First, Not Client-First

This is the single most important convention change from the old admin-panel-builder skill.
**Default to zero client JavaScript.** Every page, list, filter, form, and detail view should
render and work correctly with JavaScript disabled unless there is a specific, named reason it
can't (see the short allow-list below). Before writing any component, ask: does this need to
run in the browser, or can the server do it? If in doubt, it's a Server Component.

### What moves server-side (no more client fetch-on-mount pattern)
- **Data fetching**: `async function Page()` Server Components call Firestore Admin SDK
  directly — no `useEffect` + client fetch + `useState` loading dance.
- **Filtering & search**: driven entirely by the URL. `?q=chocolate&status=pending&page=2` is
  parsed from the `searchParams` prop on the Server Component; filter/search UI is a plain
  `<form method="GET">` or `<a>` links that navigate. No client-side array `.filter()`.
- **Create / Update / Delete**: Server Actions (`'use server'` functions), invoked via
  `<form action={createProduct}>`. Progressive enhancement — works with JS off, feels instant
  with JS on (React handles the transition).
- **Delete confirmation**: a dedicated confirm page/route (`/admin/products/[id]/delete`)
  rendered server-side with a plain POST form — not a client modal with local state.
- **Toasts / flash messages**: after a Server Action, `redirect()` with a `?flash=success:...`
  query param; a small Server Component reads it and renders the message. Auto-dismiss is a
  pure CSS animation (`animation: toast-fade 4s forwards`), not a `setTimeout`.
- **Entrance animations**: pure CSS `@keyframes` classes applied on server-rendered markup —
  no animation library. See section 6.
- **Dashboard charts**: server-rendered inline SVG computed from the fetched stats at request
  time (bars/lines drawn as static SVG paths) — no client charting library.

### The short, explicit Client Component allow-list
Only these get `'use client'`, and each must be a small, isolated leaf component:
1. **Login page** — Firebase Auth's client SDK (`signInWithEmailAndPassword`,
   `signInWithPopup`) genuinely runs in the browser. This is the one place real client auth
   logic lives.
2. **Cart quantity stepper / add-to-cart button** — needs immediate optimistic feedback before
   the server round-trip confirms it. Keep it a thin island; the cart page itself is still
   server-rendered from a cart cookie/session.
3. **Admin notification bell** — polling for new orders and playing a sound is inherently a
   browser-runtime concern. Documented exception; everything else in the layout is server-
   rendered.
4. **Mobile sidebar toggle** — prefer the CSS-only `<input type="checkbox">` + `:checked`
   sibling-selector pattern (no JS) over a client component. Only reach for `'use client'`
   here if the design genuinely needs a slide animation JS can't express as CSS.

Everything else — sidebar nav, tables, filters, forms, product cards, order detail, category
tree, settings — is a Server Component. If you catch yourself reaching for `useState` to hold
data that came from the server, stop: that's a sign it should be a URL param or a Server
Action instead.

---

## 1. Tech Stack (Non-Negotiable)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Server Components + Server Actions) | 16.x |
| Language | TypeScript | 5.x |
| Auth | Firebase Auth (client SDK on login page only) + Firebase session cookies verified server-side | firebase 12.x / firebase-admin 14.x |
| Database | Firebase Firestore (Admin SDK, read directly in Server Components) | firebase-admin 14.x |
| Styling | Tailwind CSS v4 + custom `brand-*` tokens | tailwindcss 4.x |
| Motion | Pure CSS — `@keyframes` for entrances, `:hover { transform: ... }` for interaction. No JS animation library. | — |
| Fonts | `next/font/google` — Cormorant Garamond (headings/logo) + Manrope (body) | — |
| Icons | Lucide React (server-renderable — icons are just SVG, no `'use client'` needed) | lucide-react 1.x |
| Charts | Server-rendered inline SVG (no client charting library) | — |
| Validation | Zod (used inside Server Actions) | zod 4.x |
| Email | Brevo (free tier transactional email API) | @getbrevo/brevo latest |
| Image Hosting | Cloudinary | cloudinary 2.x |
| Utilities | clsx, tailwind-merge | latest |
| Payments (Phase 4+) | COD only at launch; PayHere added later behind the same checkout schema | — |
| Marketing Pixels | Meta (Facebook) Pixel + TikTok Pixel — fired from a tiny inline `<script>` in the root layout, not a client component | — |

---

## 2. Design System — Brand Tokens

One palette, three colors, used everywhere — admin and storefront alike. No dark theme, no
gold accent. Define these in `tailwind.config.ts` under `theme.extend.colors.brand`:

```typescript
brand: {
  white:   '#FFFFFF',   // Primary background, cards on cream sections
  cream:   '#F7F1E6',   // Secondary background — section fills, table stripes, sidebar
  black:   '#151210',   // Primary text, headings, buttons, active/selected states
  'black-soft': '#3A342E', // Secondary text, muted icons, hover states on black elements
  border:  '#E7DDC9',   // Hairline borders (cream-toned, not grey)
  muted:   '#8B8178',   // Tertiary text, placeholders, timestamps
  // Functional colors — the deliberate, minimal exception to the 3-color rule.
  // Order status needs to be scannable at a glance; pure monochrome can't do that safely.
  success: '#3F7A56',
  danger:  '#B4443A',
  warning: '#B08A3E',
}
```

### Fonts

```typescript
// app/fonts.ts
import { Cormorant_Garamond, Manrope } from 'next/font/google'

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
```

Apply both variable classes on `<html>` in the root layout; map them in Tailwind:

```typescript
fontFamily: {
  heading: ['var(--font-heading)', 'serif'],
  body: ['var(--font-body)', 'sans-serif'],
}
```

- **Headings & logo**: `font-heading` (Cormorant Garamond) — every `h1`-`h4`, the site
  wordmark, and pull-quotes on the storefront (About/brand story). Use a heavier weight
  (600-700) since Cormorant is a delicate serif and thin weights disappear at small sizes.
- **Body**: `font-body` (Manrope) — everything else: paragraphs, labels, table cells, buttons,
  form inputs, nav links.
- **Numeric data** (prices, SKUs, order refs): `font-body` with `tabular-nums` for column
  alignment — no separate mono font.

### CSS Class Conventions
- Cards: `bg-brand-white rounded-xl border border-brand-border p-6` (on a `bg-brand-cream`
  page section, so cards read as elevated)
- Tables: `admin-table` class on `<table>`, `bg-brand-white`, zebra rows in `bg-brand-cream/40`
- Form inputs: `form-input` class — `bg-brand-white border border-brand-border focus:border-brand-black`
- Status badges: `status-pending`, `status-confirmed`, `status-processing`,
  `status-dispatched`, `status-pickup`, `status-completed`, `status-cancelled`
- Buttons primary: `bg-brand-black text-brand-white rounded-lg hover:bg-brand-black-soft`
- Buttons secondary: `bg-brand-white border border-brand-border text-brand-black hover:bg-brand-cream`
- Card hover: see section 6 — `hover:-translate-y-1 hover:shadow-lg transition-transform duration-200`

---

## 3. Project Structure

```
src/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx                # Home — Server Component, featured products, banners
│   │   ├── shop/page.tsx           # Product Listing — filters via searchParams
│   │   ├── shop/[slug]/page.tsx    # Product Detail — Server Component
│   │   ├── cart/page.tsx           # Cart — reads cart from cookie, server-rendered
│   │   ├── cart/actions.ts         # 'use server' — addToCart, updateQty, removeFromCart
│   │   ├── checkout/page.tsx       # Checkout form — Server Action on submit
│   │   ├── checkout/actions.ts     # 'use server' — placeOrder
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faqs/page.tsx
│   │   └── delivery-policy/page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Sidebar + top-bar shell — Server Component
│   │   ├── page.tsx                # Dashboard — Server Component, SVG charts
│   │   ├── AdminNotifications.tsx  # 'use client' — the one polling exception
│   │   ├── [module]/
│   │   │   ├── page.tsx            # List view — Server Component, searchParams filtering
│   │   │   ├── actions.ts          # 'use server' — create/update/delete for this module
│   │   │   ├── new/page.tsx        # Create form — plain <form action={createX}>
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Detail view — Server Component
│   │   │       ├── edit/page.tsx   # Edit form — plain <form action={updateX}>
│   │   │       └── delete/page.tsx # Confirm-delete page — plain <form action={deleteX}>
│   │   └── login/page.tsx          # 'use client' — Firebase client SDK sign-in
│   ├── api/
│   │   └── auth/
│   │       └── session/route.ts    # POST — exchanges Firebase ID token for a session cookie
│   └── layout.tsx                  # Root layout — fonts, Meta/TikTok pixel <script>
├── components/
│   ├── button.tsx                  # Server-renderable presentational button
│   ├── status-badge.tsx
│   └── storefront/                 # Customer-facing presentational components
├── lib/
│   ├── firebase.ts                 # Client-side Firebase init (login page only)
│   ├── firebase-admin.ts           # Server-side Firebase Admin init
│   ├── session.ts                  # getSession() — reads + verifies the session cookie via next/headers
│   ├── auth-guard.ts               # requirePermission() — call at the top of Server Components/Actions
│   ├── permissions.ts              # RBAC permission registry + built-in roles
│   ├── validations.ts              # Zod schemas for all entities
│   ├── utils.ts                    # cn(), formatPrice(), generateSKU(), slugify()
│   ├── email.ts                    # Brevo transactional email templates
│   └── cloudinary.ts               # Cloudinary config
└── types/
    └── index.ts                    # ALL TypeScript interfaces and type unions
```

---

## 4. Authentication Architecture (Session Cookie, Not Client Token-Per-Request)

The old pattern (`user.getIdToken()` on every client fetch, `Authorization: Bearer` header)
was client-rendering-shaped. The server-first replacement:

### Login (`app/admin/login/page.tsx` — the one auth Client Component)
- `'use client'`. Uses Firebase client SDK to sign in (email/password or Google).
- On success, gets the ID token and `POST`s it to `/api/auth/session`.
- That route verifies the token with `firebase-admin`, mints a Firebase session cookie
  (`adminAuth.createSessionCookie(idToken, { expiresIn })`), and sets it as an `httpOnly`,
  `secure` cookie.
- Redirects to `/admin`.

### Every other admin page (`lib/session.ts`)
```typescript
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) return null
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return { uid: decoded.uid, email: decoded.email, role: decoded.role }
  } catch {
    return null
  }
}
```
Server Components call `const session = await getSession()` directly — no client fetch, no
loading spinner for auth state, no flash-of-unauthenticated-content. `lib/auth-guard.ts` wraps
this with a permission check and `redirect('/admin/login')` if missing.

### Server Actions
Every `'use server'` mutation starts by calling `requirePermission('module:action')` before
touching Firestore — this replaces the old `withAuth(req, handler, permission)` API-route
wrapper. Same permission registry, same built-in roles, just invoked at the top of a function
instead of inside a route handler.

### Permission System (`lib/permissions.ts`)
- Permissions follow `module:action` format: `products:read`, `orders:write`, `categories:delete`
- Actions: `read`, `write`, `create`, `delete`
- Built-in roles: `superadmin` (all), `manager`, `fulfillment`, `support`
- Client mapping: Owner → `superadmin`, Staff → `manager` (see architecture.md for the full
  matrix and rationale)
- Custom roles stored in Firestore with `permissions: string[]`

---

## 5. Server Action Pattern (Replaces the API Route + Client Fetch Wrapper)

Every mutation follows this shape. No `/api/[module]/route.ts`, no client fetch wrapper — the
form calls the action directly.

```typescript
// app/admin/products/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'
import { productSchema } from '@/lib/validations'

export async function createProduct(formData: FormData) {
  const session = await requirePermission('products:write')

  const parsed = productSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    redirect(`/admin/products/new?flash=error:${encodeURIComponent('Validation failed')}`)
  }

  const now = new Date()
  await adminDb.collection('products').add({
    ...parsed.data,
    createdBy: session.uid,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/admin/products')
  redirect('/admin/products?flash=success:Product created')
}
```

And the form that calls it — no `onSubmit`, no client state, no `fetch`:

```tsx
// app/admin/products/new/page.tsx — Server Component
import { createProduct } from '../actions'

export default function NewProductPage() {
  return (
    <form action={createProduct} className="form-section space-y-4">
      <input name="name" required className="form-input" />
      {/* ...remaining fields... */}
      <button type="submit" className="btn-hover bg-brand-black text-brand-white px-4 py-2 rounded-lg">
        Create Product
      </button>
    </form>
  )
}
```

`revalidatePath()` after every mutation is what keeps list pages fresh — this is the SSR
replacement for the old client-side `setItems([...items, newItem])` state update.

### Filtering, Search, Pagination — via `searchParams`, Not `useState`

```tsx
// app/admin/orders/page.tsx — Server Component
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q, status, page = '1' } = await searchParams
  const orders = await fetchOrdersFiltered({ q, status, page: Number(page) })

  return (
    <div className="animate-in-stagger space-y-6">
      <form method="GET" className="relative max-w-md">
        <input name="q" defaultValue={q} placeholder="Search orders..." className="form-input" />
      </form>
      {/* Status filter tabs are plain <Link> elements with updated query strings */}
      <OrderTable orders={orders} />
    </div>
  )
}
```

---

## 6. Motion — CSS Only

No animation library, no `useRef` + `useEffect` for entrances. Two mechanisms:

### Entrance animations (page load) — pure CSS keyframes
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fade-in-up 0.4s ease-out both;
}

/* Stagger via nth-child, no JS loop */
.animate-in-stagger > * {
  animation: fade-in-up 0.4s ease-out both;
}
.animate-in-stagger > *:nth-child(1) { animation-delay: 0ms; }
.animate-in-stagger > *:nth-child(2) { animation-delay: 60ms; }
.animate-in-stagger > *:nth-child(3) { animation-delay: 120ms; }
.animate-in-stagger > *:nth-child(4) { animation-delay: 180ms; }
/* extend as needed, or generate with a small Tailwind plugin */
```
Apply `.animate-in` to the page header, `.animate-in-stagger` to the table/grid wrapper. This
runs entirely in CSS on server-rendered markup — zero JS shipped.

### Interaction animations — `transform` on `:hover`
This is the primary interactive-motion mechanism across the whole site, admin and storefront:

```css
.card-hover {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgb(21 18 16 / 0.12);
}

.btn-hover {
  transition: transform 150ms ease;
}
.btn-hover:hover {
  transform: scale(1.03);
}
.btn-hover:active {
  transform: scale(0.98);
}

.row-hover:hover {
  transform: translateX(2px);
}
```
Use `.card-hover` on product cards and admin stat cards, `.btn-hover` on primary CTAs ("Add to
Cart", "Place Order", form submit buttons), `.row-hover` on table rows. Always pair `transform`
with `transition`, never animate `top`/`left`/`width` (layout-triggering properties) —
`transform` and `opacity` are the only properties cheap enough to animate on scroll-heavy pages.

### Toast auto-dismiss — pure CSS, no `setTimeout`
```css
@keyframes toast-fade {
  0%, 85% { opacity: 1; }
  100%    { opacity: 0; }
}
.toast {
  animation: toast-fade 4s ease-in forwards;
}
```

---

## 7. Admin Layout Architecture

### Sidebar (`layout.tsx` — Server Component)
- Fixed width (260px) on desktop; on mobile, a CSS-only checkbox-driven off-canvas panel:
  `<input type="checkbox" id="sidebar-toggle" class="peer hidden" />` +
  `peer-checked:translate-x-0` on the panel — no client JS for the toggle itself.
- Navigation items filtered server-side by `session.permissions` before render — a user never
  even receives markup for modules they can't access.
- Active state: compare the current route segment against each item's `href` server-side.

### Top Bar
- Server-rendered: page title, user email + role, sign-out (`<form action={signOut}>`).
- `AdminNotifications` is the one client island here — isolate it to a small fixed-position
  component so the rest of the top bar stays server-rendered.

### Content Area
- No JS page-transition library. A subtle `.animate-in` on the content wrapper is enough;
  Next.js's own soft navigation (via `<Link>`) already avoids a full page flash.

---

## 8. Dashboard — Server-Rendered SVG Charts

Replace client charting libraries with inline SVG computed from `DashboardStats` at request time:

```tsx
function RevenueSparkline({ data }: { data: { day: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1)
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.revenue / max) * 100}`)
    .join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-24">
      <polyline points={points} fill="none" stroke="#151210" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
```
No tooltips, no client measurement, no hydration cost — trades interactivity for a genuinely
zero-JS dashboard. If the client later wants hover tooltips, that's a scoped, named exception
to add as a small client island around just the chart, not a reason to reintroduce a charting
library everywhere.

---

## 9. Validation Pattern (Zod, Used Inside Server Actions)

Define schemas in `lib/validations.ts`, same as before — only the call site changes (inside a
`'use server'` function instead of an API route handler):

```typescript
export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  // ... fields
})
export type ProductFormData = z.infer<typeof productSchema>
```

`FormData` values are all strings — coerce explicitly in the schema
(`z.coerce.number().int().min(0)` for `stockQty`, and check checkbox presence explicitly since
unchecked checkboxes are simply absent from `FormData`, not `false`).

---

## 10. Notification System — the One Documented Client Exception

### Toasts (flash messages via redirect + searchParam)
No client state array. A Server Component reads `searchParams.flash`, parses `type:message`,
and renders a `.toast` div with the CSS auto-dismiss animation from section 6.

### Admin Notification Bell (`AdminNotifications.tsx`)
```typescript
'use client'
// This is intentionally the one client component with real client-runtime logic:
// - Polls /api/admin/pending-count every 30s (a tiny JSON endpoint, not a data-heavy route)
// - Plays a Web Audio beep on new pending orders
// - Everything it renders is otherwise presentational; keep it small and isolated
```
Document this exception inline in the component with a comment explaining why it can't be a
Server Component, so future contributors don't "fix" it by removing `'use client'`.

---

## 11. Adding a New Module Checklist

When adding a new admin module (e.g., "Coupons"):

1. **Types**: Add interfaces to `src/types/index.ts`
2. **Validation**: Add Zod schema to `src/lib/validations.ts`
3. **Permissions**: Add `coupons:read`, `coupons:write`, `coupons:delete` to `src/lib/permissions.ts`
4. **Server Actions**: Create `src/app/admin/coupons/actions.ts` (`createCoupon`, `updateCoupon`, `deleteCoupon`), each starting with `requirePermission(...)`
5. **List Page**: Create `src/app/admin/coupons/page.tsx` — Server Component, `searchParams`-driven filtering
6. **Detail Page**: Create `src/app/admin/coupons/[id]/page.tsx` — Server Component
7. **Create/Edit Pages**: plain `<form action={...}>` pages, no client form state
8. **Delete Confirm Page**: `src/app/admin/coupons/[id]/delete/page.tsx`
9. **Sidebar**: Add navigation item to `SIDEBAR_ITEMS`, filtered server-side by permission
10. **Roles**: Update `BUILT_IN_ROLE_PERMISSIONS` to grant appropriate access

---

## 12. Currency & Locale

- Currency: **LKR** (Sri Lankan Rupee)
- Locale: `en-LK`
- Format: `LKR 12,500.00` via `formatPrice()` utility (tabular-nums, `font-body`)
- Phone validation: Sri Lankan format `^(?:\+94|0)\d{9}$`
- Date format: `toLocaleDateString('en-LK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })`

---

## 13. Critical Rules

1. **NEVER** add `'use client'` to a component by default — justify it against the allow-list in section 0 first
2. **ALWAYS** fetch data directly in Server Components via the Firestore Admin SDK — no client `fetch()` to your own API for data your server already has
3. **ALWAYS** use Server Actions (`'use server'`) for mutations, bound to `<form action={...}>`
4. **ALWAYS** call `requirePermission()` at the top of every Server Action and gated Server Component
5. **ALWAYS** drive filtering/search/pagination through `searchParams`, never client `useState`
6. **ALWAYS** call `revalidatePath()` (or `revalidateTag()`) after a mutation so list views stay fresh
7. **NEVER** trust client-submitted prices — always re-fetch/recompute from Firestore inside the Server Action
8. **ALWAYS** convert Firestore `Timestamp` to a plain `Date`/ISO string before passing data into JSX
9. **ALWAYS** filter sidebar/nav items server-side by permission — never render-then-hide
10. **ALWAYS** use `transform` (not `top`/`left`/`width`) for hover and interaction animation; always pair it with `transition`
11. **ALWAYS** use `font-heading` (Cormorant Garamond) for headings/logo and `font-body` (Manrope) for everything else — never fall back to system fonts silently
12. **ALWAYS** hide or disable `out_of_stock` products on the storefront; never let them be added to cart
13. **ALWAYS** decrement `stockQty` only after an order is confirmed (not on cart-add)
14. **ALWAYS** default checkout to COD — don't surface a payment gateway selector until PayHere is wired in Phase 4+
15. **ALWAYS** show ingredients/allergen info on Product Detail when present
16. **NEVER** reach for a client animation library, a client data-fetching library (SWR/React Query), or client global state (Redux/Zustand) — the server-first pattern in this skill replaces all three
17. **ALWAYS** use `cn()` for conditional class merging (clsx + tailwind-merge)

---

## 14. Marketing Pixel Events (Storefront)

Fire these via a small inline `<script>` in the root layout reading `SiteSettings.metaPixelId`
/ `SiteSettings.tiktokPixelId` (fetched server-side and interpolated at render time) — not a
client component:

| Event | Trigger |
|---|---|
| `PageView` | Every storefront route |
| `ViewContent` | Product Detail page load |
| `AddToCart` | Add-to-cart action (fire from the isolated client island in section 0) |
| `InitiateCheckout` | Checkout page load |
| `Purchase` | Order confirmation (COD order placed) — fire from an inline `<script>` on the server-rendered confirmation page |
