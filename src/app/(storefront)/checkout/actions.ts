'use server'

import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { getCart, clearCart } from '@/lib/cart'
import { generateOrderRef } from '@/lib/utils'
import type { Order } from '@/types'

export async function placeOrderAction(formData: FormData) {
  const cart = await getCart()

  if (cart.items.length === 0) {
    redirect('/cart')
  }

  // Extract customer info
  const name = (formData.get('name') as string)?.trim() || 'Valued Customer'
  const email = (formData.get('email') as string)?.trim() || ''
  const phone = (formData.get('phone') as string)?.trim() || ''

  const rawFulfillment = (formData.get('fulfillment') as string)?.toLowerCase()
  const fulfillmentType: 'delivery' | 'pickup' =
    rawFulfillment === 'pickup' ? 'pickup' : 'delivery'

  let shippingAddress:
    | {
        addressLine1: string
        city: string
        district: string
        postalCode: string
      }
    | undefined = undefined

  if (fulfillmentType === 'delivery') {
    const address = (formData.get('address') as string)?.trim() || 'Colombo'
    const city = (formData.get('city') as string)?.trim() || 'Colombo'
    const postal = (formData.get('postal') as string)?.trim() || ''

    shippingAddress = {
      addressLine1: address,
      city: city,
      district: city,
      postalCode: postal,
    }
  }

  const notes = (formData.get('notes') as string)?.trim() || ''

  // Calculate totals
  const subTotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const deliveryFee = fulfillmentType === 'delivery' ? 500 : 0
  const total = subTotal + deliveryFee

  const items = cart.items.map((item) => ({
    productId: item.productId,
    sku: '',
    productName: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image || '',
  }))

  const orderRef = generateOrderRef()

  const orderData: Partial<Order> = {
    orderRef,
    customer: {
      uid: 'guest',
      name,
      email,
      phone,
    },
    items,
    status: 'pending',
    fulfilmentType: fulfillmentType,
    paymentMethod: 'cod',
    ...(shippingAddress ? { deliveryAddress: shippingAddress } : {}),
    subtotal: subTotal,
    deliveryFee,
    total,
    ...(notes ? { notes } : {}),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(),
        updatedBy: 'Customer',
        note: 'Order placed online',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const docRef = await adminDb.collection('orders').add(orderData)

  await clearCart()

  redirect(`/order-confirmation/${docRef.id}`)
}
