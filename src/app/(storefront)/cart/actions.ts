'use server'

import { revalidateTag } from 'next/cache'
import { getCart, setCart, CartItem } from '@/lib/cart'

export async function addToCartAction(item: CartItem) {
  const cart = await getCart()
  
  const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId)
  
  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += item.quantity
  } else {
    cart.items.push(item)
  }
  
  await setCart(cart)
  revalidateTag('cart', 'max')
}

export async function updateCartQuantity(productId: string, quantity: number) {
  const cart = await getCart()
  const itemIndex = cart.items.findIndex(i => i.productId === productId)
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
    
    await setCart(cart)
    revalidateTag('cart', 'max')
  }
}

export async function removeFromCart(productId: string) {
  const cart = await getCart()
  cart.items = cart.items.filter(i => i.productId !== productId)
  
  await setCart(cart)
  revalidateTag('cart', 'max')
}
