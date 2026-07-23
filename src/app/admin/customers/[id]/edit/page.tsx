import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchCustomer } from '@/lib/data/customers'
import { updateCustomer } from '../../actions'

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('customers:write')
  const { id } = await params
  const customer = await fetchCustomer(id)
  if (!customer) notFound()
  const updateWithId = updateCustomer.bind(null, id)

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-brand-black">Edit Customer</h1>
      <form action={updateWithId} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
        <div><label className="block text-sm font-medium text-brand-black mb-1">Name</label><input name="name" defaultValue={customer.name} required className="form-input" /></div>
        <div><label className="block text-sm font-medium text-brand-black mb-1">Phone</label><input name="phone" defaultValue={customer.phone} className="form-input" /></div>
        <div><label className="block text-sm font-medium text-brand-black mb-1">Verification Status</label>
          <select name="verificationStatus" defaultValue={customer.verificationStatus ?? 'unverified'} className="form-select">
            <option value="unverified">Unverified</option><option value="verified">Verified</option><option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">Save Changes</button>
          <a href={`/admin/customers/${id}`} className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">Cancel</a>
        </div>
      </form>
    </div>
  )
}
