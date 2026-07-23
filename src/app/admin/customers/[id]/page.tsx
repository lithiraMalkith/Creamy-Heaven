import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchCustomer } from '@/lib/data/customers'
import { formatPrice, formatDateLong, formatDate } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'

export default async function ViewCustomerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('customers:read')
  const { id } = await params
  const { flash } = await searchParams
  const customer = await fetchCustomer(id)
  if (!customer) notFound()

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-brand-black">{customer.name}</h1>
            <p className="text-brand-muted text-sm mt-1">Customer since {formatDateLong(customer.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/customers/${id}/edit`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-white border border-brand-border rounded-lg text-sm"><Edit2 className="w-4 h-4" /> Edit</Link>
          <Link href={`/admin/customers/${id}/delete`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-sm text-brand-danger"><Trash2 className="w-4 h-4" /> Delete</Link>
        </div>
      </div>
      <div className="animate-in-stagger grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Contact Info</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <dt className="text-brand-muted">Email</dt><dd className="text-brand-black">{customer.email}</dd>
              <dt className="text-brand-muted">Phone</dt><dd className="text-brand-black tabular-nums">{customer.phone}</dd>
              {customer.address && (<>
                <dt className="text-brand-muted col-span-2">Address</dt>
                <dd className="text-brand-black col-span-2">{customer.address.addressLine1}, {customer.address.city}, {customer.address.district} {customer.address.postalCode}</dd>
              </>)}
            </dl>
          </div>
        </div>
        <div className="space-y-6">
          <div className="form-section bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-brand-muted">Orders</span><span className="font-medium tabular-nums">{customer.orderCount}</span></div>
              <div className="flex justify-between"><span className="text-brand-muted">Total Spent</span><span className="font-medium tabular-nums">{formatPrice(customer.totalSpent)}</span></div>
              <div className="flex justify-between"><span className="text-brand-muted">Repeat</span><span className={customer.isRepeat ? 'text-brand-success font-medium' : 'text-brand-muted'}>{customer.isRepeat ? 'Yes' : 'No'}</span></div>
              {customer.lastOrderAt && <div className="flex justify-between"><span className="text-brand-muted">Last Order</span><span className="tabular-nums">{formatDate(customer.lastOrderAt)}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
