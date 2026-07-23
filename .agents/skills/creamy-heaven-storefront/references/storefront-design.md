# Storefront Design Reference — Page-by-Page Spec

This document defines the visual design, layout, and interaction patterns for every storefront
page. Read this BEFORE writing any storefront component code.

---

## 1. Design Philosophy

Creamy Heaven's storefront should feel **warm, artisanal, and premium** — like walking into a
high-end bakery. The design language:

- **Warm & inviting**: The cream (`#F7F1E6`) background creates a parchment-like warmth.
  White cards on cream feel elevated and clean. The black (`#151210`) is a warm near-black,
  not a cold pure black.
- **Elegant typography**: Cormorant Garamond for headings gives a serif elegance that says
  "handcrafted." Manrope for body copy is clean and modern.
- **Generous whitespace**: Let the products breathe. No cramped layouts.
- **Subtle motion**: Cards lift on hover, grids stagger in, buttons scale — all via CSS
  transforms. No jarring animations.
- **Photography-forward**: Large, appetizing product images are the centerpiece. The UI frame
  should not compete with the food photography.

---

## 2. Responsive Breakpoints

All layouts are mobile-first. Breakpoints follow Tailwind defaults:

| Breakpoint | Width | Layout Notes |
|---|---|---|
| Default (mobile) | < 640px | Single column, full-width cards, stacked nav |
| `sm:` | ≥ 640px | 2-column product grid |
| `md:` | ≥ 768px | Header nav visible, 3-column grid |
| `lg:` | ≥ 1024px | 4-column grid, side-by-side layouts |
| `xl:` | ≥ 1280px | Max-width container `max-w-7xl` centered |

---

## 3. Page Layouts

### 3.1 Home Page

