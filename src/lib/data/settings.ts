import { adminDb } from '@/lib/firebase-admin'
import type { SiteSettings } from '@/types'

export async function fetchSettings(): Promise<SiteSettings> {
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
    }
  }

  return doc.data() as SiteSettings
}
