import { requirePermission } from '@/lib/auth-guard'
import { fetchProducts } from '@/lib/data/products'
import { fetchCustomers } from '@/lib/data/customers'
import { createOrder } from '../actions'
import { FlashMessage } from '@/components/flash-message'
import { OrderForm } from './order-form'

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>
}) {
  await requirePermission('orders:write')
  const { flash } = await searchParams
  
  const products = await fetchProducts()
  const customers = await fetchCustomers()

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto space-y-6">
      <FlashMessage value={flash} />

      <h1 className="font-heading text-2xl font-semibold text-brand-black">New Order</h1>

      <form action={createOrder}>
        <OrderForm products={products} customers={customers} />
      </form>
    </div>
  )
}
