import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Boxes,
  FolderTree,
  Shield,
  UserCog,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { getSession } from '@/lib/session'
import { hasPermission } from '@/lib/permissions'
import { AdminNotifications } from './AdminNotifications'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard',  href: '/admin',            permission: 'dashboard:read',  icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Products',   href: '/admin/products',   permission: 'products:read',   icon: <Package className="w-5 h-5" /> },
  { label: 'Orders',     href: '/admin/orders',     permission: 'orders:read',     icon: <ShoppingCart className="w-5 h-5" /> },
  { label: 'Customers',  href: '/admin/customers',  permission: 'customers:read',  icon: <Users className="w-5 h-5" /> },
  { label: 'Inventory',  href: '/admin/inventory',  permission: 'inventory:read',  icon: <Boxes className="w-5 h-5" /> },
  { label: 'Categories', href: '/admin/categories', permission: 'categories:read', icon: <FolderTree className="w-5 h-5" /> },
  { label: 'Roles',      href: '/admin/roles',      permission: 'roles:read',      icon: <Shield className="w-5 h-5" /> },
  { label: 'Users',      href: '/admin/users',      permission: 'users:read',      icon: <UserCog className="w-5 h-5" /> },
  { label: 'Messages',   href: '/admin/messages',   permission: 'messages:read',   icon: <MessageSquare className="w-5 h-5" /> },
  { label: 'Settings',   href: '/admin/settings',   permission: 'settings:read',   icon: <Settings className="w-5 h-5" /> },
]

async function signOut() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.set('session', '', { maxAge: 0, path: '/' })
  redirect('/adminlogin')
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/adminlogin')
  }

  // Filter sidebar items by the user's permissions — server-side, never render-then-hide
  const visibleItems = SIDEBAR_ITEMS.filter((item) =>
    hasPermission(session.role, item.permission)
  )

  return (
    <div className="flex h-screen overflow-hidden bg-brand-cream">
      {/* CSS-only mobile sidebar toggle */}
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      {/* Mobile overlay */}
      <label
        htmlFor="sidebar-toggle"
        className="hidden peer-checked:block fixed inset-0 bg-brand-black/40 z-30 lg:hidden"
      />

      {/* Sidebar */}
      <aside
        className="fixed lg:static top-0 left-0 h-full w-64 bg-brand-white border-r border-brand-border z-40
                   -translate-x-full peer-checked:translate-x-0 lg:translate-x-0 transition-transform duration-300
                   flex flex-col"
      >
        {/* Brand */}
        <div className="p-6 border-b border-brand-border">
          <Link href="/admin" className="block">
            <h1 className="font-heading text-2xl font-bold text-brand-black">
              Creamy Heaven
            </h1>
            <p className="text-xs text-brand-muted mt-0.5">Admin Panel</p>
          </Link>
        </div>

        {/* Close button (mobile) */}
        <label
          htmlFor="sidebar-toggle"
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-brand-muted hover:text-brand-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </label>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                         text-brand-black-soft hover:text-brand-black hover:bg-brand-cream
                         transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-brand-border">
          <div className="mb-3">
            <p className="text-sm font-medium text-brand-black truncate">
              {session.email}
            </p>
            <p className="text-xs text-brand-muted capitalize">{session.role}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-brand-danger hover:bg-brand-danger/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-brand-white/80 backdrop-blur-md border-b border-brand-border sticky top-0 z-20 px-6 py-3 flex items-center justify-between">
          <label
            htmlFor="sidebar-toggle"
            className="lg:hidden btn-hover p-2 -ml-2 rounded-lg text-brand-muted hover:text-brand-black cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </label>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <AdminNotifications />
            <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center text-sm font-semibold text-brand-black">
              {session.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}
