import { cookies } from 'next/headers'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  slug: string
}

export interface Cart {
  items: CartItem[]
}

const CART_COOKIE_NAME = 'creamy_heaven_cart'

export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies()
  const cartCookie = cookieStore.get(CART_COOKIE_NAME)
  
  if (!cartCookie?.value) {
    return { items: [] }
  }

  try {
    return JSON.parse(cartCookie.value) as Cart
  } catch (error) {
    console.error('Error parsing cart cookie', error)
    return { items: [] }
  }
}

export async function setCart(cart: Cart) {
  const cookieStore = await cookies()
  // 7 days expiry
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    expires,
    path: '/',
    httpOnly: false, // Allow client side access if needed
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function clearCart() {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart()
  return cart.items.reduce((total, item) => total + item.quantity, 0)
}
