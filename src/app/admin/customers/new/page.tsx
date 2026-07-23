import { requirePermission } from '@/lib/auth-guard'
import { createCustomer } from '../actions'
import { FlashMessage } from '@/components/flash-message'

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('customers:write')
  const { flash } = await searchParams

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6">
      <FlashMessage value={flash} />

      <h1 className="font-heading text-2xl font-semibold text-brand-black">New Customer</h1>

      <form action={createCustomer} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Name *</label>
          <input name="name" required className="form-input" placeholder="John Doe" />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Email *</label>
          <input name="email" type="email" required className="form-input" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Phone *</label>
          <input name="phone" required className="form-input" placeholder="0771234567" />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Verification Status</label>
          <select name="verificationStatus" className="form-select">
            <option value="unverified">Unverified</option>
            <option value="verified">Verified</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="border-t border-brand-border pt-5 flex items-center gap-3">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">
            Create Customer
          </button>
          <a href="/admin/customers" className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
