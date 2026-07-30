import { unstable_cache } from 'next/cache'
import { adminDb } from '@/lib/firebase-admin'
import type { SiteSettings } from '@/types'

const DEFAULT_ANNOUNCEMENTS = [
  { id: '1', text: '🚚 Free Delivery for orders within Colombo area.', enabled: true },
  { id: '2', text: '🎉 Special Discounts on selected artisanal treats.', enabled: true },
  { id: '3', text: '🔥 Limited-Time Offers & seasonal celebration specials.', enabled: true },
  { id: '4', text: '💳 Secure Cash on Delivery (COD) & Express Delivery.', enabled: true },
]

async function _fetchSettings(): Promise<SiteSettings> {
  const doc = await adminDb.collection('settings').doc('site').get()

  if (!doc.exists) {
    // Return sensible defaults when no settings exist yet
    return {
      siteName: 'Creamy Heaven',
      siteDescription: 'Delicious cakes & desserts in Sri Lanka',
      ownerEmail: '',
      ownerPhone: '',
      currency: 'LKR',
      codEnabled: true,
      payhereEnabled: false,
      pickupEnabled: true,
      deliveryZones: [],
      socialLinks: {},
      announcementsEnabled: true,
      announcements: DEFAULT_ANNOUNCEMENTS,
    }
  }

  const data = doc.data() as SiteSettings
  return {
    ...data,
    announcementsEnabled: data.announcementsEnabled ?? true,
    announcements: data.announcements && data.announcements.length > 0 ? data.announcements : DEFAULT_ANNOUNCEMENTS,
  }
}

/**
 * Cached fetchSettings — revalidates every 5 minutes or on-demand via
 * revalidateTag('site-settings'). Settings change at most once a day,
 * so hitting Firestore on every navigation is wasteful.
 */
export const fetchSettings = unstable_cache(
  _fetchSettings,
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 300 }
)
