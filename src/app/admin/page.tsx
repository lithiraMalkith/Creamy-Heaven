import Link from 'next/link'
import {
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchDashboardStats } from '@/lib/data/dashboard'
import { formatPrice, formatDate } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('dashboard:read')
  const { flash } = await searchParams
  const stats = await fetchDashboardStats()

  const statCards = [
    {
      label: 'Revenue Today',
      value: formatPrice(stats.revenueToday),
      icon: <DollarSign className="w-5 h-5" />,
      trend: stats.revenueTrend,
      trendLabel: `${stats.revenueTrend > 0 ? '+' : ''}${stats.revenueTrend}% vs yesterday`,
    },
    {
      label: 'Orders Today',
      value: String(stats.ordersToday),
      icon: <ShoppingCart className="w-5 h-5" />,
      trend: stats.ordersTrend,
      trendLabel: `${stats.ordersTrend > 0 ? '+' : ''}${stats.ordersTrend} vs yesterday`,
    },
    {
      label: 'Pending Orders',
      value: String(stats.pendingOrders),
      icon: <Clock className="w-5 h-5" />,
      href: '/admin/orders?status=pending',
    },
    {
      label: 'Low Stock',
      value: String(stats.lowStockProducts),
      icon: <AlertTriangle className="w-5 h-5" />,
      isDanger: stats.lowStockProducts > 0,
      href: '/admin/inventory?status=low_stock',
    },
  ]

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="font-heading text-2xl font-semibold text-brand-black">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="animate-in-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const content = (
            <div
              className={`bg-brand-white rounded-xl border border-brand-border p-5 card-hover relative overflow-hidden ${
                card.href ? 'cursor-pointer' : ''
              }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-2 rounded-lg ${card.isDanger ? 'bg-brand-danger/10 text-brand-danger' : 'bg-brand-cream text-brand-black'}`}>
                  {card.icon}
                </div>
                <p className="text-brand-muted text-sm mt-3">{card.label}</p>
                <p className="text-2xl font-semibold text-brand-black mt-1 font-body tabular-nums">
                  {card.value}
                </p>
                {card.trend !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.trend >= 0 ? 'text-brand-success' : 'text-brand-danger'}`}>
                    {card.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {card.trendLabel}
                  </div>
                )}
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-cream rounded-full blur-2xl" />
            </div>
          )

          return card.href ? (
            <Link key={card.label} href={card.href}>{content}</Link>
          ) : (
            <div key={card.label}>{content}</div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="animate-fade-in-up bg-brand-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-brand-black">Revenue (7 Days)</h2>
            <TrendingUp className="w-4 h-4 text-brand-muted" />
          </div>
          <RevenueLineChart data={stats.revenueData} />
        </div>

        {/* Orders Chart */}
        <div className="animate-fade-in-up bg-brand-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-brand-black">Orders (7 Days)</h2>
            <ShoppingCart className="w-4 h-4 text-brand-muted" />
          </div>
          <OrdersBarChart data={stats.ordersData} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 animate-fade-in-up bg-brand-white rounded-xl border border-brand-border p-6">
          <h2 className="font-heading text-lg font-semibold text-brand-black mb-4">Recent Activity</h2>
          {stats.recentActivities.length > 0 ? (
            <div className="animate-in-stagger space-y-3">
              {stats.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-cream/50 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-brand-cream text-brand-black">
                    {activity.type === 'order' && <ShoppingCart className="w-4 h-4" />}
                    {activity.type === 'product' && <Package className="w-4 h-4" />}
                    {activity.type === 'user' && <Users className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-black">{activity.message}</p>
                    <p className="text-xs text-brand-muted mt-0.5 tabular-nums">
                      {formatDate(activity.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-muted text-center py-8">No recent activity</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up bg-brand-white rounded-xl border border-brand-border p-6">
          <h2 className="font-heading text-lg font-semibold text-brand-black mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add Product', href: '/admin/products/new', icon: <Package className="w-4 h-4" /> },
              { label: 'View Orders', href: '/admin/orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { label: 'Check Inventory', href: '/admin/inventory', icon: <AlertTriangle className="w-4 h-4" /> },
              { label: 'Manage Categories', href: '/admin/categories', icon: <Users className="w-4 h-4" /> },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-brand-black-soft hover:text-brand-black hover:bg-brand-cream transition-colors"
              >
                {action.icon}
                {action.label}
              </Link>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-brand-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Total Products</span>
              <span className="font-medium text-brand-black tabular-nums">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Total Customers</span>
              <span className="font-medium text-brand-black tabular-nums">{stats.totalCustomers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Monthly Revenue</span>
              <span className="font-medium text-brand-black tabular-nums">{formatPrice(stats.revenueThisMonth)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Server-Rendered SVG Charts — zero client JS
   ================================================================ */

function RevenueLineChart({ data }: { data: { day: string; revenue: number }[] }) {
  if (data.length === 0) return <p className="text-brand-muted text-sm text-center py-8">No data</p>

  const max = Math.max(...data.map((d) => d.revenue), 1)
  const w = 600
  const h = 240
  const pad = 32

  const points = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2)
    const y = h - pad - (d.revenue / max) * (h - pad * 2)
    return { x, y }
  })

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-60" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => {
        const y = pad + (i * (h - pad * 2)) / 3
        return (
          <line key={i} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#E7DDC9" strokeWidth="1" />
        )
      })}
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#151210" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#151210" />
      ))}
      {/* Labels */}
      {data.map((d, i) => (
        <text key={i} x={points[i].x} y={h - 8} fontSize="11" fill="#8B8178" textAnchor="middle" fontFamily="var(--font-body)">
          {d.day}
        </text>
      ))}
    </svg>
  )
}

function OrdersBarChart({ data }: { data: { day: string; orders: number; completed: number }[] }) {
  if (data.length === 0) return <p className="text-brand-muted text-sm text-center py-8">No data</p>

  const max = Math.max(...data.map((d) => d.orders), 1)

  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col justify-end h-40 gap-0.5">
            <div
              className="w-full rounded-t-md bg-brand-black transition-all duration-300"
              style={{ height: `${(d.orders / max) * 100}%`, minHeight: d.orders > 0 ? '4px' : '0' }}
            />
            <div
              className="w-full rounded-t-md bg-brand-muted/40 transition-all duration-300"
              style={{ height: `${(d.completed / max) * 60}%`, minHeight: d.completed > 0 ? '4px' : '0' }}
            />
          </div>
          <span className="text-[10px] text-brand-muted font-body">{d.day}</span>
        </div>
      ))}
    </div>
  )
}
