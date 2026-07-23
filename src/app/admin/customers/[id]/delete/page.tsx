import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/auth-guard'
import { fetchCustomer } from '@/lib/data/customers'
import { deleteCustomer } from '../../actions'

export default async function DeleteCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission('customers:write')
  const { id } = await params
  const customer = await fetchCustomer(id)
  if (!customer) notFound()
  const deleteWithId = deleteCustomer.bind(null, id)

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-scale-in max-w-sm w-full bg-brand-white border border-brand-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-brand-black">Delete &ldquo;{customer.name}&rdquo;?</h2>
        <p className="text-brand-muted text-sm">This will permanently remove this customer record.</p>
        <div className="flex gap-3">
          <a href="/admin/customers" className="btn-hover flex-1 text-center px-4 py-2 border border-brand-border rounded-lg text-brand-black hover:bg-brand-cream">Cancel</a>
          <form action={deleteWithId} className="flex-1"><button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-danger text-white rounded-lg">Delete</button></form>
        </div>
      </div>
    </div>
  )
}
