import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with clsx + tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as LKR currency
 */
export function formatPrice(amount?: number | null): string {
  if (amount == null) return 'LKR 0.00'
  return `LKR ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Generate a SKU code
 * Format: CH-{CAT}-{0001}
 */
export function generateSKU(category: string, index: number): string {
  const prefix = category.substring(0, 3).toUpperCase()
  return `CH-${prefix}-${String(index).padStart(4, '0')}`
}

/**
 * Generate an order reference
 * Format: CH-{timestamp36}-{random4}
 */
export function generateOrderRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CH-${timestamp}-${random}`
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string | undefined | null, length: number): string {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format a date for display in the admin panel
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-LK', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a date as a long date string
 */
export function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-LK', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Parse a flash message from searchParams
 * Format: "success:Message text" or "error:Message text"
 */
export function parseFlash(flash?: string): { type: 'success' | 'error' | 'info'; message: string } | null {
  if (!flash) return null
  const [type, ...rest] = flash.split(':')
  const message = rest.join(':')
  if (!message) return null
  return {
    type: (type === 'success' || type === 'error' || type === 'info') ? type : 'info',
    message,
  }
}
