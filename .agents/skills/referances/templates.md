# Creamy Heaven — Code Templates (Server-First)

Copy-paste-ready templates for each type of file in the app. `Entity` is a placeholder — swap
in `Product`, `Order`, `Category`, `Customer`, or `MarketingContent` for real modules.

These templates replace the old client-rendered set entirely: **no `'use client'`, no
`useState`/`useEffect` for data, no fetch wrapper.** List pages are Server Components that
read `searchParams`; mutations are Server Actions bound to plain `<form>` elements. Template 7
covers the public, unauthenticated storefront checkout, which is a different trust boundary
from the authenticated admin templates.

---

## Template 1: List Page (`/admin/[module]/page.tsx`) — Server Component

```tsx
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchEntities } from '@/lib/data/entities'
import { formatDate } from '@/lib/utils'
import { EntityRowActions } from './row-actions'
import { FlashMessage } from '@/components/flash-message'

export default async function EntitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; flash?: string }>
}) {
  await requirePermission('entities:read')
  const { q, flash } = await searchParams
  const items = await fetchEntities({ q })

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      {/* Header */}
      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Entities</h1>
          <p className="text-brand-muted text-sm mt-1">{items.length} total</p>
        </div>
        <Link
          href="/admin/entities/new"
          className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Entity
        </Link>
      </div>

      {/* Search — plain GET form, no client state */}
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search..."
          className="form-input pl-10 bg-brand-white border border-brand-border rounded-lg w-full py-2"
        />
      </form>

      {/* Table */}
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead className="bg-brand-cream">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">Created</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="animate-in-stagger divide-y divide-brand-border">
              {items.map((item) => (
                <tr key={item.id} className="row-hover">
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-black">{item.name}</p>
                  </td>
                  <td className="px-4 py-3">{/* Status badge */}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-brand-muted font-body tabular-nums">
                      {formatDate(item.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* Row actions is a tiny CSS-only <details>/<summary> dropdown — see below */}
                    <EntityRowActions id={item.id} />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <p className="text-brand-muted text-sm">No items found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

### CSS-only row actions dropdown (no client JS, no `activeMenu` state)

`<details>`/`<summary>` gives a free, accessible, JS-free dropdown:

```tsx
// components/entity-row-actions.tsx — Server Component, no 'use client'
import Link from 'next/link'
import { Eye, Edit2, Trash2, MoreVertical } from 'lucide-react'

