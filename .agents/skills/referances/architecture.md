# Admin Panel — Architecture Reference

This document is the exhaustive reference for implementing admin panels. Read this BEFORE writing any code.

---

## 1. Complete Type System

All types live in `src/types/index.ts`. Here is the complete type registry:

### Auth & Roles
```typescript
type BuiltInRole = 'superadmin' | 'manager' | 'fulfillment' | 'support'

interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: BuiltInRole | string   // string for custom roles
  phone?: string
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
}

interface CustomRole {
  id: string
  name: string
  permissions: string[]
  createdBy: string
  createdAt: Date
  isCustom: true
}
```

### Products
```typescript
type VisibilityStatus = 'published' | 'draft'
type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'low_stock'

interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number | null
  ingredients?: string          // e.g. "Flour, eggs, butter, sugar, vanilla"
  allergens?: string[]          // e.g. ['egg', 'dairy', 'gluten', 'nuts']
  sizeWeight?: string           // e.g. "1kg", "6 inch", "12 pcs box"
  flavor?: string               // e.g. "Chocolate Fudge", "Red Velvet"
  isCustomizable: boolean       // true for made-to-order items (custom cakes)
  leadTimeHours?: number        // prep/order lead time for made-to-order items
  isFeatured: boolean           // shown on Home "Featured" section
  stockQty: number
  images: string[]
  category: string
  subCategory: string
  availabilityStatus: AvailabilityStatus
  sku: string
  visibility: VisibilityStatus
  slug: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
}
```

> `isCustomizable` items (e.g. Custom Cakes) should surface extra checkout fields on the
> storefront — occasion, cake message text, and preferred pickup/delivery date — captured in
> `Order.notes` or a dedicated `customization` object on `OrderItem` if the client confirms
> this is needed at scope-lock.

### Categories
```typescript
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  subCategories: SubCategory[]
  order: number
  createdAt: Date
  updatedAt: Date
}

interface SubCategory {
  id: string
  name: string
  slug: string
  description?: string
}
```

### Default Category Seed (from research doc — confirm with client before launch)
```
Cakes
  ├── Custom Cakes
  └── Birthday Cakes
Desserts
  ├── Cupcakes
  └── Pastries
```
Estimated catalog size at launch: 20–50 SKUs, scalable. Category/sub-category management
must stay admin-editable — do not hardcode this list in components.

### Orders
```typescript
// Matches the client-confirmed workflow in the research doc:
// Pending -> Confirmed -> Processing -> Dispatched/Ready for Pickup -> Completed -> Cancelled
type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'dispatched'          // out for delivery
  | 'ready_for_pickup'    // alternative to dispatched, for pickup orders
  | 'completed'
  | 'cancelled'

type FulfilmentType = 'delivery' | 'pickup'

interface OrderItem {
  productId: string
  productName: string
  sku: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  orderRef: string          // Format: "CH-{timestamp36}-{random4}"
  items: OrderItem[]
  subtotal: number
  deliveryFee: number       // 0 for pickup orders
  total: number
  status: OrderStatus
  fulfilmentType: FulfilmentType
  paymentMethod: 'cod' | 'payhere'   // 'payhere' reserved for Phase 4+ rollout
  customer: CustomerInfo
  deliveryAddress?: DeliveryAddress  // required if fulfilmentType === 'delivery'
  notes?: string
  cancellationReason?: string
  trackingNumber?: string
  estimatedDeliveryDate?: string
  statusHistory: StatusHistoryEntry[]
  createdAt: Date
  updatedAt: Date
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  uid?: string
}

interface DeliveryAddress {
  addressLine1: string
  addressLine2?: string
  city: string
  district: string
  postalCode: string
}

interface StatusHistoryEntry {
  status: OrderStatus
  timestamp: Date
  updatedBy: string
  note?: string
}
```

### Customers
```typescript
type VerificationStatus = 'unverified' | 'verified' | 'suspended'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: DeliveryAddress
  orderCount: number
  totalSpent: number
  isRepeat: boolean
  firstOrderAt?: Date
  lastOrderAt?: Date
  createdAt: Date
  verificationStatus?: VerificationStatus
}
```

