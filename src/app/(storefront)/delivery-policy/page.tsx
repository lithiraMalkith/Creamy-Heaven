import { ScrollReveal } from '@/components/storefront/scroll-reveal'

export const metadata = {
  title: 'Delivery Policy - Creamy Heaven',
}

export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin-site-mobile md:px-margin-site pt-12 pb-section-v-space w-full">
      <ScrollReveal direction="up" className="mb-12">
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-4">Delivery Policy</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">
          Information regarding our shipping, local delivery, and store pickup options.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1} className="bg-surface-container-lowest border border-brand-border rounded-2xl p-8 md:p-12 prose prose-stone max-w-none prose-headings:font-heading prose-headings:text-brand-black prose-p:font-body prose-p:text-on-surface-variant">
        <h2>1. Local Delivery Area</h2>
        <p>
          Creamy Heaven currently offers temperature-controlled local delivery within Colombo 01 to 15 and immediate suburbs (Dehiwala, Nugegoda, Rajagiriya, Wattala). We handle all our deliveries with specialized vehicles to ensure your artisanal cakes arrive in pristine condition.
        </p>

        <h2>2. Delivery Fees & Timing</h2>
        <p>
          A flat delivery fee of <strong>$5.00</strong> applies to all orders within our local delivery zone. 
        </p>
        <ul>
          <li><strong>Standard Delivery:</strong> Available between 10:00 AM and 6:00 PM, Monday to Saturday.</li>
          <li><strong>Sunday Delivery:</strong> Available between 10:00 AM and 2:00 PM.</li>
        </ul>
        <p>
          Specific delivery time slots (e.g., 2:00 PM - 4:00 PM) can be requested in the order notes, and we will do our best to accommodate them, though exact times cannot be guaranteed due to traffic conditions.
        </p>

        <h2>3. Store Pickup</h2>
        <p>
          Store pickup is always free. Orders can be collected from our main bakery located at:
          <br /><br />
          <strong>123 Baker Street, Colombo 03</strong>
          <br /><br />
          Please ensure you have your order confirmation number ready when arriving for collection.
        </p>

        <h2>4. Handling Upon Delivery</h2>
        <p>
          Our cakes are delicate. Upon receiving your order, please handle the box from the bottom. Do not press the sides of the box. Most of our cakes require refrigeration; please place them in the fridge as soon as possible and take them out 30 minutes before serving for the best texture and flavor.
        </p>

        <h2>5. Unsuccessful Deliveries</h2>
        <p>
          Since our products are perishable, it is crucial that someone is available to receive the delivery. Our driver will attempt to contact the provided phone number. If the delivery is unsuccessful after 15 minutes of waiting, the order will be returned to the bakery for pickup, and the delivery fee will not be refunded.
        </p>
      </ScrollReveal>
    </div>
  )
}
