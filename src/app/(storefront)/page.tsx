import Link from 'next/link'
import { fetchFeaturedProducts } from '@/lib/data/products'
import { ProductCard } from '@/components/storefront/product-card'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'

export const metadata = {
  title: 'Creamy Heaven - Artisanal Cakes & Desserts',
  description: 'Premium artisanal bakery offering handcrafted cakes, desserts, and custom orders in Sri Lanka.',
}

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts()

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBob8YTpGW1Fb0fYA9XiaJxBjW_VwhYb7_MZYLciTqUiooR2Lbyx6dQZRxCA6YZzO-NF97QgvdXUQJehS-_gih4_GyEplWeZD_2bGiIOA-KulQucjOsryCE9_j-MkNzpEQ9VYPa3CEc60YdK0jkh-DzUlF9Tz5GpKe_FudGqJTjCIl54oaxpxQ7kRvwVKbn-hrHOx8pUrfxtARnPq5U0i8lAhnmghStTBBT3IZKexxyh2eii4e5AzvpMWjQUQsoQHqnEMJk2rdjOYo=s0" 
            alt="Artisanal Bakery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-margin-site-mobile md:px-margin-site mx-auto text-brand-white pt-10">
          <ScrollReveal direction="up" delay={0.2}>
            <span className="font-label-md text-label-md uppercase tracking-[0.2em] mb-4 block text-brand-cream">
              Since 2024
            </span>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.4}>
            <h1 className="font-headline-lg text-display-hero-mobile md:text-display-hero mb-6">
              Handcrafted Moments of Pure Indulgence
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.6}>
            <p className="font-body-lead text-body-lead md:text-xl text-brand-cream/90 mb-10 max-w-2xl mx-auto">
              Artisanal cakes and desserts made with premium ingredients, passion, and an uncompromising dedication to taste.
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.8}>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center bg-brand-cream text-brand-black px-10 py-4 rounded-full font-label-md text-label-md hover:bg-brand-white hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Explore Our Collection
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-section-v-space bg-brand-cream px-margin-site-mobile md:px-margin-site max-w-max-width-content mx-auto w-full">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-brand-black mb-2">Signature Bakes</h2>
              <p className="font-body-lead text-body-lead text-brand-muted">Our most loved creations</p>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 font-label-md text-label-md text-brand-black border-b border-brand-black pb-1 hover:text-brand-muted hover:border-brand-muted transition-colors">
              View All 
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollReveal>
      </section>

      {/* Why Choose Us - 4 Col Feature Cards */}
      <section className="py-section-v-space bg-surface-container-lowest border-y border-brand-border">
        <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site w-full">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-brand-black mb-4">The Creamy Heaven Difference</h2>
            <p className="font-body-lead text-body-lead text-brand-muted max-w-2xl mx-auto">
              We believe in doing things the right way, without shortcuts.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mx-auto mb-6 text-brand-black">
                <span className="material-symbols-outlined text-[32px]">bakery_dining</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-3">Freshly Baked</h3>
              <p className="font-body-md text-body-md text-brand-muted">Prepared daily in small batches to ensure maximum freshness and quality.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mx-auto mb-6 text-brand-black">
                <span className="material-symbols-outlined text-[32px]">payments</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-3">Cash on Delivery</h3>
              <p className="font-body-md text-body-md text-brand-muted">Pay conveniently at your doorstep when you receive your order.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mx-auto mb-6 text-brand-black">
                <span className="material-symbols-outlined text-[32px]">local_shipping</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-3">Local Delivery</h3>
              <p className="font-body-md text-body-md text-brand-muted">Careful, temperature-controlled delivery across Colombo and suburbs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mx-auto mb-6 text-brand-black">
                <span className="material-symbols-outlined text-[32px]">cake</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-brand-black mb-3">Custom Orders</h3>
              <p className="font-body-md text-body-md text-brand-muted">Bespoke designs tailored specifically for your special celebrations.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-section-v-space bg-brand-black text-brand-cream px-margin-site-mobile md:px-margin-site w-full">
        <div className="max-w-max-width-content mx-auto">
          <ScrollReveal direction="up" className="text-center mb-16">
            <span className="material-symbols-outlined text-brand-muted text-4xl mb-4">format_quote</span>
            <h2 className="font-headline-lg text-headline-lg mb-4">Words of Sweetness</h2>
            <p className="font-body-lead text-body-lead text-brand-cream/80 max-w-2xl mx-auto">
              Don't just take our word for it. Here is what our lovely customers have to say about their Creamy Heaven experience.
            </p>
          </ScrollReveal>

          <ScrollReveal stagger={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-brand-white/5 border border-brand-white/10 p-8 rounded-2xl flex flex-col justify-between hover:bg-brand-white/10 transition-colors duration-300">
              <div>
                <div className="flex gap-1 text-[#D4AF37] mb-6">
                  {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                </div>
                <p className="font-body-md text-body-md text-brand-cream/90 leading-relaxed mb-8 italic">
                  "The chocolate truffle cake was absolute perfection! It was so moist and rich, literally melting in my mouth. Everyone at the party couldn't stop asking where it was from."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-white/10 flex items-center justify-center font-headline-sm">S</div>
                <div>
                  <p className="font-label-md text-label-md">Sarah M.</p>
                  <p className="text-xs text-brand-cream/60">Colombo 05</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-brand-white/5 border border-brand-white/10 p-8 rounded-2xl flex flex-col justify-between hover:bg-brand-white/10 transition-colors duration-300">
              <div>
                <div className="flex gap-1 text-[#D4AF37] mb-6">
                  {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                </div>
                <p className="font-body-md text-body-md text-brand-cream/90 leading-relaxed mb-8 italic">
                  "Ordered a custom anniversary cake and they completely nailed the design I wanted. But more importantly, the taste was unbelievable. Best bakery in Sri Lanka by far!"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-white/10 flex items-center justify-center font-headline-sm">K</div>
                <div>
                  <p className="font-label-md text-label-md">Kavindu D.</p>
                  <p className="text-xs text-brand-cream/60">Dehiwala</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-brand-white/5 border border-brand-white/10 p-8 rounded-2xl flex flex-col justify-between hover:bg-brand-white/10 transition-colors duration-300">
              <div>
                <div className="flex gap-1 text-[#D4AF37] mb-6">
                  {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                </div>
                <p className="font-body-md text-body-md text-brand-cream/90 leading-relaxed mb-8 italic">
                  "I am addicted to their brownies! I order them almost every week for my office. The packaging is premium and delivery is always on time. Highly recommended."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-white/10 flex items-center justify-center font-headline-sm">T</div>
                <div>
                  <p className="font-label-md text-label-md">Tharushi W.</p>
                  <p className="text-xs text-brand-cream/60">Mount Lavinia</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story Teaser */}
      <section className="py-section-v-space bg-brand-cream px-margin-site-mobile md:px-margin-site max-w-max-width-content mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <ScrollReveal direction="right" className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container relative z-10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgiIs2b88iPZLjyVFOXFxGPTDvAv8eI8U9FtByaBukQj_X6OTBq4spc328ohmW5l4ABfSR5vXi5Bp7wTE0Fr0-OabtGS_p6-fkxn996bZ11g--t_YIUMQXb4ipenaTn1vwXdt89aGRT1MHlmulC1x1Mavo1kD3wv185SOlyC2ij53ViV9JejVSUXEGycJOXEGABgeIOPLPN00qN2FqFsF-pg0eZG97edfT8xykDGISZ_6ShUNZVjk3EZyD9p8p1TPej0drevQIlks=s0" 
                alt="Baker decorating cake"
                className="w-full h-full object-cover img-zoom"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-border rounded-full -z-0 opacity-50 hidden md:block"></div>
          </ScrollReveal>

          <ScrollReveal direction="left" className="order-1 md:order-2 flex flex-col items-start">
            <h2 className="font-headline-lg text-headline-lg text-brand-black mb-6">Baked With Love, Since 2024</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
              What started as a small home kitchen passion has blossomed into Creamy Heaven. We believe that every celebration deserves a centerpiece that not only looks spectacular but tastes extraordinary.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-10 leading-relaxed">
              Our recipes blend classic techniques with modern flavor profiles, using only the finest ingredients—from rich European butter to single-origin cocoa.
            </p>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center border border-brand-black text-brand-black px-8 py-3 rounded-full font-label-md text-label-md hover:bg-brand-black hover:text-brand-white transition-all duration-300"
            >
              Discover Our Story
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