export function EntityRowActions({ id }: { id: string }) {
  return (
    <details className="relative [&_summary::-webkit-details-marker]:hidden">
      <summary className="list-none cursor-pointer p-1.5 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream transition-colors">
        <MoreVertical className="w-4 h-4" />
      </summary>
      <div className="absolute right-0 top-full mt-1 w-40 bg-brand-white border border-brand-border rounded-lg shadow-xl z-10 py-1 animate-scale-in">
        <Link href={`/admin/entities/${id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-brand-black hover:bg-brand-cream">
          <Eye className="w-3.5 h-3.5" /> View
        </Link>
        <Link href={`/admin/entities/${id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm text-brand-black hover:bg-brand-cream">
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </Link>
        <Link href={`/admin/entities/${id}/delete`} className="flex items-center gap-2 px-3 py-2 text-sm text-brand-danger hover:bg-brand-danger/10">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </Link>
      </div>
    </details>
  )
}
```
`<details>` closes on outside click natively in most browsers via focus loss on navigation;
for a guaranteed close-on-click-outside without JS, this is an accepted minor trade-off of the
zero-JS approach — acceptable for an internal admin tool.

### Flash message component (replaces the client toast array)

```tsx
// components/flash-message.tsx — Server Component
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function FlashMessage({ value }: { value?: string }) {
  if (!value) return null
  const [type, ...rest] = value.split(':')
  const message = rest.join(':')
  const isSuccess = type === 'success'

  return (
    <div
      className={`animate-toast-fade fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border ${
        isSuccess
          ? 'bg-brand-white text-brand-black border-brand-border'
          : 'bg-brand-danger/10 text-brand-danger border-brand-danger/30'
      }`}
    >
      {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  )
}
```
No `setTimeout`, no client state — `.animate-toast-fade` (defined in architecture.md section 7)
handles the auto-dismiss purely in CSS.

---

## Template 2: Server Actions (`/admin/[module]/actions.ts`)

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'
import { entitySchema } from '@/lib/validations'

export async function createEntity(formData: FormData) {
  const session = await requirePermission('entities:write')

  const parsed = entitySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const msg = encodeURIComponent(Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Validation failed')
    redirect(`/admin/entities/new?flash=error:${msg}`)
  }

  const now = new Date()
  await adminDb.collection('entities').add({
    ...parsed.data,
    createdBy: session.uid,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/admin/entities')
  redirect('/admin/entities?flash=success:Entity created')
}

export async function updateEntity(id: string, formData: FormData) {
  await requirePermission('entities:write')

  const parsed = entitySchema.partial().safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    redirect(`/admin/entities/${id}/edit?flash=error:Validation failed`)
  }

  await adminDb.collection('entities').doc(id).update({
    ...parsed.data,
    updatedAt: new Date(),
  })

  revalidatePath('/admin/entities')
  revalidatePath(`/admin/entities/${id}`)
  redirect(`/admin/entities/${id}?flash=success:Entity updated`)
}

export async function deleteEntity(id: string) {
  await requirePermission('entities:delete')

  const doc = await adminDb.collection('entities').doc(id).get()
  if (!doc.exists) {
    redirect('/admin/entities?flash=error:Entity not found')
  }

  await adminDb.collection('entities').doc(id).delete()

  revalidatePath('/admin/entities')
  redirect('/admin/entities?flash=success:Entity deleted')
}
```

`updateEntity`/`deleteEntity` take `id` as a bound argument via `.bind(null, id)` when wired
to a form — see Template 4.

---

## Template 3: Server Data Access (`lib/data/entities.ts`)

Reads have no auth wrapper of their own — the calling Server Component already ran
`requirePermission()` before calling this, so these stay thin:

```typescript
import { adminDb } from '@/lib/firebase-admin'
import type { Entity } from '@/types'

function toEntity(doc: FirebaseFirestore.QueryDocumentSnapshot): Entity {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Entity
}

export async function fetchEntities(params?: { q?: string }): Promise<Entity[]> {
  let query = adminDb.collection('entities').orderBy('createdAt', 'desc').limit(100)
  const snapshot = await query.get()
  let items = snapshot.docs.map(toEntity)

  // Firestore doesn't do full-text search — filter server-side post-fetch for small
  // collections, or wire up Algolia/Typesense if the catalog grows past a few hundred items.
  if (params?.q) {
    const q = params.q.toLowerCase()
    items = items.filter((item) => item.name.toLowerCase().includes(q))
  }
  return items
}

export async function fetchEntity(id: string): Promise<Entity | null> {
  const doc = await adminDb.collection('entities').doc(id).get()
  return doc.exists ? toEntity(doc as FirebaseFirestore.QueryDocumentSnapshot) : null
}
```

---

## Template 4: Create/Edit/Delete Forms — Plain `<form action={...}>`

### Create form
```tsx
// app/admin/entities/new/page.tsx
import { requirePermission } from '@/lib/auth-guard'
import { createEntity } from '../actions'

export default async function NewEntityPage() {
  await requirePermission('entities:write')

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-brand-black">New Entity</h1>
      <form action={createEntity} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-brand-black">Name</label>
          <input name="name" required className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2 mt-1" />
        </div>
        <button type="submit" className="btn-hover bg-brand-black text-brand-white px-4 py-2 rounded-lg font-medium">
          Create Entity
        </button>
      </form>
    </div>
  )
}
```

### Edit form (bind the id into the action)
```tsx
// app/admin/entities/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchEntity } from '@/lib/data/entities'
import { updateEntity } from '../../actions'

export default async function EditEntityPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('entities:write')
  const { id } = await params
  const entity = await fetchEntity(id)
  if (!entity) notFound()

  const updateWithId = updateEntity.bind(null, id)

  return (
    <form action={updateWithId} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
      <input name="name" defaultValue={entity.name} required className="form-input w-full bg-brand-white border border-brand-border rounded-lg px-3 py-2" />
      <button type="submit" className="btn-hover bg-brand-black text-brand-white px-4 py-2 rounded-lg font-medium">
        Save Changes
      </button>
    </form>
  )
}
```

### Delete confirmation page (replaces the client modal entirely)
```tsx
// app/admin/entities/[id]/delete/page.tsx
import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchEntity } from '@/lib/data/entities'
import { deleteEntity } from '../../actions'

export default async function DeleteEntityPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('entities:delete')
  const { id } = await params
  const entity = await fetchEntity(id)
  if (!entity) notFound()

  const deleteWithId = deleteEntity.bind(null, id)

  return (
    <div className="animate-scale-in max-w-sm mx-auto bg-brand-white border border-brand-border rounded-xl p-6 space-y-4">
      <h2 className="font-heading text-lg font-semibold text-brand-black">Delete "{entity.name}"?</h2>
      <p className="text-brand-muted text-sm">This action cannot be undone.</p>
      <div className="flex gap-3">
        <a href="/admin/entities" className="btn-hover flex-1 text-center px-4 py-2 border border-brand-border rounded-lg text-brand-black">
          Cancel
        </a>
        <form action={deleteWithId} className="flex-1">
          <button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-danger text-white rounded-lg">
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}
```
This whole flow — click Delete, land on a real confirm page, submit a real form — works with
JavaScript completely disabled, which a client modal with `deleteConfirmId` state never could.

---

## Template 5: Detail/View Page (`/admin/[module]/[id]/page.tsx`) — Server Component

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchEntity } from '@/lib/data/entities'

export default async function ViewEntityPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('entities:read')
  const { id } = await params
  const entity = await fetchEntity(id)
  if (!entity) notFound()

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/entities" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">{entity.name}</h1>
          <p className="text-brand-muted text-sm mt-1 font-body tabular-nums">
            Created {entity.createdAt.toLocaleDateString('en-LK', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="animate-in-stagger grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Details</h2>
            {/* Content here */}
          </div>
        </div>
        <div className="space-y-6">
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 space-y-4 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Metadata</h2>
            {/* Metadata here */}
          </div>
        </div>
      </div>
    </div>
  )
}
```
`notFound()` renders the App Router's built-in 404 boundary — no manual loading/not-found
state handling needed like the old `if (loading) ... if (!entity) ...` client pattern.

---

## Template 6: Mobile Sidebar Toggle — CSS-Only, No Client JS

```tsx
// app/admin/layout.tsx (excerpt) — Server Component
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      {/* Overlay — closes the sidebar by unchecking via a <label> covering the screen */}
      <label
        htmlFor="sidebar-toggle"
        className="hidden peer-checked:block fixed inset-0 bg-brand-black/40 z-30 lg:hidden"
      />

      <aside
        className="fixed lg:static top-0 left-0 h-full w-64 bg-brand-cream border-r border-brand-border z-40
                   -translate-x-full peer-checked:translate-x-0 lg:translate-x-0 transition-transform duration-300"
      >
        {/* nav items */}
      </aside>

      <label htmlFor="sidebar-toggle" className="lg:hidden btn-hover inline-block p-2 cursor-pointer">
        {/* hamburger icon */}
      </label>

      <main className="animate-fade-in-up">{children}</main>
    </div>
  )
}
```
The `peer`/`peer-checked` pattern drives the entire open/close interaction through the
browser's native checkbox state — zero bytes of JS for a component that, in the old skill,
required a client component with `useState`.

---

## Template 7: Public Checkout — Server Action (Not an API Route)

Checkout is called by an anonymous storefront visitor via a plain `<form>`. Prefer a Server
Action over a `/api/checkout` route handler here too — it's still form-native, still works
without JS, and skips a hand-rolled fetch/JSON boundary. Validate hard, re-fetch prices
server-side (never trust the client cart), decrement stock, and fire the confirmation email +
admin alert.

```typescript
// app/(storefront)/checkout/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { adminDb } from '@/lib/firebase-admin'
import { checkoutSchema } from '@/lib/validations'
import { generateOrderRef } from '@/lib/utils'
import { getCart, clearCart } from '@/lib/cart'
import { sendOrderConfirmationEmail, sendNewOrderAlertEmail } from '@/lib/email'

