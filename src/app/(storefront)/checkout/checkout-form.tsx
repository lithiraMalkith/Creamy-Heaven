'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  Store,
  MapPin,
  Clock,
  ShoppingBag,
  Info,
  CheckCircle2,
} from 'lucide-react'
import type { Cart, CartItem } from '@/lib/cart'
import { placeOrderAction } from './actions'

interface CustomerProfile {
  name?: string
  email?: string
  phone?: string
  address?: {
    addressLine1?: string
    city?: string
    postalCode?: string
  }
}

interface CheckoutFormProps {
  cart: {
    items: CartItem[]
  }
  customerProfile: CustomerProfile | null
  session: {
    name?: string
    email?: string
  } | null
}

export function CheckoutForm({
  cart,
  customerProfile,
  session,
}: CheckoutFormProps) {
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery')

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const deliveryFee = fulfillment === 'delivery' ? 500 : 0
  const total = subtotal + deliveryFee

  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  })

  return (
    <form action={placeOrderAction} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Hidden input to pass fulfillment value to server action */}
      <input type="hidden" name="fulfillment" value={fulfillment} />

      {/* Main Checkout Inputs (Left 2 Columns) */}
      <div className="lg:col-span-2 space-y-10">
        {/* Contact Information */}
        <section className="bg-brand-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <h2 className="font-heading text-xl font-bold text-brand-black flex items-center gap-2">
            <span>1. Contact Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-body text-xs font-semibold text-brand-black mb-1.5">
                Full Name *
              </label>
              <input
                required
                name="name"
                type="text"
                defaultValue={customerProfile?.name || session?.name || ''}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 bg-[#eeedec]/40 border border-brand-border rounded-xl font-body text-sm text-brand-black focus:outline-none focus:border-brand-black focus:bg-brand-white transition-colors"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-semibold text-brand-black mb-1.5">
                Email Address *
              </label>
              <input
                required
                name="email"
                type="email"
                defaultValue={customerProfile?.email || session?.email || ''}
                placeholder="jane@example.com"
                className="w-full px-4 py-3 bg-[#eeedec]/40 border border-brand-border rounded-xl font-body text-sm text-brand-black focus:outline-none focus:border-brand-black focus:bg-brand-white transition-colors"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-semibold text-brand-black mb-1.5">
                Phone Number *
              </label>
              <input
                required
                name="phone"
                type="tel"
                defaultValue={customerProfile?.phone || ''}
                placeholder="+94 77 123 4567"
                className="w-full px-4 py-3 bg-[#eeedec]/40 border border-brand-border rounded-xl font-body text-sm text-brand-black focus:outline-none focus:border-brand-black focus:bg-brand-white transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Fulfillment Method Selection */}
        <section className="bg-brand-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <h2 className="font-heading text-xl font-bold text-brand-black flex items-center gap-2">
            <span>2. Fulfillment Method</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Option Card */}
            <div
              onClick={() => setFulfillment('delivery')}
              className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                fulfillment === 'delivery'
                  ? 'border-brand-black bg-brand-cream/30 ring-1 ring-brand-black shadow-xs'
                  : 'border-brand-border bg-brand-white hover:border-brand-muted hover:bg-brand-cream/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${fulfillment === 'delivery' ? 'bg-brand-black text-brand-white' : 'bg-brand-cream text-brand-black'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-body font-bold text-sm text-brand-black">
                      Local Delivery
                    </span>
                    <span className="block font-body text-xs text-brand-muted">
                      Colombo & Suburbs (LKR 500)
                    </span>
                  </div>
                </div>
                {fulfillment === 'delivery' && (
                  <CheckCircle2 className="w-5 h-5 text-brand-black shrink-0" />
                )}
              </div>
            </div>

            {/* Store Pickup Option Card */}
            <div
              onClick={() => setFulfillment('pickup')}
              className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                fulfillment === 'pickup'
                  ? 'border-brand-black bg-brand-cream/30 ring-1 ring-brand-black shadow-xs'
                  : 'border-brand-border bg-brand-white hover:border-brand-muted hover:bg-brand-cream/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${fulfillment === 'pickup' ? 'bg-brand-black text-brand-white' : 'bg-brand-cream text-brand-black'}`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-body font-bold text-sm text-brand-black">
                      Store Pickup
                    </span>
                    <span className="block font-body text-xs text-brand-success font-semibold">
                      Free Collection
                    </span>
                  </div>
                </div>
                {fulfillment === 'pickup' && (
                  <CheckCircle2 className="w-5 h-5 text-brand-black shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* Store Pickup Details Box (Revealed when Pickup is selected) */}
          {fulfillment === 'pickup' && (
            <div className="mt-4 p-5 bg-amber-950/5 border border-amber-950/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <Store className="w-4 h-4 text-amber-800" />
                <span>Pickup Location & Hours</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-black/80 font-body">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-brand-black">Creamy Heaven Main Bakery</p>
                    <p>45 Galle Road, Colombo 03, Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-brand-black">Collection Hours</p>
                    <p>Monday – Sunday: 9:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-brand-muted border-t border-amber-900/10 pt-2.5">
                Note: No delivery fees apply for Store Pickup. Please bring your order confirmation when collecting.
              </p>
            </div>
          )}
        </section>

        {/* Delivery Address Section (Rendered ONLY if Delivery is selected) */}
        {fulfillment === 'delivery' && (
          <section className="bg-brand-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
            <h2 className="font-heading text-xl font-bold text-brand-black flex items-center gap-2">
              <span>3. Delivery Address</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-body text-xs font-semibold text-brand-black mb-1.5">
                  Street Address *
                </label>
                <input
                  required
                  name="address"
                  type="text"
                  defaultValue={customerProfile?.address?.addressLine1 || ''}
                  placeholder="123 Bakery Lane"
                  className="w-full px-4 py-3 bg-[#eeedec]/40 border border-brand-border rounded-xl font-body text-sm text-brand-black focus:outline-none focus:border-brand-black focus:bg-brand-white transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-semibold text-brand-black mb-1.5">
                  City *
                </label>
                <input
                  required
                  name="city"
                  type="text"
                  defaultValue={customerProfile?.address?.city || ''}
                  placeholder="Colombo"
                  className="w-full px-4 py-3 bg-[#eeedec]/40 border border-brand-border rounded-xl font-body text-sm text-brand-black focus:outline-none focus:border-brand-black focus:bg-brand-white transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-semibold text-brand-black mb-1.5">
                  Postal Code
                </label>
                <input
                  name="postal"
                  type="text"
                  defaultValue={customerProfile?.address?.postalCode || ''}
                  placeholder="00100"
                  className="w-full px-4 py-3 bg-[#eeedec]/40 border border-brand-border rounded-xl font-body text-sm text-brand-black focus:outline-none focus:border-brand-black focus:bg-brand-white transition-colors"
                />
              </div>
            </div>
          </section>
        )}

        {/* Order Notes Section */}
        <section className="bg-brand-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h2 className="font-heading text-xl font-bold text-brand-black">
            {fulfillment === 'delivery' ? '4. Special Instructions' : '3. Special Instructions'}
          </h2>
          <div>
            <label className="block font-body text-xs font-semibold text-brand-black mb-1.5">
              Order notes or dietary preferences (optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="e.g. Please write 'Happy Birthday Sam' on the ribbon cake..."
              className="w-full px-4 py-3 bg-[#eeedec]/40 border border-brand-border rounded-xl font-body text-sm text-brand-black focus:outline-none focus:border-brand-black focus:bg-brand-white transition-colors resize-none"
            />
          </div>
        </section>
      </div>

      {/* Order Summary Sidebar (Right Column) */}
      <div className="lg:col-span-1">
        <div className="bg-brand-white border border-brand-border rounded-2xl p-6 sm:p-8 sticky top-[100px] shadow-sm space-y-6">
          <h2 className="font-heading text-xl font-bold text-brand-black pb-4 border-b border-brand-border">
            Order Summary
          </h2>

          {/* Cart Items Summary */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-brand-border relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-1 -right-1 bg-brand-black text-brand-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-body text-xs font-bold text-brand-black truncate">
                    {item.name}
                  </p>
                  <p className="font-body text-xs text-brand-muted">
                    {formatter.format(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-3 pt-4 border-t border-brand-border font-body text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-black">{formatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>Fulfillment Fee ({fulfillment === 'delivery' ? 'Delivery' : 'Pickup'})</span>
              <span className="font-semibold text-brand-black">
                {fulfillment === 'delivery' ? formatter.format(500) : 'FREE'}
              </span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center pt-4 border-t border-brand-border text-brand-black">
            <span className="font-heading text-lg font-bold">Total</span>
            <span className="font-heading text-2xl font-bold text-amber-950">
              {formatter.format(total)}
            </span>
          </div>

          {/* Payment Notice */}
          <div className="bg-brand-cream/70 border border-brand-border rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <p className="font-body text-xs text-brand-black leading-relaxed">
              {fulfillment === 'delivery'
                ? 'Payment is Cash on Delivery (COD). Please have the exact amount ready upon delivery.'
                : 'Payment is Cash on Pickup. Please pay at the counter when collecting your bakes.'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-black text-brand-white hover:bg-brand-black/90 active:scale-98 transition-all py-4 rounded-xl font-body font-bold text-sm shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {fulfillment === 'delivery'
                ? 'Place Delivery Order'
                : 'Place Pickup Order'}
            </span>
          </button>
        </div>
      </div>
    </form>
  )
}
