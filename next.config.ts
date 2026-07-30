import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Performance ─────────────────────────────────────────────── */

  // Keep firebase-admin out of the server bundle — its native dependencies
  // dramatically slow down cold-starts when bundled by webpack/turbopack.
  serverExternalPackages: ['firebase-admin'],

  // Allow Next.js <Image> optimisation for external image domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // Log data-cache hits/misses in dev for performance debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