### Dashboard
```typescript
interface DashboardStats {
  ordersToday: number
  ordersThisWeek: number
  ordersThisMonth: number
  revenueToday: number
  revenueThisWeek: number
  revenueThisMonth: number
  pendingOrders: number
  lowStockProducts: number
  totalProducts: number
  totalCustomers: number
  revenueData: { day: string; revenue: number }[]
  ordersData: { day: string; orders: number; completed: number }[]
  recentActivities: { id: string; type: 'order' | 'product' | 'user'; message: string; time: string }[]
  revenueTrend: number    // % change vs yesterday
  ordersTrend: number     // absolute change vs yesterday
}
```

### Settings
```typescript
interface SiteSettings {
  siteName: string
  siteDescription: string
  ownerEmail: string
  ownerPhone: string
  currency: string           // 'LKR'
  codEnabled: boolean        // true at launch
  payhereEnabled: boolean    // false at launch — flip on in Phase 4+ once integrated
  pickupEnabled: boolean
  deliveryZones: DeliveryZone[]
  socialLinks: { tiktok?: string; instagram?: string; facebook?: string }
  metaPixelId?: string
  tiktokPixelId?: string
}

interface DeliveryZone {
  id: string
  name: string
  fee: number
  isActive: boolean
}
```

### API Response Envelope
```typescript
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
```

---

## 2. Permission Registry — Complete

```typescript
const PERMISSIONS = {
  DASHBOARD_READ:   'dashboard:read',
  PRODUCTS_READ:    'products:read',
  PRODUCTS_WRITE:   'products:write',
  PRODUCTS_DELETE:  'products:delete',
  ORDERS_READ:      'orders:read',
  ORDERS_WRITE:     'orders:write',
  ORDERS_CREATE:    'orders:create',
  CUSTOMERS_READ:   'customers:read',
  CUSTOMERS_WRITE:  'customers:write',
  INVENTORY_READ:   'inventory:read',
  INVENTORY_WRITE:  'inventory:write',
  CATEGORIES_READ:  'categories:read',
  CATEGORIES_WRITE: 'categories:write',
  CATEGORIES_DELETE:'categories:delete',
  MESSAGES_READ:    'messages:read',
  MESSAGES_WRITE:   'messages:write',
  MESSAGES_DELETE:  'messages:delete',
  MARKETING_READ:   'marketing:read',
  MARKETING_WRITE:  'marketing:write',
  ROLES_READ:       'roles:read',
  ROLES_WRITE:      'roles:write',
  ROLES_DELETE:     'roles:delete',
  USERS_READ:       'users:read',
  USERS_WRITE:      'users:write',
  SETTINGS_READ:    'settings:read',
  SETTINGS_WRITE:   'settings:write',
} as const

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
```

> **Client mapping**: the research doc only asks for two tiers — Owner (full access) and
> Staff (orders, inventory, customer communication; no settings/roles). At launch, map
> **Owner → `superadmin`** and **Staff → `manager`**. The full four-role matrix below stays
> available for when the client wants finer-grained staff access later (e.g. a
> delivery-only or support-only hire) without a schema change.

### Built-In Role Matrix

| Permission | superadmin | manager | fulfillment | support |
|---|---|---|---|---|
| dashboard:read | ✅ | ✅ | ✅ | ✅ |
| products:read | ✅ | ✅ | ❌ | ❌ |
| products:write | ✅ | ✅ | ❌ | ❌ |
| products:delete | ✅ | ❌ | ❌ | ❌ |
| orders:read | ✅ | ✅ | ✅ | ✅ |
| orders:write | ✅ | ✅ | ✅ | ❌ |
| orders:create | ✅ | ❌ | ❌ | ❌ |
| customers:read | ✅ | ✅ | ✅ | ✅ |
| customers:write | ✅ | ❌ | ❌ | ❌ |
| inventory:read | ✅ | ✅ | ❌ | ❌ |
| inventory:write | ✅ | ✅ | ❌ | ❌ |
| categories:read | ✅ | ✅ | ❌ | ❌ |
| categories:write | ✅ | ❌ | ❌ | ❌ |
| categories:delete | ✅ | ❌ | ❌ | ❌ |
| messages:read | ✅ | ✅ | ❌ | ✅ |
| messages:write | ✅ | ✅ | ❌ | ✅ |
| messages:delete | ✅ | ✅ | ❌ | ❌ |
| marketing:read | ✅ | ✅ | ❌ | ❌ |
| marketing:write | ✅ | ✅ | ❌ | ❌ |
| roles:* | ✅ | ❌ | ❌ | ❌ |
| users:* | ✅ | ❌ | ❌ | ❌ |
| settings:* | ✅ | ❌ | ❌ | ❌ |

