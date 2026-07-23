'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'

export async function updateInventoryStock(formData: FormData) {
  await requirePermission('inventory:write')

  const productId = formData.get('productId') as string
  const stockQty = Number(formData.get('stockQty'))

  if (!productId || isNaN(stockQty) || stockQty < 0) {
    redirect('/admin/inventory?flash=error:Invalid stock quantity')
  }

  const availabilityStatus =
    stockQty === 0 ? 'out_of_stock' : stockQty <= 10 ? 'low_stock' : 'in_stock'

  await adminDb.collection('products').doc(productId).update({
    stockQty,
    availabilityStatus,
    updatedAt: new Date(),
  })

  revalidatePath('/admin/inventory')
  revalidatePath('/admin/products')
  redirect('/admin/inventory?flash=success:Stock updated')
}
