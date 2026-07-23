import { NextResponse } from 'next/server'
import { fetchPendingOrderCount } from '@/lib/data/orders'

/**
 * GET /api/admin/pending-count
 * Tiny JSON endpoint returning { count: N }.
 * Used only by the AdminNotifications client component.
 */
export async function GET() {
  try {
    const count = await fetchPendingOrderCount()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Pending count error:', error)
    return NextResponse.json({ count: 0 })
  }
}
