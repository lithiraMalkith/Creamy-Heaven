'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'
import { 
  sendOrderStatusUpdateEmail, 
  sendOrderCancellationEmail,
  sendOrderConfirmationEmail
} from '@/lib/email'
import type { OrderStatus, FulfilmentType } from '@/types'

import { STATUS_ORDER } from './constants'
export async function createOrder(formData: FormData) {
  const session = await requirePermission('orders:write')

  const customerStr = formData.get('customer') as string
  const itemsStr = formData.get('items') as string
  const total = parseFloat(formData.get('total') as string)
  const fulfilmentType = formData.get('fulfilmentType') as FulfilmentType
  const paymentMethod = formData.get('paymentMethod') as 'cod' | 'payhere'
  
  if (!customerStr || !itemsStr || isNaN(total) || !fulfilmentType || !paymentMethod) {
    redirect('/admin/orders/new?flash=error:Missing required fields')
  }

  const customer = JSON.parse(customerStr)
  const items = JSON.parse(itemsStr)

  // Generate a random order ref (e.g. ORD-123456)
  const orderRef = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  const now = new Date()
  
  const newOrderData = {
    orderRef,
    customer,
    items,
    subtotal: total, // Assuming subtotal = total for manual entry unless delivery fee is added
    deliveryFee: 0,
    total,
    status: 'pending' as OrderStatus,
    fulfilmentType,
    paymentMethod,
    statusHistory: [{
      status: 'pending' as OrderStatus,
      timestamp: now,
      updatedBy: session.email,
    }],
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await adminDb.collection('orders').add(newOrderData)

  // Send confirmation email
  sendOrderConfirmationEmail({
    orderRef,
    customer,
    items,
    total,
    fulfilmentType
  }).catch(console.error)

  revalidatePath('/admin/orders')
  redirect(`/admin/orders/${docRef.id}?flash=success:Order created successfully`)
}

export async function deleteOrder(id: string) {
  await requirePermission('orders:write')

  const doc = await adminDb.collection('orders').doc(id).get()
  if (!doc.exists) redirect('/admin/orders?flash=error:Order not found')

  await adminDb.collection('orders').doc(id).delete()

  revalidatePath('/admin/orders')
  redirect('/admin/orders?flash=success:Order deleted successfully')
}

export async function updateOrderStatus(formData: FormData) {
  const session = await requirePermission('orders:write')

  const orderId = formData.get('orderId') as string
  const newStatus = formData.get('status') as OrderStatus
  const note = formData.get('note') as string | null
  const cancellationReason = formData.get('cancellationReason') as string | null

  if (!orderId || !newStatus) {
    redirect(`/admin/orders?flash=error:Missing required fields`)
  }

  // Validate status transition
  const doc = await adminDb.collection('orders').doc(orderId).get()
  if (!doc.exists) {
    redirect('/admin/orders?flash=error:Order not found')
  }

  const currentStatus = doc.data()!.status as OrderStatus
  
  if (newStatus === 'cancelled') {
    if (currentStatus === 'completed') {
      redirect(`/admin/orders/${orderId}?flash=error:Cannot cancel a completed order`)
    }
  } else {
    const currentIndex = STATUS_ORDER[currentStatus] ?? -1
    const newIndex = STATUS_ORDER[newStatus] ?? -1
    if (newIndex <= currentIndex) {
      redirect(`/admin/orders/${orderId}?flash=error:Invalid status transition from ${currentStatus} to ${newStatus}`)
    }
  }

  // Cancellation requires a reason
  if (newStatus === 'cancelled' && !cancellationReason) {
    redirect(`/admin/orders/${orderId}?flash=error:Cancellation reason is required`)
  }

  const now = new Date()
  const statusEntry: Record<string, unknown> = {
    status: newStatus,
    timestamp: now,
    updatedBy: session.email,
  }
  
  if (note) {
    statusEntry.note = note
  }

  const updateData: Record<string, unknown> = {
    status: newStatus,
    updatedAt: now,
    statusHistory: [...(doc.data()!.statusHistory ?? []), statusEntry],
  }

  if (newStatus === 'cancelled') {
    updateData.cancellationReason = cancellationReason
  }

  await adminDb.collection('orders').doc(orderId).update(updateData)

  // Dispatch email
  const fullOrderDoc = await adminDb.collection('orders').doc(orderId).get()
  const orderData = fullOrderDoc.data()!
  const emailData = {
    orderRef: orderData.orderRef,
    customer: orderData.customer,
    items: orderData.items,
    total: orderData.total,
    fulfilmentType: orderData.fulfilmentType,
    status: newStatus,
    cancellationReason: cancellationReason || undefined,
  }

  if (newStatus === 'cancelled') {
    sendOrderCancellationEmail(emailData).catch(console.error)
  } else {
    sendOrderStatusUpdateEmail(emailData).catch(console.error)
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  redirect(`/admin/orders/${orderId}?flash=success:Status updated to ${newStatus}`)
}

export async function updateOrderDetails(formData: FormData) {
  await requirePermission('orders:write')

  const orderId = formData.get('orderId') as string
  const trackingNumber = formData.get('trackingNumber') as string | null
  const estimatedDeliveryDate = formData.get('estimatedDeliveryDate') as string | null

  // Customer fields
  const customerName = formData.get('customerName') as string | null
  const customerEmail = formData.get('customerEmail') as string | null
  const customerPhone = formData.get('customerPhone') as string | null

  // Delivery fields
  const addressLine1 = formData.get('addressLine1') as string | null
  const addressLine2 = formData.get('addressLine2') as string | null
  const city = formData.get('city') as string | null
  const district = formData.get('district') as string | null
  const postalCode = formData.get('postalCode') as string | null

  // Financials
  const subtotalStr = formData.get('subtotal') as string | null
  const deliveryFeeStr = formData.get('deliveryFee') as string | null

  if (!orderId) {
    redirect('/admin/orders?flash=error:Missing order ID')
  }

  const doc = await adminDb.collection('orders').doc(orderId).get()
  if (!doc.exists) redirect('/admin/orders?flash=error:Order not found')
  const orderData = doc.data()!

  const updateData: Record<string, unknown> = { updatedAt: new Date() }
  
  if (trackingNumber !== null) updateData.trackingNumber = trackingNumber
  if (estimatedDeliveryDate !== null) updateData.estimatedDeliveryDate = estimatedDeliveryDate

  // Update customer
  if (customerName || customerEmail || customerPhone) {
    updateData.customer = {
      ...orderData.customer,
      name: customerName || orderData.customer.name,
      email: customerEmail || orderData.customer.email,
      phone: customerPhone || orderData.customer.phone,
    }
  }

  // Update delivery address
  if (orderData.fulfilmentType === 'delivery') {
    const currentAddress = orderData.deliveryAddress || {}
    const newAddress = {
      ...currentAddress,
      ...(addressLine1 !== null && { addressLine1 }),
      ...(addressLine2 !== null && { addressLine2 }),
      ...(city !== null && { city }),
      ...(district !== null && { district }),
      ...(postalCode !== null && { postalCode }),
    }
    // Only set if we have the required fields minimally
    if (newAddress.addressLine1 && newAddress.city && newAddress.district && newAddress.postalCode) {
      updateData.deliveryAddress = newAddress
    }
  }

  // Update financials
  let newSubtotal = orderData.subtotal
  let newDeliveryFee = orderData.deliveryFee

  if (subtotalStr && !isNaN(parseFloat(subtotalStr))) {
    newSubtotal = parseFloat(subtotalStr)
    updateData.subtotal = newSubtotal
  }
  
  if (deliveryFeeStr && !isNaN(parseFloat(deliveryFeeStr))) {
    newDeliveryFee = parseFloat(deliveryFeeStr)
    updateData.deliveryFee = newDeliveryFee
  }

  if (updateData.subtotal !== undefined || updateData.deliveryFee !== undefined) {
    updateData.total = newSubtotal + newDeliveryFee
  }

  await adminDb.collection('orders').doc(orderId).update(updateData)

  revalidatePath(`/admin/orders/${orderId}`)
  redirect(`/admin/orders/${orderId}?flash=success:Order details updated`)
}
