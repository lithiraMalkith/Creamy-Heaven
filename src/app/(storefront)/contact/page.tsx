'use client'

import { useState } from 'react'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import { submitContactMessage } from './actions'

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const form = e.currentTarget
    
    try {
      const formData = new FormData(form)
      await submitContactMessage(formData)
      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error(error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site pt-12 pb-section-v-space w-full">
      <ScrollReveal direction="up" className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-4">Get in Touch</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">
          Whether you have a question about our menu, need a custom cake for a special occasion, or just want to say hello, we'd love to hear from you.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Contact Form */}
        <ScrollReveal direction="right">
          <div className="bg-surface-container-lowest border border-brand-border rounded-2xl p-8 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6">Send us a Message</h2>
            
            {isSuccess ? (
              <div className="bg-brand-success/10 text-brand-success p-6 rounded-xl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[48px] mb-4">check_circle</span>
                <h3 className="font-label-md text-label-md mb-2">Message Sent!</h3>
                <p className="font-body-md text-body-md">Thank you for reaching out. We will get back to you within 24 hours.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 px-6 py-2 border border-brand-success rounded-full font-label-md text-label-md hover:bg-brand-success hover:text-white transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Name *</label>
                    <input required name="name" type="text" className="w-full px-4 py-3 bg-surface-container border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Email *</label>
                    <input required name="email" type="email" className="w-full px-4 py-3 bg-surface-container border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Subject (Optional)</label>
                  <input name="subject" type="text" className="w-full px-4 py-3 bg-surface-container border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors" />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Message *</label>
                  <textarea required name="message" rows={5} className="w-full px-4 py-3 bg-surface-container border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className={`w-full py-4 rounded-lg font-label-md text-label-md transition-transform flex items-center justify-center gap-2 ${isPending ? 'bg-brand-muted text-white cursor-wait' : 'bg-brand-black text-on-primary hover:bg-surface-tint hover:scale-[1.02]'}`}
                >
                  {isPending ? 'Sending...' : 'Send Message'}
                  {!isPending && <span className="material-symbols-outlined text-[18px]">send</span>}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>

        {/* Info Cards */}
        <ScrollReveal direction="left" className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-brand-border rounded-2xl p-8 flex items-start gap-6 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-brand-black text-[24px]">location_on</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">Our Bakery</h3>
              <p className="font-body-md text-body-md text-brand-muted mb-4">
                123 Baker Street<br />
                Colombo 03<br />
                Sri Lanka
              </p>
              <p className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider">Pickup Available</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-brand-border rounded-2xl p-8 flex items-start gap-6 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-brand-black text-[24px]">schedule</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">Opening Hours</h3>
              <p className="font-body-md text-body-md text-brand-muted mb-1">
                <span className="inline-block w-24">Mon - Sat:</span> 8:00 AM - 8:00 PM
              </p>
              <p className="font-body-md text-body-md text-brand-muted">
                <span className="inline-block w-24">Sunday:</span> 9:00 AM - 4:00 PM
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-brand-border rounded-2xl p-8 flex items-start gap-6 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-brand-black text-[24px]">call</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">Contact Details</h3>
              <p className="font-body-md text-body-md text-brand-muted mb-1">
                +94 77 123 4567
              </p>
              <p className="font-body-md text-body-md text-brand-muted">
                hello@creamyheaven.lk
              </p>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  )
}