```
┌─────────────────────────────────────────────┐
│  HEADER (sticky, glass-blur)                │
├─────────────────────────────────────────────┤
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║  HERO SECTION — Full width            ║  │
│  ║  Background: Cloudinary hero image    ║  │
│  ║  Overlay: brand-black/50 gradient     ║  │
│  ║                                       ║  │
│  ║  "Creamy Heaven"     (7xl, heading)   ║  │
│  ║  "Handcrafted cakes  (lg, white/80)   ║  │
│  ║   & desserts"                         ║  │
│  ║                                       ║  │
│  ║  [Shop Now]  (btn, white on black)    ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  ── Featured Products ─────────────────────  │
│  "Our Bestsellers"    (3xl, heading)         │
│                                             │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │
│  │   │ │   │ │   │ │   │  (product cards)   │
│  │img│ │img│ │img│ │img│  (4-col grid)      │
│  │   │ │   │ │   │ │   │  (.card-hover)     │
│  │nam│ │nam│ │nam│ │nam│                     │
│  │LKR│ │LKR│ │LKR│ │LKR│                   │
│  └───┘ └───┘ └───┘ └───┘                   │
│                                             │
│  ── Brand Promise Strip ───────────────────  │
│  bg-brand-black, full width                  │
│  "Fresh Daily · COD Available · Island-wide" │
│                                             │
│  ── About Teaser ──────────────────────────  │
│  2-col: image left + text right              │
│  "Our Story" heading + 2 paragraphs          │
│  [Learn More →]                              │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Home sections animation**: Each section gets `.animate-fade-in-up`. The product grid gets
`.animate-in-stagger` so cards cascade in with staggered delays.

### 3.2 Shop Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  Breadcrumb: Home > Shop                    │
│                                             │
│  "Shop"  (3xl heading)                      │
│  "Browse our handcrafted collection"        │
│                                             │
│  ── Category Filters ──────────────────────  │
│  [All] [Cakes] [Desserts] [Custom]          │
│  (pill buttons, active = bg-brand-black)    │
│  (plain <Link> elements, not buttons)       │
│                                             │
│  ── Sub-Category + Sort + Search ──────────  │
│  Left: sub-category pills (if category set) │
│  Right: sort dropdown <form> + search input │
│                                             │
│  ── Product Grid ──────────────────────────  │
│  2-col mobile → 3-col md → 4-col lg         │
│  Each card: .card-hover                      │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │
│  │   │ │   │ │   │ │   │                    │
│  └───┘ └───┘ └───┘ └───┘                   │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │
│  │   │ │   │ │   │ │   │                    │
│  └───┘ └───┘ └───┘ └───┘                   │
│                                             │
│  ── Empty State ───────────────────────────  │
│  (if no products match filters)             │
│  "No products found" + [Clear Filters]      │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

### 3.3 Product Detail Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  Breadcrumb: Home > Shop > {Category} > ... │
│                                             │
│  ┌──────────────┬──────────────────────┐    │
│  │              │                      │    │
│  │  MAIN IMAGE  │  Category badge      │    │
│  │  (aspect-sq) │  Product Name (3xl)  │    │
│  │              │  Price (2xl, bold)    │    │
│  │              │                      │    │
│  │──────────────│  Description text    │    │
│  │ thumb thumb  │                      │    │
│  │ (image       │  ── Details ────     │    │
│  │  gallery)    │  Size: 1kg           │    │
│  │              │  Flavor: Chocolate   │    │
│  │              │  Lead time: 24hrs    │    │
│  │              │                      │    │
│  │              │  ── Allergens ────   │    │
│  │              │  🥜 Nuts 🥛 Dairy    │    │
│  │              │                      │    │
│  │              │  Qty: [-] 1 [+]      │    │
│  │              │  [Add to Cart]       │    │
│  │              │  (btn-hover, full w) │    │
│  └──────────────┴──────────────────────┘    │
│                                             │
│  ── Ingredients ───────────────────────────  │
│  Full ingredient list (if present)           │
│                                             │
│  ── Related Products ──────────────────────  │
│  "You May Also Like"                         │
│  4 product cards from same category          │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Layout**: 2-column on desktop (image left 50%, details right 50%). Single column stacked
on mobile (image full width, details below).

### 3.4 Cart Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  "Your Cart"  (3xl heading)                 │
│  "{n} items"                                │
│                                             │
│  ┌─────────────────────────┬───────────┐    │
│  │  CART ITEMS             │  SUMMARY  │    │
│  │                         │           │    │
│  │  ┌─────────────────┐   │  Subtotal │    │
│  │  │ img | Name      │   │  Delivery │    │
│  │  │     | LKR x Qty │   │  ─────── │    │
│  │  │     | [-] 2 [+] │   │  Total   │    │
│  │  │     | [Remove]  │   │           │    │
│  │  └─────────────────┘   │  [Proceed │    │
│  │                         │   to      │    │
│  │  ┌─────────────────┐   │   Check-  │    │
│  │  │ img | Name      │   │   out]    │    │
│  │  └─────────────────┘   │           │    │
│  └─────────────────────────┴───────────┘    │
│                                             │
│  ── Empty Cart ────────────────────────────  │
│  Illustration or icon                        │
│  "Your cart is empty"                        │
│  [Continue Shopping →]                       │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Layout**: 2-column on desktop (cart items 2/3, summary 1/3). Single column on mobile
(items first, summary sticky at bottom).

### 3.5 Checkout Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  "Checkout"  (3xl heading)                  │
│  "Cash on Delivery — pay when it arrives"   │
│                                             │
│  <form action={placeOrder}>                 │
│  ┌─────────────────────────┬───────────┐    │
│  │  CUSTOMER DETAILS       │  ORDER    │    │
│  │                         │  SUMMARY  │    │
│  │  Full Name  [________] │           │    │
│  │  Email      [________] │  item×2   │    │
│  │  Phone      [________] │  item×1   │    │
│  │                         │  ─────── │    │
│  │  ── Fulfilment ──────  │  Sub: LKR │    │
│  │  ( ) Delivery          │  Del: LKR │    │
│  │  ( ) Pickup            │  ─────── │    │
│  │                         │  Total:  │    │
│  │  ── Delivery Address ─ │  LKR     │    │
│  │  (shown if delivery)   │           │    │
│  │  Address Line 1        │           │    │
│  │  Address Line 2        │           │    │
│  │  City                  │           │    │
│  │  District              │           │    │
│  │  Postal Code           │           │    │
│  │                         │           │    │
│  │  ── Notes ────────────  │           │    │
│  │  [textarea]             │           │    │
│  │                         │           │    │
│  │  [Place Order (COD)]   │           │    │
│  └─────────────────────────┴───────────┘    │
│  </form>                                    │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

### 3.6 Order Confirmation Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  ✓ (success icon, animate-scale-in)         │
│                                             │
│  "Thank You!"  (4xl heading)                │
│  "Your order has been placed successfully"  │
│                                             │
│  ┌────────────────────────────────────┐      │
│  │  Order Ref: CH-M3K2J1-A4BF        │      │
│  │  Payment: Cash on Delivery        │      │
│  │  Fulfilment: Delivery             │      │
│  │                                    │      │
│  │  ── Items ────────────────────    │      │
│  │  Chocolate Cake x2    LKR 5,000  │      │
│  │  Cupcake Box x1       LKR 1,500  │      │
│  │  ────────────────────────────     │      │
│  │  Subtotal:            LKR 6,500  │      │
│  │  Delivery:            LKR 350    │      │
│  │  Total:               LKR 6,850  │      │
│  │                                    │      │
│  │  ── Delivery Details ───────────  │      │
│  │  Name, Address, Phone             │      │
│  └────────────────────────────────────┘      │
│                                             │
│  [Continue Shopping]                         │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

### 3.7 About Us Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║  HERO — Full-width bakery image       ║  │
│  ║  Gradient overlay (brand-black/50)    ║  │
│  ║                                       ║  │
│  ║  "Our Story"     (5xl, heading, white)║  │
│  ║  "Handcrafted with love in Sri Lanka" ║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  ── Brand Story (2-col) ───────────────────  │
│  ┌──────────────────┬──────────────────┐    │
│  │                  │                  │    │
│  │  "Who We Are"    │   BAKERY IMAGE   │    │
│  │  (3xl heading)   │   (rounded-2xl)  │    │
│  │                  │                  │    │
│  │  Paragraph 1:    │                  │    │
│  │  Origin story,   │                  │    │
│  │  passion, roots  │                  │    │
│  │                  │                  │    │
│  │  Paragraph 2:    │                  │    │
│  │  Quality,        │                  │    │
│  │  craftsmanship   │                  │    │
│  │                  │                  │    │
│  └──────────────────┴──────────────────┘    │
│                                             │
│  ── Our Values (3-col grid) ───────────────  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  🎂 icon │ │  🌿 icon │ │  💛 icon │    │
│  │  bg-cream│ │  bg-cream│ │  bg-cream│    │
│  │          │ │          │ │          │    │
│  │  Freshly │ │  Quality │ │  Made    │    │
│  │  Made    │ │  Ingred. │ │  w/ Love │    │
│  │          │ │          │ │          │    │
│  │  Desc... │ │  Desc... │ │  Desc... │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  (bg-brand-white, rounded-xl, card-hover)   │
│                                             │
│  ── Why Choose Us (alternating rows) ──────  │
│  ┌──────────────────┬──────────────────┐    │
│  │   IMAGE          │  "Custom Cakes   │    │
│  │   (rounded-2xl)  │   for Every      │    │
│  │                  │   Occasion"      │    │
│  │                  │   Description... │    │
│  └──────────────────┴──────────────────┘    │
│  ┌──────────────────┬──────────────────┐    │
│  │  "Island-Wide    │   IMAGE          │    │
│  │   Delivery"      │   (rounded-2xl)  │    │
│  │   Description... │                  │    │
│  └──────────────────┴──────────────────┘    │
│                                             │
│  ── CTA Section ───────────────────────────  │
│  bg-brand-cream, text-center, py-16         │
│  "Ready to Order?"  (3xl heading)            │
│  [Shop Now →]  [Contact Us →]                │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Mobile**: All 2-column sections stack to single column. Values grid → 1 column.

### 3.8 Contact Us Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  "Contact Us"  (4xl heading, text-center)   │
│  "We'd love to hear from you"               │
│                                             │
│  ┌──────────────────────┬──────────────┐    │
│  │  CONTACT FORM        │  BUSINESS    │    │
│  │                      │  INFO        │    │
│  │  Full Name           │              │    │
│  │  [________________] │  ── Get in   │    │
│  │                      │  Touch ──    │    │
│  │  Email               │              │    │
│  │  [________________] │  📞 Phone    │    │
│  │                      │  +94 XX XXX  │    │
│  │  Phone (optional)    │              │    │
│  │  [________________] │  📧 Email    │    │
│  │                      │  hi@creamy.  │    │
│  │  Subject             │              │    │
│  │  [▼ General Inquiry] │  📍 Address  │    │
│  │                      │  Colombo, LK │    │
│  │  Message             │              │    │
│  │  [________________] │  🕐 Hours    │    │
│  │  [________________] │  Mon-Sat     │    │
│  │  [________________] │  9am - 6pm   │    │
│  │  [________________] │              │    │
│  │                      │  ── Follow  │    │
│  │  [Send Message]      │  Us ──      │    │
│  │  (btn, bg-brand-     │  TikTok     │    │
│  │   black, full-w)     │  Instagram  │    │
│  │                      │  Facebook   │    │
│  └──────────────────────┴──────────────┘    │
│                                             │
│  ── Map Section (optional) ────────────────  │
│  ┌────────────────────────────────────┐      │
│  │  Google Maps embed or static map  │      │
│  │  (rounded-xl, border)             │      │
│  └────────────────────────────────────┘      │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Layout**: 2-column on desktop (form 60%, info 40%). Single column on mobile
(info moves above or below form). Form card: `bg-brand-white rounded-xl border
border-brand-border p-6`. Info card: same styling.

### 3.9 Checkout Page (Expanded)

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  Breadcrumb: Home > Cart > Checkout         │
│                                             │
│  "Checkout"  (3xl heading)                  │
│                                             │
│  <form action={placeOrder}>                 │
│  ┌───────────────────────────┬─────────┐    │
│  │  FORM (2/3 width)         │ SUMMARY │    │
│  │                           │ (1/3)   │    │
│  │  ── Customer Info ──────  │         │    │
│  │  Full Name                │  ┌───┐  │    │
│  │  [____________________]  │  │img│  │    │
│  │  Email                    │  │   │  │    │
│  │  [____________________]  │  │Cho│  │    │
│  │  Phone (+94...)           │  │col│  │    │
│  │  [____________________]  │  │ x2│  │    │
│  │                           │  │LKR│  │    │
│  │  ── Fulfilment ─────────  │  └───┘  │    │
│  │  (●) Delivery             │         │    │
│  │  ( ) Pickup               │  ┌───┐  │    │
│  │                           │  │img│  │    │
│  │  ── Delivery Address ───  │  │Cup│  │    │
│  │  (visible when delivery)  │  │ x1│  │    │
│  │                           │  │LKR│  │    │
│  │  Address Line 1           │  └───┘  │    │
│  │  [____________________]  │         │    │
│  │  Address Line 2           │  ──────  │    │
│  │  [____________________]  │  Sub:   │    │
│  │  City         District    │  LKR    │    │
│  │  [________]  [▼ Select]  │  6,500  │    │
│  │  Postal Code              │         │    │
│  │  [________]              │  Del:   │    │
│  │                           │  LKR    │    │
│  │  ── Delivery Zone ──────  │  350    │    │
│  │  (●) Colombo   (LKR 350) │  ──────  │    │
│  │  ( ) Suburbs   (LKR 500) │  Total: │    │
│  │  ( ) Outstation(LKR 750) │  LKR    │    │
│  │                           │  6,850  │    │
│  │  ── Order Notes ────────  │         │    │
│  │  [____________________]  │  💰 COD │    │
│  │  [____________________]  │  avail  │    │
│  │                           │         │    │
│  │  ┌─────────────────────┐ │         │    │
│  │  │  Place Order (COD)  │ │         │    │
│  │  │  btn-hover, w-full  │ │         │    │
│  │  └─────────────────────┘ │         │    │
│  └───────────────────────────┴─────────┘    │
│  </form>                                    │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Mobile**: Single column — form fields first, order summary sticks to bottom
or appears below the form before the submit button.

### 3.10 Account — Dashboard Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┬──────────────────────────┐    │
│  │ SIDEBAR  │  CONTENT                 │    │
│  │          │                          │    │
│  │ 👤 Name  │  "Welcome back, {name}"  │    │
│  │ email    │  (2xl heading)           │    │
│  │ ──────── │                          │    │
│  │ 📦 Orders│  ── Quick Stats ──────── │    │
│  │ 👤 Profile│  ┌────┐ ┌────┐ ┌────┐  │    │
│  │ 📍 Addr. │  │ 12 │ │LKR │ │ 3  │  │    │
│  │          │  │Ord.│ │Tot.│ │Pen.│  │    │
│  │ ──────── │  └────┘ └────┘ └────┘  │    │
│  │ [Sign    │  (card-hover)            │    │
│  │  Out]    │                          │    │
│  │          │  ── Recent Orders ────── │    │
│  │          │  ┌─────────────────────┐ │    │
│  │          │  │ CH-M3K2-A4BF       │ │    │
│  │          │  │ Jul 20 · LKR 4,200 │ │    │
│  │          │  │ [Completed] View →  │ │    │
│  │          │  └─────────────────────┘ │    │
│  │          │  ┌─────────────────────┐ │    │
│  │          │  │ CH-N2K5-B3CF       │ │    │
│  │          │  │ Jul 18 · LKR 2,800 │ │    │
│  │          │  │ [Pending]   View →  │ │    │
│  │          │  └─────────────────────┘ │    │
│  │          │                          │    │
│  │          │  [View All Orders →]     │    │
│  └──────────┴──────────────────────────┘    │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

**Mobile**: Sidebar collapses to horizontal tab bar at top:
`[📦 Orders] [👤 Profile] [📍 Addresses]`

### 3.11 Account — Order History Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  [← Back] "My Orders"  (2xl heading)       │
│                                             │
│  ── Status Filters ────────────────────────  │
│  [All] [Pending] [Processing] [Completed]   │
│  (pill tabs, same pattern as admin orders)  │
│                                             │
│  ┌────────────────────────────────────┐      │
│  │ Order #CH-M3K2-A4BF                │      │
│  │ Jul 20, 2025 · 3 items             │      │
│  │ LKR 4,200.00    [Completed ✓]      │      │
│  │                       [View →]     │      │
│  └────────────────────────────────────┘      │
│  ┌────────────────────────────────────┐      │
│  │ Order #CH-N2K5-B3CF                │      │
│  │ Jul 18, 2025 · 1 item              │      │
│  │ LKR 2,800.00    [Pending ⏳]       │      │
│  │                       [View →]     │      │
│  └────────────────────────────────────┘      │
│                                             │
│  ── Empty State ───────────────────────────  │
│  "No orders yet"                             │
│  [Start Shopping →]                          │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

### 3.12 Account — Order Detail Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  [← My Orders]                              │
│  "Order #CH-M3K2-A4BF"  (2xl heading)      │
│  Placed: Jul 20, 2025                       │
│                                             │
│  ── Status Timeline ───────────────────────  │
│  ●───●───●───○───○                           │
│  Pen  Con  Pro  Dis  Com                     │
│  Jul  Jul  Jul                               │
│  20   20   21                                │
│  (active step filled, future steps empty)    │
│                                             │
│  ┌──────────────────┬──────────────────┐    │
│  │  ORDER ITEMS     │  ORDER DETAILS   │    │
│  │                  │                  │    │
│  │  ┌──────────┐   │  Payment:        │    │
│  │  │img │ Choc │   │  Cash on Deliv.  │    │
│  │  │    │ Cake │   │                  │    │
│  │  │    │ x2   │   │  Fulfilment:     │    │
│  │  │    │ LKR  │   │  Delivery        │    │
│  │  └──────────┘   │                  │    │
│  │                  │  ── Address ──   │    │
│  │  ┌──────────┐   │  123 Main St     │    │
│  │  │img │ Cupc │   │  Colombo 03      │    │
│  │  │    │ Box  │   │  Western         │    │
│  │  │    │ x1   │   │                  │    │
│  │  └──────────┘   │  ── Summary ──   │    │
│  │                  │  Sub:  LKR 6,500 │    │
│  │                  │  Del:  LKR 350   │    │
│  │                  │  ──────────────  │    │
│  │                  │  Total: LKR 6,850│    │
│  └──────────────────┴──────────────────┘    │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

### 3.13 Account — Profile Page

```
┌─────────────────────────────────────────────┐
│  HEADER                                     │
├─────────────────────────────────────────────┤
│  "My Profile"  (2xl heading)               │
│                                             │
│  ┌────────────────────────────────────┐      │
│  │  bg-brand-white, rounded-xl, p-6  │      │
│  │                                    │      │
│  │  <form action={updateProfile}>     │      │
│  │                                    │      │
│  │  Full Name                         │      │
│  │  [____________________]           │      │
│  │                                    │      │
│  │  Email (read-only)                 │      │
│  │  [user@email.com_______] (disabled)│      │
│  │                                    │      │
│  │  Phone                             │      │
│  │  [+94 XX XXX XXXX_____]           │      │
│  │                                    │      │
│  │  [Save Changes]                    │      │
│  │  (btn-hover, bg-brand-black)      │      │
│  │                                    │      │
│  └────────────────────────────────────┘      │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

