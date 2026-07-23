/* ================================================================
   Creamy Heaven — Complete Type System
   All interfaces and type unions for the admin panel
   ================================================================ */

// ── Auth & Roles ──────────────────────────────────────────────────

export type BuiltInRole = 'superadmin' | 'manager' | 'fulfillment' | 'support'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: BuiltInRole | string
  phone?: string
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
}

export interface CustomRole {
  id: string
  name: string
  permissions: string[]
  createdBy: string
  createdAt: Date
  isCustom: true
}

export interface SessionData {
  uid: string
  email: string
  role: string
}

// ── Products ──────────────────────────────────────────────────────

export type VisibilityStatus = 'published' | 'draft'
export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'low_stock'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number | null
  ingredients?: string
  allergens?: string[]
  sizeWeight?: string
  flavor?: string
  isCustomizable: boolean
  leadTimeHours?: number
  isFeatured: boolean
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

// ── Categories ────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  subCategories: SubCategory[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface SubCategory {
  id: string
  name: string
  slug: string
  description?: string
}

// ── Orders ────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled'

export type FulfilmentType = 'delivery' | 'pickup'

export interface OrderItem {
  productId: string
  productName: string
  sku: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  orderRef: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  fulfilmentType: FulfilmentType
  paymentMethod: 'cod' | 'payhere'
  customer: CustomerInfo
  deliveryAddress?: DeliveryAddress
  notes?: string
  cancellationReason?: string
  trackingNumber?: string
  estimatedDeliveryDate?: string
  statusHistory: StatusHistoryEntry[]
  createdAt: Date
  updatedAt: Date
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  uid?: string
}

export interface DeliveryAddress {
  addressLine1: string
  addressLine2?: string
  city: string
  district: string
  postalCode: string
}

export interface StatusHistoryEntry {
  status: OrderStatus
  timestamp: Date
  updatedBy: string
  note?: string
}

// ── Customers ─────────────────────────────────────────────────────

export type VerificationStatus = 'unverified' | 'verified' | 'suspended'

export interface Customer {
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

// ── Dashboard ─────────────────────────────────────────────────────

export interface DashboardStats {
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
  revenueTrend: number
  ordersTrend: number
}

// ── Messages ──────────────────────────────────────────────────────

export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived'

export interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  body: string
  status: MessageStatus
  repliedAt?: Date
  createdAt: Date
}

// ── Settings ──────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string
  siteDescription: string
  ownerEmail: string
  ownerPhone: string
  currency: string
  codEnabled: boolean
  payhereEnabled: boolean
  pickupEnabled: boolean
  deliveryZones: DeliveryZone[]
  socialLinks: { tiktok?: string; instagram?: string; facebook?: string }
  metaPixelId?: string
  tiktokPixelId?: string
}

export interface DeliveryZone {
  id: string
  name: string
  fee: number
  isActive: boolean
}

// ── API Response ──────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ── Sidebar Navigation ───────────────────────────────────────────

export interface SidebarItem {
  label: string
  href: string
  permission: string
  icon: React.ReactNode
}
