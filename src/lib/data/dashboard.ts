import { adminDb } from '@/lib/firebase-admin'
import type { DashboardStats } from '@/types'

/**
 * Aggregates dashboard statistics from orders, products, and customers.
 * Called directly from the dashboard Server Component.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch all orders from this month (covers today + week + month queries)
  const ordersSnapshot = await adminDb
    .collection('orders')
    .where('createdAt', '>=', monthStart)
    .orderBy('createdAt', 'desc')
    .get()

  const allOrders = ordersSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      status: data.status as string,
      total: (data.total as number) ?? 0,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      customerName: data.customer?.name ?? 'Unknown',
    }
  })

  // Filter by time ranges
  const ordersToday = allOrders.filter((o) => o.createdAt >= todayStart)
  const ordersThisWeek = allOrders.filter((o) => o.createdAt >= weekStart)

  // Calculate revenue (exclude cancelled orders)
  const revenueToday = ordersToday
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const revenueThisWeek = ordersThisWeek
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const revenueThisMonth = allOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  // Pending orders count
  const pendingSnapshot = await adminDb
    .collection('orders')
    .where('status', '==', 'pending')
    .count()
    .get()
  const pendingOrders = pendingSnapshot.data().count

  // Product counts
  const productsSnapshot = await adminDb.collection('products').get()
  const totalProducts = productsSnapshot.size
  const lowStockProducts = productsSnapshot.docs.filter((doc) => {
    const qty = doc.data().stockQty ?? 0
    return qty > 0 && qty <= 10
  }).length

  // Customer count
  const customersSnapshot = await adminDb.collection('customers').count().get()
  const totalCustomers = customersSnapshot.data().count

  // Revenue data for chart (last 7 days)
  const revenueData: { day: string; revenue: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(todayStart)
    date.setDate(date.getDate() - i)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const dayRevenue = allOrders
      .filter((o) => o.createdAt >= date && o.createdAt < nextDate && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)

    revenueData.push({
      day: date.toLocaleDateString('en-LK', { weekday: 'short' }),
      revenue: dayRevenue,
    })
  }

  // Orders data for chart (last 7 days)
  const ordersData: { day: string; orders: number; completed: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(todayStart)
    date.setDate(date.getDate() - i)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const dayOrders = allOrders.filter(
      (o) => o.createdAt >= date && o.createdAt < nextDate
    )

    ordersData.push({
      day: date.toLocaleDateString('en-LK', { weekday: 'short' }),
      orders: dayOrders.length,
      completed: dayOrders.filter((o) => o.status === 'completed').length,
    })
  }

  // Recent activities (last 10 orders as activity feed)
  const recentActivities = allOrders.slice(0, 10).map((o) => ({
    id: o.id,
    type: 'order' as const,
    message: `New order from ${o.customerName}`,
    time: o.createdAt.toISOString(),
  }))

  // Trends: compare today vs yesterday
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const ordersYesterday = allOrders.filter(
    (o) => o.createdAt >= yesterdayStart && o.createdAt < todayStart
  )
  const revenueYesterday = ordersYesterday
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  const revenueTrend = revenueYesterday > 0
    ? Math.round(((revenueToday - revenueYesterday) / revenueYesterday) * 100)
    : 0
  const ordersTrend = ordersToday.length - ordersYesterday.length

  return {
    ordersToday: ordersToday.length,
    ordersThisWeek: ordersThisWeek.length,
    ordersThisMonth: allOrders.length,
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    pendingOrders,
    lowStockProducts,
    totalProducts,
    totalCustomers,
    revenueData,
    ordersData,
    recentActivities,
    revenueTrend,
    ordersTrend,
  }
}