---

## 3. Order Status State Machine

```
pending → processing → dispatched → delivered (terminal)
pending → cancelled (terminal)
processing → cancelled (terminal)
dispatched → cancelled (terminal)
```

Valid transitions:
```typescript
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:          ['confirmed', 'cancelled'],
  confirmed:        ['processing', 'cancelled'],
  processing:       ['dispatched', 'ready_for_pickup', 'cancelled'],
  dispatched:       ['completed', 'cancelled'],
  ready_for_pickup: ['completed', 'cancelled'],
  completed:        [],   // terminal
  cancelled:        [],   // terminal
}
```
`dispatched` applies when `fulfilmentType === 'delivery'`; `ready_for_pickup` applies when
`fulfilmentType === 'pickup'`. The admin order detail UI should only offer the transition
that matches the order's `fulfilmentType`.

Cancellation REQUIRES a reason string.

Status display config:
```typescript
const STATUS_CONFIG: Record<OrderStatus, { label: string; class: string; icon: ReactNode }> = {
  pending:          { label: 'Pending',           class: 'status-pending',    icon: <Clock /> },
  confirmed:        { label: 'Confirmed',         class: 'status-confirmed',  icon: <CheckCircle2 /> },
  processing:       { label: 'Processing',        class: 'status-processing', icon: <Package /> },
  dispatched:       { label: 'Dispatched',        class: 'status-dispatched', icon: <Truck /> },
  ready_for_pickup: { label: 'Ready for Pickup',  class: 'status-pickup',     icon: <ShoppingBag /> },
  completed:        { label: 'Completed',         class: 'status-completed', icon: <CheckCircle /> },
  cancelled:        { label: 'Cancelled',         class: 'status-cancelled', icon: <XCircle /> },
}
```

---

## 4. Server Data Access & Server Action — Complete Function List

