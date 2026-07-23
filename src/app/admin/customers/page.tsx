import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { requirePermission } from '@/lib/auth-guard'
import { fetchCustomers } from '@/lib/data/customers'
import { formatPrice, formatDate } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'
import { CustomerRowActions } from './row-actions'

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; flash?: string }> }) {
  await requirePermission('customers:read')
  const { q, flash } = await searchParams
  const customers = await fetchCustomers({ q })

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />
      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Customers</h1>
          <p className="text-brand-muted text-sm mt-1">{customers.length} total</p>
        </div>
        <Link
          href="/admin/customers/new"
          className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Link>
      </div>
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        <input type="text" name="q" defaultValue={q ?? ''} placeholder="Search customers..." className="form-input !pl-10" />
      </form>
      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th className="w-12"></th></tr></thead>
            <tbody className="animate-in-stagger">
              {customers.map((c) => (
                <tr key={c.id} className="row-hover">
                  <td><p className="font-medium text-brand-black">{c.name}</p>{c.isRepeat && <span className="text-xs text-brand-success font-medium">Repeat</span>}</td>
                  <td className="text-sm text-brand-muted">{c.email}</td>
                  <td className="text-sm text-brand-muted tabular-nums">{c.phone}</td>
                  <td className="tabular-nums">{c.orderCount}</td>
                  <td className="tabular-nums">{formatPrice(c.totalSpent)}</td>
                  <td className="text-sm text-brand-muted tabular-nums">{formatDate(c.createdAt)}</td>
                  <td><CustomerRowActions id={c.id} /></td>
                </tr>
              ))}
              {customers.length === 0 && <tr><td colSpan={7} className="text-center py-12"><p className="text-brand-muted text-sm">No customers found</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
