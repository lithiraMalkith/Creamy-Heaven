import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCart } from '@/lib/cart'
import { getCustomerSession } from '@/lib/customer-session'
import { fetchCustomer } from '@/lib/data/customers'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import { placeOrderAction } from './actions'

export const metadata = {
  title: 'Checkout - Creamy Heaven',
}

export default async function CheckoutPage() {
  const cart = await getCart()
  
  if (cart.items.length === 0) {
    redirect('/cart')
  }

  const session = await getCustomerSession()
  let customerProfile = null
  if (session?.uid) {
    customerProfile = await fetchCustomer(session.uid)
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  // Assuming a flat delivery fee for now
  const deliveryFee = 500.00 
  const total = subtotal + deliveryFee

  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  })

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site pt-12 pb-section-v-space w-full">
      <ScrollReveal direction="up" className="mb-12">
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">Checkout</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">Complete your artisanal order.</p>
      </ScrollReveal>

      <form action={placeOrderAction} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-10">
          
          <ScrollReveal direction="left">
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Full Name *</label>
                <input required name="name" type="text" defaultValue={customerProfile?.name || session?.name || ''} className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Email Address *</label>
                <input required name="email" type="email" defaultValue={customerProfile?.email || session?.email || ''} className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Phone Number *</label>
                <input required name="phone" type="tel" defaultValue={customerProfile?.phone || ''} className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" placeholder="+94 77 123 4567" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1}>
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6">Fulfillment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative border border-brand-black bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container transition-colors">
                <input type="radio" name="fulfillment" value="delivery" className="absolute opacity-0" defaultChecked />
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-brand-black">local_shipping</span>
                  <div>
                    <span className="block font-label-md text-label-md text-brand-black">Delivery</span>
                    <span className="block font-label-sm text-label-sm text-brand-muted">Within Colombo</span>
                  </div>
                </div>
              </label>
              <label className="relative border border-brand-border bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container transition-colors">
                <input type="radio" name="fulfillment" value="pickup" className="absolute opacity-0" />
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-brand-black">storefront</span>
                  <div>
                    <span className="block font-label-md text-label-md text-brand-black">Store Pickup</span>
                    <span className="block font-label-sm text-label-sm text-brand-muted">Free</span>
                  </div>
                </div>
              </label>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Street Address *</label>
                <input required name="address" type="text" defaultValue={customerProfile?.address?.addressLine1 || ''} className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" placeholder="123 Bakery Lane" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-brand-muted mb-2">City *</label>
                <input required name="city" type="text" defaultValue={customerProfile?.address?.city || ''} className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" placeholder="Colombo" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Postal Code</label>
                <input name="postal" type="text" defaultValue={customerProfile?.address?.postalCode || ''} className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" placeholder="00100" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.3}>
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6">Order Notes</h2>
            <div className="md:col-span-2">
              <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Special instructions (optional)</label>
              <textarea name="notes" rows={3} className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" placeholder="e.g. Leave package at the door..."></textarea>
            </div>
          </ScrollReveal>
        </div>

        {/* Order Summary Sidebar */}
        <ScrollReveal direction="up" delay={0.4} className="lg:col-span-1">
          <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-8 sticky top-[100px]">
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6 pb-4 border-b border-brand-border">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.items.map(item => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden bg-surface-container shrink-0 border border-brand-border relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-brand-black text-brand-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-brand-black line-clamp-1">{item.name}</span>
                    <span className="font-body-md text-body-md text-brand-muted">{formatter.format(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 pt-6 border-t border-brand-border">
              <div className="flex justify-between font-body-md text-body-md text-brand-muted">
                <span>Subtotal</span>
                <span>{formatter.format(subtotal)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-brand-muted">
                <span>Delivery</span>
                <span>{formatter.format(deliveryFee)}</span>
              </div>
            </div>
            
            <div className="flex justify-between font-price-display text-price-display text-brand-black pt-6 border-t border-brand-border mb-6">
              <span>Total</span>
              <span>{formatter.format(total)}</span>
            </div>

            <div className="bg-brand-cream border border-brand-border rounded-lg p-4 mb-8 flex items-start gap-3">
              <span className="material-symbols-outlined text-brand-black mt-0.5">info</span>
              <p className="font-label-sm text-label-sm text-brand-black">Payment is Cash on Delivery (COD). Please have the exact amount ready.</p>
            </div>
            
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-black text-on-primary hover:bg-surface-tint transition-all duration-300 px-8 py-4 rounded-lg font-label-md text-label-md hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              Place Order
            </button>
          </div>
        </ScrollReveal>
      </form>
    </div>
  )
}
