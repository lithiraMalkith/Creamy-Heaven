'use server'

import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { getCart, clearCart } from '@/lib/cart'
import type { Order } from '@/types'

export async function placeOrderAction(formData: FormData) {
  const cart = await getCart()
  
  if (cart.items.length === 0) {
    throw new Error('Cart is empty')
  }

  // Extract customer info from form
  const customerInfo = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  }

  const fulfillmentType = formData.get('fulfillment') as 'delivery' | 'pickup'
  
  const shippingAddress = fulfillmentType === 'delivery' ? {
    addressLine1: formData.get('address') as string,
    city: formData.get('city') as string,
    district: formData.get('city') as string, // Just a filler since form only has city
    postalCode: formData.get('postal') as string,
  } : undefined

  const notes = formData.get('notes') as string

  // Calculate totals
  const subTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = fulfillmentType === 'delivery' ? 500 : 0 // flat fee for demo
  const total = subTotal + deliveryFee

  const items = cart.items.map(item => ({
    productId: item.productId,
    sku: '', // not passed in cart currently, could fetch
    productName: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image
  }))

  const orderData: Partial<Order> = {
    customer: {
      uid: 'guest',
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
    },
    items,
    status: 'pending',
    fulfilmentType: fulfillmentType,
    ...(shippingAddress ? { deliveryAddress: shippingAddress } : {}),
    subtotal: subTotal,
    deliveryFee,
    total,
    ...(notes ? { notes } : {}),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const docRef = await adminDb.collection('orders').add(orderData)
  
  await clearCart()
  
  redirect(`/order-confirmation/${docRef.id}`)
}
