'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Heart,
  Truck,
  Cake,
  Award,
  ShoppingBag,
  Star,
  Quote,
  CheckCircle2,
} from 'lucide-react'
import ModelCanvas from '@/components/home-redesign/ModelCanvas'
import { GSAPTextReveal } from '@/components/home-redesign/GSAPTextReveal'
import { ProductCard } from '@/components/storefront/product-card'
import type { Product } from '@/types'

interface TestHomeClientProps {
  initialProducts: Product[]
}

export default function TestHomeClient({ initialProducts }: TestHomeClientProps) {
  const [stageValue, setStageValue] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const philosophyRef = useRef<HTMLDivElement>(null)
  const creationsRef = useRef<HTMLDivElement>(null)
  const bakedWithLoveRef = useRef<HTMLDivElement>(null)

  // Track scroll position relative to 3D model timeline sections
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight
      if (!philosophyRef.current || !creationsRef.current || !bakedWithLoveRef.current) return

      const philosophyTop = philosophyRef.current.getBoundingClientRect().top
      const creationsTop = creationsRef.current.getBoundingClientRect().top
      const bakedWithLoveTop = bakedWithLoveRef.current.getBoundingClientRect().top

      // Progress 0 -> 1: Hero (Section 1) to Philosophy (Section 2)
      const progress01 = Math.max(0, Math.min(1, (vh - philosophyTop) / vh))

      // Progress 1 -> 2: Philosophy (Section 2) to Signature Creations (Section 3)
      const progress12 = Math.max(0, Math.min(1, (vh - creationsTop) / vh))

      // Progress 2 -> 3: Signature Creations (Section 3) to Baked with Love (Section 4)
      // Model recedes, blurs (24px), and fades to 0 opacity right as Section 3 finishes!
      const progress23 = Math.max(0, Math.min(1, (vh - bakedWithLoveTop) / vh))

      // Cumulative stage value: 0.0 -> 3.0
      const currentStageValue = progress01 + progress12 + progress23
      setStageValue(currentStageValue)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Testimonials Data
  const testimonials = [
    {
      name: 'Dilhara Senanayake',
      location: 'Colombo 07',
      rating: 5,
      comment:
        'The custom 3-tier cake Creamy Heaven created for our wedding was breathtaking! Not only was the design flawless, but the taste was pure perfection. Every guest asked where we got it!',
    },
    {
      name: 'Kavinda Perera',
      location: 'Kandy',
      rating: 5,
      comment:
        'Fast Cash on Delivery across Kandy and the freshest chocolate cake I have ever tasted in Sri Lanka. The texture and rich cacao flavor are unmatched.',
    },
    {
      name: 'Nipuni Wickramasinghe',
      location: 'Galle',
      rating: 5,
      comment:
        'Ordered a surprise birthday box for my mom. Arrived on time, beautifully packed, and tasting like it was just pulled out of the oven. Highly recommend Creamy Heaven!',
    },
  ]

  return (
    <div className="relative bg-brand-cream text-brand-black min-h-screen selection:bg-brand-black selection:text-brand-cream">
      {/* Fixed 3D Canvas Background Viewport */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ModelCanvas stageValue={stageValue} />
      </div>

      {/* Foreground Scrollable Content */}
      <div className="relative z-10">

        {/* SECTION 1: HERO (Model Centered & Softly Blurred Behind Title) */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center"
        >
          <div className="pt-6 sm:pt-10">
            {/* <GSAPTextReveal variant="stagger-pills" delay={0.1}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-white/70 border border-brand-border/70 backdrop-blur-md text-xs sm:text-sm font-semibold uppercase tracking-widest text-brand-black shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Sri Lanka's Finest Artisanal Bakery
              </span>
            </GSAPTextReveal> */}
          </div>

          {/* Central Hero Brand Text - Large & Prominent */}
          <div className="max-w-6xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center">
            <GSAPTextReveal variant="hero-title" delay={0.2}>
              <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] xl:text-[12rem] font-bold tracking-tighter text-brand-black leading-none drop-shadow-sm select-none">
                Creamy Heaven
              </h1>
            </GSAPTextReveal>

            <GSAPTextReveal variant="blur-reveal" delay={0.4}>
              <p className="mt-6 text-lg sm:text-2xl md:text-3xl font-body text-brand-black/90 max-w-3xl font-medium leading-relaxed drop-shadow-xs px-2">
                Handcrafted cakes & luxury desserts baked fresh daily and delivered across Sri Lanka.
              </p>
            </GSAPTextReveal>

            <GSAPTextReveal variant="stagger-pills" delay={0.6}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto btn-hover inline-flex items-center justify-center gap-2 px-9 py-4 bg-brand-black text-brand-white font-body font-semibold rounded-xl text-base shadow-xl hover:shadow-2xl transition-all group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto btn-hover inline-flex items-center justify-center gap-2 px-9 py-4 bg-brand-white/80 border border-brand-border text-brand-black font-body font-semibold rounded-xl backdrop-blur-md hover:bg-brand-white transition-all shadow-xs text-base"
                >
                  Custom Orders
                </Link>
              </div>
            </GSAPTextReveal>
          </div>

          {/* Scroll Indicator */}
          <div className="pb-6 flex flex-col items-center gap-2 opacity-80 animate-bounce">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
              Scroll to explore
            </span>
            <ChevronDown className="w-5 h-5 text-brand-black" />
          </div>
        </section>

        {/* SECTION 2: STAGE 1 (Model on RIGHT, Text on LEFT, Light from LEFT) */}
        <section
          ref={philosophyRef}
          className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
            {/* Left Column Transparent Content */}
            <div className="space-y-6 max-w-xl">
              {/* <GSAPTextReveal
                variant="stagger-pills"
                stageRange={[0.15, 0.85]}
                currentStageValue={stageValue}
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/60 text-xs font-bold uppercase tracking-widest text-amber-900 backdrop-blur-xs">
                  01 / Our Philosophy
                </span>
              </GSAPTextReveal> */}

              <GSAPTextReveal
                variant="clip-slide"
                stageRange={[0.25, 0.95]}
                currentStageValue={stageValue}
              >
                <h2 className="font-heading text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-brand-black">
                  Artisanal Baking, Reimagined
                </h2>
              </GSAPTextReveal>

              <GSAPTextReveal
                variant="blur-reveal"
                stageRange={[0.35, 1.05]}
                currentStageValue={stageValue}
              >
                <p className="font-body text-lg sm:text-xl text-brand-black-soft leading-relaxed font-normal">
                  We believe that every dessert should tell a story. From rich Sri Lankan spices and real Ceylon butter to premium imported chocolates, our master chefs craft masterpieces that indulge every sense.
                </p>
              </GSAPTextReveal>

              {/* Floating Feature Pills */}
              <GSAPTextReveal
                variant="stagger-pills"
                stageRange={[0.45, 1.15]}
                currentStageValue={stageValue}
              >
                <div className="pt-4 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-white/60 border border-brand-border/60 backdrop-blur-md shadow-2xs">
                    <Heart className="w-4 h-4 text-amber-600 stroke-amber-600" />
                    <span className="text-sm font-semibold font-body text-brand-black">Baked Fresh Daily</span>
                  </div>
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-white/60 border border-brand-border/60 backdrop-blur-md shadow-2xs">
                    <Award className="w-4 h-4 text-amber-600 stroke-amber-600" />
                    <span className="text-sm font-semibold font-body text-brand-black">Pure Ingredients</span>
                  </div>
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-white/60 border border-brand-border/60 backdrop-blur-md shadow-2xs">
                    <Truck className="w-4 h-4 text-amber-600 stroke-amber-600" />
                    <span className="text-sm font-semibold font-body text-brand-black">Islandwide Express COD</span>
                  </div>
                </div>
              </GSAPTextReveal>
            </div>

            {/* Right Column: Empty spacer for 3D Model */}
            <div className="hidden md:block min-h-[400px] pointer-events-none" />
          </div>
        </section>

        {/* SECTION 3: STAGE 2 (Model on LEFT, Text on RIGHT, Light from RIGHT) */}
        <section
          ref={creationsRef}
          className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
            {/* Left Column: Empty spacer for 3D Model */}
            <div className="hidden md:block min-h-[400px] pointer-events-none" />

            {/* Right Column Transparent Content */}
            <div className="space-y-6 max-w-xl">
              {/* <GSAPTextReveal
                variant="stagger-pills"
                stageRange={[1.15, 1.75]}
                currentStageValue={stageValue}
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/60 text-xs font-bold uppercase tracking-widest text-amber-900 backdrop-blur-xs">
                  02 / Signature Creations
                </span>
              </GSAPTextReveal> */}

              <GSAPTextReveal
                variant="clip-slide"
                stageRange={[1.25, 1.85]}
                currentStageValue={stageValue}
              >
                <h2 className="font-heading text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-brand-black">
                  Crafted for Life’s Celebrations
                </h2>
              </GSAPTextReveal>

              <GSAPTextReveal
                variant="blur-reveal"
                stageRange={[1.35, 1.95]}
                currentStageValue={stageValue}
              >
                <p className="font-body text-lg sm:text-xl text-brand-black-soft leading-relaxed font-normal">
                  Whether you're celebrating an intimate birthday, wedding tier, or quiet afternoon treat, our signature dessert creations turn special moments into lifelong memories.
                </p>
              </GSAPTextReveal>

              <GSAPTextReveal
                variant="stagger-pills"
                stageRange={[1.45, 2.05]}
                currentStageValue={stageValue}
              >
                <div className="space-y-3 pt-2">
                  {[
                    'Custom Multi-Tier Wedding Cakes',
                    'Gourmet Cupcakes & Dessert Jars',
                    'Traditional Sri Lankan Butter Cakes',
                    'Velvety Chocolate & Fruit Gateaux',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-base font-semibold font-body text-brand-black">
                      <span className="w-2 h-2 rounded-full bg-amber-600 shadow-xs" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="/shop"
                    className="btn-hover inline-flex items-center gap-2 px-7 py-3.5 bg-brand-black text-brand-white font-body font-semibold rounded-xl text-sm shadow-md"
                  >
                    <span>Browse All Products</span>
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </div>
              </GSAPTextReveal>
            </div>
          </div>
        </section>

        {/* SECTION 4: BAKED WITH LOVE (Model recedes, blurs, and disappears right as this section starts) */}
        <section
          ref={bakedWithLoveRef}
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40"
        >
          <GSAPTextReveal
            variant="clip-slide"
            stageRange={[2.05, 2.75]}
            currentStageValue={stageValue}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            {/* <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/60 border border-rose-200/60 text-xs font-bold uppercase tracking-widest text-amber-900 backdrop-blur-xs">
              Handcrafted Sri Lankan Heritage
            </span> */}
            <h2 className="font-heading text-5xl sm:text-6xl font-bold text-brand-black tracking-tight">
              Baked with Passion & Love
            </h2>
            <p className="font-body text-lg sm:text-xl text-brand-black-soft leading-relaxed">
              From our ovens in Sri Lanka to your family table, every creation is handmade with no shortcuts, pure cream, and authentic craftsmanship.
            </p>
          </GSAPTextReveal>

          <GSAPTextReveal
            variant="stagger-pills"
            stageRange={[2.15, 2.85]}
            currentStageValue={stageValue}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-brand-white/50 border border-brand-border/60 backdrop-blur-md space-y-4 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold text-xl">
                  🎂
                </div>
                <h3 className="font-heading text-2xl font-bold text-brand-black">100% Made to Order</h3>
                <p className="font-body text-brand-black-soft text-base leading-relaxed">
                  We never store pre-baked cakes on shelves. Every order is baked fresh from scratch only after you confirm.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-brand-white/50 border border-brand-border/60 backdrop-blur-md space-y-4 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold text-xl">
                  🌿
                </div>
                <h3 className="font-heading text-2xl font-bold text-brand-black">Pure Ingredients</h3>
                <p className="font-body text-brand-black-soft text-base leading-relaxed">
                  Real New Zealand butter, authentic Ceylon vanilla, and single-origin dark cocoa. Zero artificial additives.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-brand-white/50 border border-brand-border/60 backdrop-blur-md space-y-4 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold text-xl">
                  🚚
                </div>
                <h3 className="font-heading text-2xl font-bold text-brand-black">Temperature Delivery</h3>
                <p className="font-body text-brand-black-soft text-base leading-relaxed">
                  Specially designed insulated transport boxes ensure your cake arrives chilled, intact, and camera-ready.
                </p>
              </div>
            </div>
          </GSAPTextReveal>
        </section>

        {/* SECTION 5: FEATURED PRODUCTS GRID (ACTUAL PRODUCTS LIKE HOME PAGE) */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40">
          <GSAPTextReveal variant="clip-slide" className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                {/* <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/60 text-xs font-bold uppercase tracking-widest text-amber-900 backdrop-blur-xs">
                  Curated Favorites
                </span> */}
                <h2 className="font-heading text-5xl sm:text-6xl font-bold text-brand-black tracking-tight">
                  Our Most Loved Delights
                </h2>
              </div>
              <Link
                href="/shop"
                className="btn-hover inline-flex items-center gap-2 px-6 py-3.5 bg-brand-black text-brand-white font-body font-semibold rounded-xl text-sm shadow-md self-start md:self-auto"
              >
                <span>Explore All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </GSAPTextReveal>

          <GSAPTextReveal variant="stagger-pills">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {initialProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </GSAPTextReveal>
        </section>

        {/* SECTION 6: CUSTOMER TESTIMONIALS */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40">
          <GSAPTextReveal variant="clip-slide" className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            {/* <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/60 text-xs font-bold uppercase tracking-widest text-amber-900 backdrop-blur-xs">
              Customer Stories
            </span> */}
            <h2 className="font-heading text-5xl sm:text-6xl font-bold text-brand-black tracking-tight">
              Loved Across Sri Lanka
            </h2>
            <p className="font-body text-lg sm:text-xl text-brand-black-soft leading-relaxed">
              Read real feedback from customers who celebrated their milestone moments with Creamy Heaven.
            </p>
          </GSAPTextReveal>

          <GSAPTextReveal variant="stagger-pills">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-brand-white/50 border border-brand-border/60 backdrop-blur-md flex flex-col justify-between space-y-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>

                    <Quote className="w-8 h-8 text-amber-700/30" />

                    <p className="font-body text-brand-black-soft text-base leading-relaxed italic">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-lg text-brand-black">{t.name}</h4>
                      <p className="text-xs text-brand-muted font-body">{t.location}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-black" />
                  </div>
                </div>
              ))}
            </div>
          </GSAPTextReveal>
        </section>

        {/* SECTION 7: FINAL CTA BANNER */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <GSAPTextReveal variant="blur-reveal" className="w-full space-y-8 py-8">
            <div className="inline-flex p-3.5 rounded-full bg-brand-white/60 border border-brand-border/60 backdrop-blur-md text-amber-800 shadow-2xs">
              <Cake className="w-8 h-8" />
            </div>

            <h2 className="font-heading text-5xl sm:text-7xl font-bold text-brand-black tracking-tight drop-shadow-xs">
              Ready to Experience Creamy Heaven?
            </h2>

            <p className="font-body text-lg sm:text-2xl text-brand-black-soft max-w-2xl mx-auto leading-relaxed font-normal">
              Explore our fresh collection online or reach out directly to create your bespoke dessert design.
            </p>

            {/* Bottom Call to Action */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="btn-hover px-8 py-4 bg-brand-black text-brand-white font-body font-semibold rounded-xl text-base shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/"
                className="btn-hover px-8 py-4 bg-brand-white/70 border border-brand-border text-brand-black font-body font-semibold rounded-xl backdrop-blur-md text-base shadow-2xs"
              >
                Return to Current Home
              </Link>
            </div>
          </GSAPTextReveal>
        </section>

      </div>
    </div>
  )
}