There is no client fetch wrapper anymore. Reads happen directly inside Server Components via
small helper functions in `src/lib/data/*.ts` (plain `async function`, no `token` param — auth
comes from `getSession()` reading the request's cookies); writes are `'use server'` Server
Actions colocated with each route in `actions.ts`, taking `FormData` and starting with
`requirePermission(...)`.

```typescript
// src/lib/data/*.ts — called directly from Server Components, e.g.:
// const stats = await fetchDashboardStats()

// Dashboard
fetchDashboardStats(): Promise<DashboardStats>

// Products
fetchProducts(params?: { q?: string; category?: string; page?: number }): Promise<Product[]>
fetchProduct(id: string): Promise<Product | null>

// Orders
fetchOrders(params?: { q?: string; status?: string; page?: number }): Promise<Order[]>
fetchOrder(orderId: string): Promise<Order | null>

// Customers
fetchCustomers(): Promise<Customer[]>

// Categories
fetchCategories(): Promise<Category[]>

// Users
fetchUsers(): Promise<UserProfile[]>

// Roles
fetchRoles(): Promise<CustomRole[]>

// Messages
fetchMessages(): Promise<Message[]>

// Marketing & Content
fetchMarketingContent(): Promise<MarketingContent>   // banners, promos, SEO copy

// Settings
fetchSettings(): Promise<SiteSettings>

// Inventory
fetchInventory(): Promise<Product[]>
```

```typescript
// src/app/admin/[module]/actions.ts — 'use server', bound to <form action={...}>

// Orders
updateOrderStatus(formData: FormData)   // { orderId, status, note?, cancellationReason? }
updateOrderDetails(formData: FormData)
createOrder(formData: FormData)         // manual/phone order entry by staff

// Customers
updateCustomer(formData: FormData)
deleteCustomer(formData: FormData)

// Marketing & Content
updateMarketingContent(formData: FormData)

// Settings
updateSettings(formData: FormData)

// Inventory
updateInventoryStock(formData: FormData)   // { productId, newStockQty }
```

Every function above ends with `revalidatePath()` for the pages it affects and a `redirect()`
carrying a `?flash=success:...` message back to the caller.

---

## 5. Utility Functions

```typescript
// Class merging (clsx + tailwind-merge)
cn(...inputs: ClassValue[]): string

// Currency formatting
formatPrice(amount?: number | null): string
// Output: "LKR 12,500.00"

// SKU generation
generateSKU(category: string, index: number): string
// Output: "CH-CAK-0001" (Cakes), "CH-DES-0001" (Desserts)

// Order reference generation
generateOrderRef(): string
// Output: "CH-M3K2J1-A4BF"

// Text truncation
truncate(str: string, length: number): string

// URL slug generation
slugify(str: string): string
```

---

## 6. Sidebar Navigation Items

```typescript
const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard',  href: '/admin',            permission: 'dashboard:read',  icon: <LayoutDashboard /> },
  { label: 'Products',   href: '/admin/products',   permission: 'products:read',   icon: <Package /> },
  { label: 'Orders',     href: '/admin/orders',     permission: 'orders:read',     icon: <ShoppingCart /> },
  { label: 'Customers',  href: '/admin/customers',  permission: 'customers:read',  icon: <Users /> },
  { label: 'Inventory',  href: '/admin/inventory',  permission: 'inventory:read',  icon: <Boxes /> },
  { label: 'Categories', href: '/admin/categories', permission: 'categories:read', icon: <FolderTree /> },
  { label: 'Roles',      href: '/admin/roles',      permission: 'roles:read',      icon: <Shield /> },
  { label: 'Users',      href: '/admin/users',      permission: 'users:read',      icon: <UserCog /> },
  { label: 'Messages',   href: '/admin/messages',   permission: 'messages:read',   icon: <MessageSquare /> },
  { label: 'Marketing',  href: '/admin/marketing',  permission: 'marketing:read',  icon: <Megaphone /> },
  { label: 'Settings',   href: '/admin/settings',   permission: 'settings:read',   icon: <Settings /> },
]
```

---

## 7. CSS Motion Presets

No JS animation library. Defined as global utility classes (e.g. in `globals.css`), applied
directly on server-rendered markup:

```css
@keyframes fade-in-up   { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fade-in      { from { opacity: 0; } to { opacity: 1; } }
@keyframes scale-in     { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes slide-in-r   { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slide-in-l   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes toast-fade   { 0%, 85% { opacity: 1; } 100% { opacity: 0; } }

.animate-fade-in-up  { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-fade-in     { animation: fade-in 0.4s ease-out both; }
.animate-scale-in    { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.animate-slide-in-r  { animation: slide-in-r 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-slide-in-l  { animation: slide-in-l 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-toast-fade  { animation: toast-fade 4s ease-in forwards; }

/* Stagger children with no JS — cap at ~8 direct children, generate more delays if needed */
.animate-in-stagger > *      { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-in-stagger > *:nth-child(1) { animation-delay: 0ms;   }
.animate-in-stagger > *:nth-child(2) { animation-delay: 60ms;  }
.animate-in-stagger > *:nth-child(3) { animation-delay: 120ms; }
.animate-in-stagger > *:nth-child(4) { animation-delay: 180ms; }
.animate-in-stagger > *:nth-child(5) { animation-delay: 240ms; }
.animate-in-stagger > *:nth-child(6) { animation-delay: 300ms; }
.animate-in-stagger > *:nth-child(7) { animation-delay: 360ms; }
.animate-in-stagger > *:nth-child(8) { animation-delay: 420ms; }

/* Hover interaction — transform-driven, per design requirement */
.card-hover { transition: transform 200ms ease, box-shadow 200ms ease; }
.card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgb(21 18 16 / 0.12); }

.btn-hover { transition: transform 150ms ease; }
.btn-hover:hover  { transform: scale(1.03); }
.btn-hover:active { transform: scale(0.98); }

.row-hover { transition: transform 150ms ease; }
.row-hover:hover { transform: translateX(2px); }
```
`counterUp` (GSAP's animated number tick) has no CSS equivalent worth the complexity — just
render the final number. If the client specifically wants a count-up effect later, that's a
scoped client island around a single number, not a reason to reintroduce a JS animation
library site-wide.

---

## 8. Zod Validation Schemas — Complete

```typescript
// Products
const productSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  ingredients: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  sizeWeight: z.string().optional(),
  flavor: z.string().optional(),
  isCustomizable: z.boolean().default(false),
  leadTimeHours: z.number().int().min(0).optional(),
  isFeatured: z.boolean().default(false),
  stockQty: z.number().int().min(0),
  category: z.string().min(1),
  subCategory: z.string().min(1),
  visibility: z.enum(['published', 'draft']),
  sku: z.string().min(1),
  images: z.array(z.string()).optional(),
  cost: z.number().min(0).optional(),
})

// Checkout (customer orders) — address fields required only for delivery
const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^(?:\+94|0)\d{9}$/),
  fulfilmentType: z.enum(['delivery', 'pickup']),
  addressLine1: z.string().min(5).optional(),
  addressLine2: z.string().optional(),
  city: z.string().min(2).optional(),
  district: z.string().min(2).optional(),
  postalCode: z.string().min(4).optional(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => data.fulfilmentType !== 'delivery' || (data.addressLine1 && data.city && data.district && data.postalCode),
  { message: 'Delivery address is required for delivery orders', path: ['addressLine1'] }
)

// Categories
const categorySchema = z.object({
  name: z.string().min(2).max(60),
  description: z.string().max(200).optional(),
})

// Custom Roles
const customRoleSchema = z.object({
  name: z.string().min(2).max(40),
  permissions: z.array(z.string()).min(1),
})

// User Invites
const userInviteSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2),
  role: z.string().min(1),
})

// Settings
const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  siteDescription: z.string().max(300),
  ownerEmail: z.string().email(),
  ownerPhone: z.string(),
  codEnabled: z.boolean(),
  socialLinks: z.object({
    tiktok: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }),
  metaPixelId: z.string().optional(),
  tiktokPixelId: z.string().optional(),
})
```

---

## 9. Email Template Structure

Emails are sent via the **Brevo** free-tier transactional email API (per research doc; can be
swapped for a Firebase Cloud Functions email trigger if the client prefers). Key templates:

1. **Order Confirmation** — sent to customer on order placement (states COD + fulfilment type)
2. **New Order Alert** — sent to admin when a new order is placed
3. **Order Status Update** — sent to customer when status changes (including `confirmed`,
   `ready_for_pickup`, and `completed`)
4. **Order Cancellation** — sent to customer with cancellation reason

All email functions are fire-and-forget (`.catch()` to prevent blocking the API response).

---

## 10. Dashboard Stat Cards Pattern

```typescript
const statCards = [
  { label: 'Revenue Today',  value: stats.revenueToday,    format: 'currency', icon: <DollarSign />,     color: 'text-brand-black',  bgColor: 'bg-brand-cream', trend: '+12%' },
  { label: 'Orders Today',   value: stats.ordersToday,     format: 'number',   icon: <ShoppingCart />,   color: 'text-brand-black',  bgColor: 'bg-brand-cream', trend: '+5' },
  { label: 'Pending Orders', value: stats.pendingOrders,   format: 'number',   icon: <Clock />,          color: 'text-brand-black',  bgColor: 'bg-brand-cream' },
  { label: 'Low Stock Alert', value: stats.lowStockProducts, format: 'number', icon: <AlertTriangle />,  color: 'text-brand-danger', bgColor: 'bg-brand-danger/10' },
]
```

Render each as (Server Component — no client measurement, entrance via `.animate-fade-in-up`,
hover via `.card-hover`):
```tsx
<div className="stat-card bg-brand-white rounded-xl border border-brand-border p-5 card-hover animate-fade-in-up relative overflow-hidden">
  <div className="relative z-10">
    {/* Icon + label + value + optional trend indicator */}
  </div>
  <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-cream rounded-full blur-2xl" />
</div>
```

---

## 11. Chart Configuration (Server-Rendered SVG, No Client Library)

Charts are computed once on the server from `DashboardStats` and rendered as static SVG — no
Recharts, no client measurement/hydration, no tooltip interactivity by default.

### Line Chart (Revenue)
```tsx
function RevenueLineChart({ data }: { data: { day: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1)
  const w = 600, h = 240, pad = 24
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - (d.revenue / max) * (h - pad * 2)
    return `${x},${y}`
  })
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-60">
      {/* Gridlines */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={pad} x2={w - pad} y1={pad + (i * (h - pad * 2)) / 3} y2={pad + (i * (h - pad * 2)) / 3}
          stroke="#E7DDC9" strokeWidth="1" />
      ))}
      <polyline points={points.join(' ')} fill="none" stroke="#151210" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p, i) => {
        const [x, y] = p.split(',')
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#151210" />
      })}
      {data.map((d, i) => (
        <text key={i} x={pad + (i / (data.length - 1)) * (w - pad * 2)} y={h - 4}
          fontSize="10" fill="#8B8178" textAnchor="middle">{d.day}</text>
      ))}
    </svg>
  )
}
```
Labels format as `LKR {value.toLocaleString()}` via `formatPrice()` wherever a numeric value
is rendered as text next to the chart (e.g. a legend or axis-max label) — the SVG itself has
no built-in formatter, so format before interpolating into `<text>`.

### Bar Chart (Orders)
```tsx
function OrdersBarChart({ data }: { data: { day: string; orders: number; completed: number }[] }) {
  const max = Math.max(...data.map((d) => d.orders), 1)
  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col justify-end h-40 gap-0.5">
            <div className="w-full rounded-t bg-brand-black card-hover" style={{ height: `${(d.orders / max) * 100}%` }} />
            <div className="w-full rounded-t bg-brand-muted" style={{ height: `${(d.completed / max) * 60}%` }} />
          </div>
          <span className="text-[10px] text-brand-muted">{d.day}</span>
        </div>
      ))}
    </div>
  )
}
```
If the client later needs hover tooltips on the bars, wrap just the tooltip layer in a small
`'use client'` island — don't convert the whole chart back to a client component for it.

---

## 12. Firebase Configuration

### Client (`lib/firebase.ts`)
```typescript
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = { /* from env */ }
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
```

### Admin (`lib/firebase-admin.ts`)
```typescript
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({ credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })})
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
```

### Session Exchange Route (`app/api/auth/session/route.ts`)
The only place an ID token is handled server-side, converting it into a long-lived httpOnly
cookie so no further request needs to carry a bearer token:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  const { idToken } = await req.json()
  const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

  const res = NextResponse.json({ success: true })
  res.cookies.set('session', sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })
  return res
}
```

### Session Reader (`lib/session.ts`) + Guard (`lib/auth-guard.ts`)
```typescript
// lib/session.ts
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'

