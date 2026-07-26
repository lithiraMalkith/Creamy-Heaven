import { redirect } from 'next/navigation'
import { getCart } from '@/lib/cart'
import { getCustomerSession } from '@/lib/customer-session'
import { fetchCustomer } from '@/lib/data/customers'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import { CheckoutForm } from './checkout-form'

export const metadata = {
  title: 'Checkout - Creamy Heaven',
  description: 'Complete your artisanal cake & dessert order with local delivery or store pickup.',
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

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site pt-10 pb-section-v-space w-full">
      <ScrollReveal direction="up" className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">
          Checkout
        </h1>
        <p className="font-body-lead text-body-lead text-brand-muted">
          Complete your artisanal order with local delivery or store pickup.
        </p>
      </ScrollReveal>

      <CheckoutForm
        cart={cart}
        customerProfile={customerProfile}
        session={session}
      />
    </div>
  )
}
