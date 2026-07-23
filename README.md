<div align="center">
  
  # 🍰 Creamy Heaven
  **Artisanal Cakes & Desserts Platform**

  <p align="center">
    A premium, minimalistic e-commerce storefront and admin dashboard built for an artisanal bakery. Designed with a custom "Cream & Black" aesthetic, fluid motion, and robust server-first architecture.
  </p>
</div>

---

## ✦ The Vision

Creamy Heaven is built on the philosophy that the digital experience should reflect the quality of the product. The interface embraces a minimalistic, luxury aesthetic—utilizing a harmonious blend of warm cream backgrounds (`#F7F1E6`), sharp charcoal blacks (`#151210`), and smooth micro-interactions.

Every scroll, hover, and page transition is choreographed to feel organic, premium, and effortless.

## ✦ Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-151210?style=for-the-badge&logo=next.js&logoColor=F7F1E6" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-151210?style=for-the-badge&logo=react&logoColor=F7F1E6" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-151210?style=for-the-badge&logo=typescript&logoColor=F7F1E6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_v4-151210?style=for-the-badge&logo=tailwindcss&logoColor=F7F1E6" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-151210?style=for-the-badge&logo=greensock&logoColor=F7F1E6" alt="GSAP" />
  <img src="https://img.shields.io/badge/Firebase-151210?style=for-the-badge&logo=firebase&logoColor=F7F1E6" alt="Firebase" />
  <img src="https://img.shields.io/badge/Cloudinary-151210?style=for-the-badge&logo=cloudinary&logoColor=F7F1E6" alt="Cloudinary" />
</p>

This platform leverages a modern, server-first architecture using Next.js, prioritizing performance, SEO, and developer experience.

### Core Framework
- **[Next.js 15+](https://nextjs.org/)** – App Router, React Server Components (RSC), and Server Actions.
- **[React 19](https://react.dev/)** – Latest concurrent features and hooks.
- **[TypeScript](https://www.typescriptlang.org/)** – End-to-end type safety.

### Styling & Motion
- **[Tailwind CSS v4](https://tailwindcss.com/)** – Utility-first styling with a fully customized theme engine.
- **[GSAP](https://gsap.com/)** – High-performance animations and scroll-triggered reveals (`@gsap/react`).
- **[Material Symbols](https://fonts.google.com/icons)** – Clean, variable-font iconography.

### Backend & Infrastructure
- **[Firebase](https://firebase.google.com/)** – Firestore for real-time NoSQL database management.
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** – Secure server-side data operations and session cookie authentication.
- **[Cloudinary](https://cloudinary.com/)** – Optimized image delivery and asset management.
- **[Brevo](https://www.brevo.com/)** – Transactional email delivery system.

### Utility
- **[Zod](https://zod.dev/)** – Schema validation for robust form handling and API safety.
- **[date-fns](https://date-fns.org/)** – Modern JavaScript date utility library.

---

## ✦ Features

### 🛍️ Storefront
- **Immersive Shopping:** Fluid animations, image zoom interactions, and sticky carts.
- **Dynamic Routing:** Next.js dynamic routes for seamless category filtering and product details.
- **Checkout Flow:** Optimized cart management and Cash on Delivery (COD) processing.
- **SEO Optimized:** Server-rendered pages with metadata mapping for high discoverability.

### 🛡️ Admin Panel
- **Role-Based Access:** Secure dashboards utilizing Firebase Auth and session cookies.
- **Inventory Management:** Full CRUD operations for products, categories, and stock monitoring.
- **Order Fulfillment:** Real-time order tracking and status updates.
- **Analytics:** At-a-glance dashboard summarizing revenue, orders, and site health.

---

## ✦ Getting Started

### Prerequisites
Ensure you have the latest version of Node.js installed. You will also need a Firebase project and a Cloudinary account.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd creamy-heaven
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Firebase, Cloudinary, and Brevo credentials. (See `.env.example` if available).

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Explore**
   Navigate to `http://localhost:3000` to view the storefront, and `http://localhost:3000/adminlogin` to access the admin portal.

---

<div align="center">
  <p>Designed and built with precision.</p>
</div>