export async function placeOrder(formData: FormData) {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const msg = encodeURIComponent(Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Please check your details')
    redirect(`/checkout?flash=error:${msg}`)
  }

  const cartItems = await getCart() // reads from the storefront cart cookie, server-side
  if (cartItems.length === 0) {
    redirect('/cart?flash=error:Your cart is empty')
  }

  const orderItems = []
  let subtotal = 0
  for (const { productId, quantity } of cartItems) {
    const doc = await adminDb.collection('products').doc(productId).get()
    if (!doc.exists) redirect(`/cart?flash=error:A product in your cart is no longer available`)
    const product = doc.data()!
    if (product.availabilityStatus === 'out_of_stock' || product.stockQty < quantity) {
      redirect(`/cart?flash=error:${encodeURIComponent(product.name)} is out of stock`)
    }
    orderItems.push({
      productId: doc.id, productName: product.name, sku: product.sku,
      price: product.price, quantity, image: product.images?.[0],
    })
    subtotal += product.price * quantity
  }

  const deliveryFee = parsed.data.fulfilmentType === 'delivery' ? Number(formData.get('deliveryFee') ?? 0) : 0
  const now = new Date()
  const orderRef = generateOrderRef()

  const orderData = {
    orderRef,
    items: orderItems,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: 'pending' as const,
    fulfilmentType: parsed.data.fulfilmentType,
    paymentMethod: 'cod' as const,
    customer: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone },
    deliveryAddress: parsed.data.fulfilmentType === 'delivery' ? {
      addressLine1: parsed.data.addressLine1!, addressLine2: parsed.data.addressLine2,
      city: parsed.data.city!, district: parsed.data.district!, postalCode: parsed.data.postalCode!,
    } : undefined,
    notes: parsed.data.notes,
    statusHistory: [{ status: 'pending', timestamp: now, updatedBy: 'system' }],
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await adminDb.collection('orders').add(orderData)

  for (const item of orderItems) {
    await adminDb.collection('products').doc(item.productId).update({
      stockQty: FieldValue.increment(-item.quantity),
    })
  }

  await clearCart()
  sendOrderConfirmationEmail(orderData).catch((e) => console.error('order confirmation email failed', e))
  sendNewOrderAlertEmail(orderData).catch((e) => console.error('admin alert email failed', e))

  revalidatePath('/admin/orders')
  redirect(`/order-confirmation/${docRef.id}?ref=${orderRef}`)
}
```

```tsx
// app/(storefront)/checkout/page.tsx — Server Component
import { placeOrder } from './actions'
import { getCart } from '@/lib/cart'

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  const { flash } = await searchParams
  const cart = await getCart()

  return (
    <form action={placeOrder} className="animate-fade-in-up max-w-lg mx-auto space-y-4">
      <h1 className="font-heading text-3xl font-semibold text-brand-black">Checkout</h1>
      <p className="text-sm text-brand-muted">Cash on Delivery available — pay when your order arrives.</p>
      {/* name / email / phone / fulfilmentType radio (delivery|pickup) / address fields / notes */}
      <button type="submit" className="btn-hover w-full bg-brand-black text-brand-white py-3 rounded-lg font-medium">
        Place Order (COD)
      </button>
    </form>
  )
}
```
The confirmation page (`/order-confirmation/[id]`) is itself a Server Component that fetches
the order once and renders it — no client polling, no "thank you" state held in memory.
