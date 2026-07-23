import Link from 'next/link'
import { getCart } from '@/lib/cart'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import { removeFromCart, updateCartQuantity } from './actions'

export const metadata = {
  title: 'Your Cart - Creamy Heaven',
}

export default async function CartPage() {
  const cart = await getCart()
  
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  })

  if (cart.items.length === 0) {
    return (
      <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site py-section-v-space min-h-[50vh] flex flex-col items-center justify-center w-full">
        <ScrollReveal direction="up" className="text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[48px] text-brand-muted">shopping_bag</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-brand-black mb-4">Your Cart is Empty</h1>
          <p className="font-body-lead text-body-lead text-brand-muted max-w-md mx-auto mb-8">
            Looks like you haven't added any artisanal treats to your cart yet.
          </p>
          <Link href="/shop" className="px-8 py-4 rounded-full bg-brand-black text-surface-container-lowest font-label-md text-label-md transition-transform hover:scale-105 active:scale-95 inline-block">
            Start Shopping
          </Link>
        </ScrollReveal>
      </div>
    )
  }

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site pt-12 pb-section-v-space w-full">
      <ScrollReveal direction="up" className="mb-12">
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">Your Cart</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">Review your items before checkout.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {cart.items.map((item, idx) => (
            <ScrollReveal key={item.productId} direction="left" delay={idx * 0.1} className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-surface-container-lowest border border-brand-border rounded-xl">
              <Link href={`/shop/${item.slug}`} className="w-full sm:w-32 aspect-square rounded-lg overflow-hidden bg-surface-container shrink-0">
                <img 
                  src={item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpV9dZpk8MT3-D0sn-7QGjkV4qRsnTsx4PcPiQsegJq_3i1xFlxot32s0BMFuSdq5YJaXZRaa8B-lsRwJhVHGhKQ_vB_pwQIvc3e-GQyCjqu0OZ5l3LR5YSKiNetPt4DaOqOsXWD_bP6YGR1MkAJ0c-4njAQzFeNcnniYQSFuBYLafhgKqS70iLl92xFpI5pIPg1YZ8SEHFOmyzkihl4N9138V9BHILUA8v8tEUCJs1koIrwlGzTsuKp2Sq2UV-4aT0A37GR7uaFg'} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                />
              </Link>
              
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="font-headline-sm text-headline-sm text-brand-black hover:underline">{item.name}</h3>
                  </Link>
                  <p className="font-price-display text-price-display text-brand-black">{formatter.format(item.price * item.quantity)}</p>
                </div>
                
                <p className="font-body-md text-body-md text-brand-muted mb-4">{formatter.format(item.price)} each</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center border border-brand-border rounded-lg bg-surface-container">
                    <form action={updateCartQuantity.bind(null, item.productId, item.quantity - 1)}>
                      <button type="submit" className="w-10 h-10 flex items-center justify-center text-brand-black hover:bg-surface-dim transition-colors rounded-l-lg">
                        <span className="material-symbols-outlined text-[20px]">remove</span>
                      </button>
                    </form>
                    <div className="w-12 h-10 flex items-center justify-center font-label-md text-label-md text-brand-black">
                      {item.quantity}
                    </div>
                    <form action={updateCartQuantity.bind(null, item.productId, item.quantity + 1)}>
                      <button type="submit" className="w-10 h-10 flex items-center justify-center text-brand-black hover:bg-surface-dim transition-colors rounded-r-lg">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
                    </form>
                  </div>
                  
                  <form action={removeFromCart.bind(null, item.productId)}>
                    <button type="submit" className="text-brand-muted hover:text-brand-danger font-label-sm text-label-sm uppercase tracking-widest flex items-center gap-1 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <ScrollReveal direction="up" delay={0.2} className="lg:col-span-1">
          <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-8 sticky top-[100px]">
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6 pb-4 border-b border-brand-border">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between font-body-md text-body-md text-brand-muted">
                <span>Subtotal</span>
                <span>{formatter.format(subtotal)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-brand-muted">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between font-price-display text-price-display text-brand-black pt-6 border-t border-brand-border mb-8">
              <span>Total</span>
              <span>{formatter.format(subtotal)}</span>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full block text-center bg-brand-black text-on-primary hover:bg-surface-tint transition-all duration-300 px-8 py-4 rounded-lg font-label-md text-label-md hover:scale-[1.02]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