### 3.14 Customer Login Page

```
┌─────────────────────────────────────────────┐
│  HEADER (storefront header)                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────┐            │
│  │  max-w-md mx-auto            │            │
│  │  bg-brand-white rounded-xl   │            │
│  │  border p-8                  │            │
│  │                              │            │
│  │  "Sign In" (2xl heading)     │            │
│  │  "to your Creamy Heaven      │            │
│  │   account"                   │            │
│  │                              │            │
│  │  Email                       │            │
│  │  [____________________]     │            │
│  │                              │            │
│  │  Password                    │            │
│  │  [____________________]     │            │
│  │                              │            │
│  │  [Sign In]                   │            │
│  │  (btn, bg-brand-black, w-f) │            │
│  │                              │            │
│  │  ─── or ───                  │            │
│  │                              │            │
│  │  [🔵 Continue with Google]   │            │
│  │  (btn, border, w-full)      │            │
│  │                              │            │
│  │  Don't have an account?      │            │
│  │  [Create Account →]          │            │
│  │                              │            │
│  └──────────────────────────────┘            │
│                                             │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
└─────────────────────────────────────────────┘
```

---

## 4. Component Anatomy

### Product Card (Server Component)
```
┌────────────────────────┐
│  ┌──────────────────┐  │
│  │                  │  │  aspect-square
│  │   PRODUCT IMAGE  │  │  overflow-hidden rounded-xl
│  │   (hover:scale)  │  │  bg-brand-cream (placeholder)
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  CATEGORY              │  text-xs text-brand-muted uppercase
│  Product Name          │  font-heading text-lg font-semibold
│  LKR 2,500.00         │  font-body tabular-nums font-semibold
│                        │
│  [OUT OF STOCK badge]  │  (only if out_of_stock)
└────────────────────────┘
```

