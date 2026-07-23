import { z } from 'zod'

/* ================================================================
   Products
   ================================================================ */

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.coerce.number().positive('Price must be positive'),
  cost: z.coerce.number().min(0).optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  ingredients: z.string().optional(),
  allergens: z.string().optional().transform(v => v ? v.split(',').map(s => s.trim()).filter(Boolean) : undefined),
  sizeWeight: z.string().optional(),
  flavor: z.string().optional(),
  isCustomizable: z.string().optional().transform(v => v === 'on' || v === 'true'),
  leadTimeHours: z.coerce.number().int().min(0).optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  isFeatured: z.string().optional().transform(v => v === 'on' || v === 'true'),
  stockQty: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub-category is required'),
  visibility: z.enum(['published', 'draft']),
  sku: z.string().min(1, 'SKU is required'),
})

export type ProductFormData = z.infer<typeof productSchema>

/* ================================================================
   Checkout (customer orders) — address required for delivery only
   ================================================================ */

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^(?:\+94|0)\d{9}$/, 'Invalid Sri Lankan phone number'),
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

export type CheckoutFormData = z.infer<typeof checkoutSchema>

/* ================================================================
   Categories
   ================================================================ */

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(60),
  description: z.string().max(200).optional(),
  order: z.coerce.number().int().min(0).optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

/* ================================================================
   Sub-Categories
   ================================================================ */

export const subCategorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(60),
  description: z.string().max(200).optional(),
})

export type SubCategoryFormData = z.infer<typeof subCategorySchema>

/* ================================================================
   Custom Roles
   ================================================================ */

export const customRoleSchema = z.object({
  name: z.string().min(2, 'Role name is required').max(40),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
})

export type CustomRoleFormData = z.infer<typeof customRoleSchema>

/* ================================================================
   User Invites
   ================================================================ */

export const userInviteSchema = z.object({
  email: z.string().email('Invalid email'),
  displayName: z.string().min(2, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
})

export type UserInviteFormData = z.infer<typeof userInviteSchema>

/* ================================================================
   Settings
   ================================================================ */

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().max(300).optional(),
  ownerEmail: z.string().email('Invalid email'),
  ownerPhone: z.string().min(1, 'Phone is required'),
  codEnabled: z.string().optional().transform(v => v === 'on' || v === 'true'),
  pickupEnabled: z.string().optional().transform(v => v === 'on' || v === 'true'),
  socialTiktok: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebook: z.string().optional(),
  metaPixelId: z.string().optional(),
  tiktokPixelId: z.string().optional(),
})

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>

/* ================================================================
   Inventory Stock Update
   ================================================================ */

export const inventoryStockSchema = z.object({
  productId: z.string().min(1),
  stockQty: z.coerce.number().int().min(0, 'Stock cannot be negative'),
})

/* ================================================================
   Order Status Update
   ================================================================ */

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['pending', 'confirmed', 'processing', 'dispatched', 'ready_for_pickup', 'completed', 'cancelled']),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
})
