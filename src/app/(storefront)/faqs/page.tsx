import { ScrollReveal } from '@/components/storefront/scroll-reveal'

export const metadata = {
  title: 'FAQs - Creamy Heaven',
  description: 'Frequently asked questions about ordering, delivery, and our artisanal cakes.',
}

export default function FaqsPage() {
  const faqs = [
    {
      question: "How far in advance should I place an order?",
      answer: "For our signature cakes and desserts, we recommend placing your order at least 24-48 hours in advance. For custom bespoke cakes, please contact us at least 1-2 weeks prior to your event date to ensure availability and proper planning."
    },
    {
      question: "Do you offer delivery?",
      answer: "Yes, we offer temperature-controlled delivery within Colombo and its immediate suburbs. A flat delivery fee of $5.00 applies to all orders. Please refer to our Delivery Policy for full details and coverage areas."
    },
    {
      question: "What payment methods do you accept?",
      answer: "Currently, we operate exclusively on a Cash on Delivery (COD) basis. Please ensure you have the exact amount ready upon delivery or pickup."
    },
    {
      question: "Can I customize the flavor of a signature cake?",
      answer: "Our signature cakes are crafted with specific flavor profiles in mind, so we typically do not alter their core recipes. However, if you see a 'Customizable: Yes' note on a product, you can request minor modifications in the order notes. For entirely custom flavors, please use our Contact page to inquire."
    },
    {
      question: "Are your products allergy-friendly?",
      answer: "We list all primary allergens on each product page. However, please note that our kitchen handles dairy, eggs, gluten, and nuts on a daily basis. While we take cross-contamination seriously, we cannot guarantee a 100% allergen-free environment."
    },
    {
      question: "Can I cancel or change my order?",
      answer: "Orders for signature items can be cancelled or modified up to 24 hours before the scheduled delivery/pickup time. Custom cake orders require at least 72 hours notice for any changes or cancellations."
    }
  ]

  return (
    <div className="max-w-3xl mx-auto px-margin-site-mobile md:px-margin-site pt-12 pb-section-v-space w-full">
      <ScrollReveal direction="up" className="mb-12 text-center">
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-4">Frequently Asked Questions</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">
          Everything you need to know about our cakes, ordering process, and delivery.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <div className="bg-surface-container-lowest border border-brand-border rounded-2xl overflow-hidden divide-y divide-brand-border">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group faq-item bg-surface-container-lowest [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-headline-sm text-headline-sm text-brand-black hover:bg-surface-container transition-colors select-none">
                {faq.question}
                <span className="material-symbols-outlined text-brand-muted transition-transform duration-300 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 pt-2 font-body-md text-body-md text-on-surface-variant leading-relaxed animate-fade-in-up">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2} className="mt-12 text-center p-8 bg-surface-container border border-brand-border rounded-xl">
        <h2 className="font-headline-sm text-headline-sm text-brand-black mb-2">Still have questions?</h2>
        <p className="font-body-md text-body-md text-brand-muted mb-6">We're here to help make your experience heavenly.</p>
        <a href="/contact" className="inline-block px-6 py-3 rounded-full border border-brand-black text-brand-black font-label-md text-label-md hover:bg-brand-black hover:text-on-primary transition-colors">
          Contact Us
        </a>
      </ScrollReveal>
    </div>
  )
}