### Header (Server Component)
```
┌─────────────────────────────────────────────────────┐
│ ☰  Creamy Heaven        Home Shop About  🛒 (3)    │
│ (mobile)  (font-heading)  (nav links)   (cart icon) │
└─────────────────────────────────────────────────────┘
```
- Sticky, `bg-brand-white/90 backdrop-blur-md`
- Logo: `font-heading text-2xl font-bold`
- Nav: hidden on mobile, `hidden md:flex`
- Cart: icon with count badge, `bg-brand-black text-brand-white rounded-full`
- Mobile: hamburger → CSS-only checkbox toggle (same pattern as admin sidebar)

### Footer (Server Component)
```
┌──────────────────────────────────────────────────────┐
│  bg-brand-black text-brand-white                     │
│                                                      │
│  Creamy Heaven    Quick Links     Follow Us           │
│  (logo)          Home             TikTok              │
│  Tagline text    Shop             Instagram           │
│                  About            Facebook             │
│                  Contact                               │
│                  FAQs                                  │
│                  Delivery Policy                       │
│                                                      │
│  ─────────────────────────────────────────────────   │
│  © 2025 Creamy Heaven. All rights reserved.          │
└──────────────────────────────────────────────────────┘
```

---

## 5. Storefront Image Guidelines

- **Product images**: Cloudinary-hosted, 1200×1200 max, `crop: limit`, `quality: auto`,
  `format: auto`. Display with `object-cover` in cards, `object-contain` or `object-cover`
  in product detail main image.
- **Hero image**: Full-width, Cloudinary-hosted, overlaid with a gradient
  `linear-gradient(to bottom, transparent, rgb(21 18 16 / 0.6))`.
- **Placeholder**: When no image exists, show a `bg-brand-cream` div with "No image" text
  or a subtle bakery icon. Never show a broken image icon.
- **Lazy loading**: Use `loading="lazy"` on all images except above-the-fold hero and first
  row of product cards.

---

## 6. Accessibility Notes

- All interactive elements must have visible focus styles (Tailwind `focus-visible:ring-2`).
- Images must have descriptive `alt` text (product name).
- Form labels must be associated with inputs via `htmlFor`/`id`.
- Color contrast: brand-black on brand-cream and brand-white meets WCAG AA.
- FAQ accordions use native `<details>`/`<summary>` for keyboard accessibility.
- Cart quantity controls must have `aria-label` attributes.
