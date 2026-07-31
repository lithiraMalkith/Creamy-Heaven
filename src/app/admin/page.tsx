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

  const maxVal = Math.max(...data.map((d) => d.revenue), 10)
  // Round up max for nice y-axis steps
  const yMax = Math.ceil(maxVal / 1000) * 1000 || 1000
  const w = 600
  const h = 260
  const padLeft = 65
  const padRight = 24
  const padTop = 24
  const padBottom = 36

  const points = data.map((d, i) => {
    const x = padLeft + (i / Math.max(data.length - 1, 1)) * (w - padLeft - padRight)
    const y = padTop + (1 - d.revenue / yMax) * (h - padTop - padBottom)
    return { x, y, value: d.revenue }
  })

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPath = `M ${points[0].x},${h - padBottom} L ${polyline} L ${points[points.length - 1].x},${h - padBottom} Z`

  // Y-axis grid ticks (4 steps)
  const yTicks = [0, 0.33, 0.66, 1].map((step) => {
    const val = Math.round(yMax * (1 - step))
    const y = padTop + step * (h - padTop - padBottom)
    return { val, y }
  })

  const formatLKR = (val: number) => {
    if (val >= 1000000) return `Rs.${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `Rs.${(val / 1000).toFixed(0)}k`
    return `Rs.${val}`
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64 overflow-visible" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151210" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#151210" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Y-axis grid lines and labels */}
      {yTicks.map((tick, i) => (
        <g key={i}>
          <line
            x1={padLeft}
            x2={w - padRight}
            y1={tick.y}
            y2={tick.y}
            stroke="#E5E1D9"
            strokeWidth="1"
            strokeDasharray={i === yTicks.length - 1 ? 'none' : '4 4'}
          />
          <text
            x={padLeft - 10}
            y={tick.y + 4}
            fontSize="11"
            fontWeight="500"
            fill="#8C857D"
            textAnchor="end"
            fontFamily="var(--font-body)"
          >
            {formatLKR(tick.val)}
          </text>
        </g>
      ))}

      {/* Area Gradient Fill */}
      <path d={areaPath} fill="url(#revenueGradient)" />

      {/* Main Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#151210"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data Dots & Value Labels */}
      {points.map((p, i) => (
        <g key={i} className="group cursor-pointer">
          <circle cx={p.x} cy={p.y} r="5" fill="#151210" className="transition-all hover:r-7" />
          <circle cx={p.x} cy={p.y} r="2.5" fill="#FFFFFF" />
          
          {/* Top Value Pill (Value detail) */}
          <text
            x={p.x}
            y={p.y - 12}
            fontSize="10"
            fontWeight="700"
            fill="#151210"
            textAnchor="middle"
            fontFamily="var(--font-body)"
          >
            {p.value > 0 ? formatLKR(p.value) : ''}
          </text>
        </g>
      ))}

      {/* X-axis Day Labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={points[i].x}
          y={h - 10}
          fontSize="11"
          fontWeight="600"
          fill="#8C857D"
          textAnchor="middle"
          fontFamily="var(--font-body)"
        >
          {d.day}
        </text>
      ))}
    </svg>
  )
}

function OrdersBarChart({ data }: { data: { day: string; orders: number; completed: number }[] }) {
  if (data.length === 0) return <p className="text-brand-muted text-sm text-center py-8">No data</p>

  const maxVal = Math.max(...data.map((d) => d.orders), 5)
  const yMax = Math.ceil(maxVal / 5) * 5 || 5

  const yTicks = [0, 0.5, 1].map((step) => {
    const val = Math.round(yMax * (1 - step))
    return { val, percent: step * 100 }
  })

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs font-medium text-brand-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-brand-black inline-block" />
          <span>Total Orders</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-brand-muted/40 inline-block" />
          <span>Completed</span>
        </div>
      </div>

      <div className="flex gap-3 items-stretch h-56 pt-2">
        {/* Y-axis Labels */}
        <div className="flex flex-col justify-between py-2 text-right pr-2 text-xs font-medium text-brand-muted font-body shrink-0 w-10 border-r border-brand-border">
          {yTicks.map((t, idx) => (
            <span key={idx}>{t.val}</span>
          ))}
        </div>

        {/* Bars Grid */}
        <div className="flex-1 flex items-end gap-3 justify-between pb-6 relative">
          {/* Horizontal Gridlines */}
          <div className="absolute inset-x-0 top-2 bottom-6 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-dashed border-brand-border w-full" />
            <div className="border-b border-dashed border-brand-border w-full" />
            <div className="border-b border-brand-border w-full" />
          </div>

          {data.map((d, i) => {
            const orderPct = (d.orders / yMax) * 100
            const completedPct = (d.completed / yMax) * 100

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative z-10 group">
                {/* Bar Stack */}
                <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                  {/* Total Orders Bar */}
                  <div className="w-1/2 flex flex-col justify-end h-full">
                    {d.orders > 0 && (
                      <span className="text-[10px] font-bold text-center text-brand-black mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.orders}
                      </span>
                    )}
                    <div
                      className="w-full rounded-t-md bg-brand-black hover:bg-brand-black/80 transition-all duration-300 shadow-sm"
                      style={{ height: `${orderPct}%`, minHeight: d.orders > 0 ? '6px' : '2px' }}
                    />
                  </div>

                  {/* Completed Orders Bar */}
                  <div className="w-1/2 flex flex-col justify-end h-full">
                    {d.completed > 0 && (
                      <span className="text-[10px] font-bold text-center text-brand-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.completed}
                      </span>
                    )}
                    <div
                      className="w-full rounded-t-md bg-brand-muted/40 hover:bg-brand-muted/60 transition-all duration-300"
                      style={{ height: `${completedPct}%`, minHeight: d.completed > 0 ? '6px' : '2px' }}
                    />
                  </div>
                </div>

                {/* Day Label */}
                <span className="text-xs font-semibold text-brand-muted font-body absolute -bottom-5">
                  {d.day}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
