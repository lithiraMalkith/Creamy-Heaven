import Link from 'next/link'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'

export const metadata = {
  title: 'Our Story - Creamy Heaven',
  description: 'Learn about our passion for artisanal baking and the story behind Creamy Heaven.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[614px] flex items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0 z-0 bg-brand-black-soft">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 w-full h-full"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHSdU2ubPmf_0c-Dv4wEKpsZtE-VUBxQYyjEHmoIeIV5hjc6VgsA5kSY1Ar06xf2ZSBRhg0HDRzo9xPZM_I0xZelHMY1vObpXpnlRFljC4D_yo1BSA_MrcjRp_9PGm1ow_AnxWt4XmvYQEVGotOK89a3dvh6Zzx3B-H26OBVQxHzzOhSKPme2zGup7RQNzPoNf3DxC8A9Cmigxl4RCeVaVdFZFUjrNA9cWLN9s1NJ9NucKellqstYulvBrAL9OlHuAQ8OBzhRzY1E=s0')" }}
          ></div>
        </div>
        <div className="relative z-10 text-center px-margin-site-mobile">
          <ScrollReveal direction="up">
            <h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-white mb-4">Our Story</h1>
            <p className="font-body-lead text-body-lead text-brand-cream max-w-2xl mx-auto">Crafting moments of indulgence since 2010.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-section-v-space px-margin-site-mobile md:px-margin-site">
        <div className="max-w-max-width-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="right" className="order-2 md:order-1">
            <h2 className="font-headline-lg text-headline-lg text-brand-black mb-6">A Heritage of Flavour</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              At Creamy Heaven, we believe that baking is an art form rooted in patience, passion, and the finest ingredients. Our journey began in a small, sunlit kitchen where family recipes were perfected over generations, passed down like cherished heirlooms.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Today, we bring that same dedication to our boutique bakery. We don't just bake cakes and pastries; we craft edible memories. Every tart, every loaf, and every intricate dessert is a testament to our commitment to uncompromising quality and authentic taste. We source our flour locally, our vanilla globally, and blend them with an artisanal touch that you can feel in every bite.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-brand-black"></div>
              <span className="font-label-md text-label-md text-brand-black uppercase tracking-wider">The Founders</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="left" className="order-1 md:order-2 relative group overflow-hidden rounded-xl border border-brand-border">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFUWlWf13DQRUIsQ3kZNuShi7u87HlBixVGqGtMCOtPOZXDYMOZCrrJoAkWFC0aGXc4uupafyE5UvRM3gVAKyJ_4kFqj2jKMGpFjXC5bd0ugyZMoVGFx2A2NcqD0-vrU1hJmhM_CqCgkolvAQUeCm_K7ZypN7vUddHb04EZ4wUGGPNi8YnocLtf1EPwMJJsRX_w8aSmEj_ZHKv3xy2FmKALGgX8lTx_MWhXAZ5YKNYn7oOWgibEr-epvKXtLMQcdHUATzKSMFwV68=s0" 
              alt="Master baker decorating a berry tart"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 aspect-[4/5] md:aspect-square"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="bg-brand-cream py-section-v-space px-margin-site-mobile md:px-margin-site border-y border-brand-border">
        <div className="max-w-max-width-content mx-auto">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h2 className="font-headline-md text-headline-md text-brand-black">Our Promise</h2>
          </ScrollReveal>
          
          <ScrollReveal stagger={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md">
            {/* Promise 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-brand-border text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-brand-cream mx-auto flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-brand-black text-3xl">cake</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-3">Freshly Made</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Baked in small batches every morning to ensure the perfect texture and maximum flavor.</p>
            </div>
            
            {/* Promise 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-brand-border text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-brand-cream mx-auto flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-brand-black text-3xl">eco</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-3">Quality Ingredients</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">We source only the finest, ethically produced ingredients from trusted local and global artisans.</p>
            </div>
            
            {/* Promise 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-brand-border text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-brand-cream mx-auto flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-brand-black text-3xl">favorite</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-3">Made with Love</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Every creation is meticulously crafted by hand, reflecting our deep passion for the art of baking.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-v-space px-margin-site-mobile md:px-margin-site text-center">
        <ScrollReveal direction="up" className="max-w-2xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-brand-black mb-4">Ready to Indulge?</h2>
          <p className="font-body-lead text-body-lead text-on-surface-variant mb-8">
            Explore our collection of artisanal treats or reach out for custom orders and inquiries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop" className="bg-brand-black text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-brand-black-soft transition-colors duration-300">
              Shop Now
            </Link>
            <Link href="/contact" className="bg-surface-container-lowest text-brand-black font-label-md text-label-md px-8 py-4 rounded border border-brand-border hover:bg-surface-container hover:border-outline transition-colors duration-300">
              Contact Us
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