export async function getSession() {
  const sessionCookie = (await cookies()).get('session')?.value
  if (!sessionCookie) return null
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return { uid: decoded.uid, email: decoded.email ?? '', role: (decoded.role as string) ?? 'support' }
  } catch {
    return null
  }
}

// lib/auth-guard.ts
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { hasPermission } from './permissions'

export async function requirePermission(permission: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!hasPermission(session.role, permission)) redirect('/admin?flash=error:Not authorized')
  return session
}
```

---

## 13. Firestore Collection Structure

```
/orders/{orderId}
/products/{productId}
/categories/{categoryId}
/customers/{customerId}
/users/{uid}
  /cart/{productId}
/roles/{roleId}
/settings/site
/marketing/content        // homepage banners, promos, SEO copy, social links
```

---

## 14. Dependency Install Command

```bash
npm install next react react-dom firebase firebase-admin lucide-react zod @getbrevo/brevo clsx tailwind-merge cloudinary date-fns
npm install -D tailwindcss @tailwindcss/postcss @types/react @types/react-dom typescript
```

Deliberately **not installed**: `gsap`, `@gsap/react` (replaced by CSS in section 7),
`recharts` (replaced by server-rendered SVG in section 11), `resend` (replaced by
`@getbrevo/brevo`), `react-hot-toast` (replaced by the flash-message + `.animate-toast-fade`
pattern — a client toast library has no role in a server-first app). Fonts come from
`next/font/google` (Cormorant Garamond + Manrope), which needs no separate package.
