'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'
import { siteSettingsSchema } from '@/lib/validations'

export async function updateSettings(formData: FormData) {
  await requirePermission('settings:write')

  const raw = Object.fromEntries(formData)
  const parsed = siteSettingsSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = encodeURIComponent(Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Validation failed')
    redirect(`/admin/settings?flash=error:${msg}`)
  }

  // Parse delivery zones from form
  const zoneCount = Number(formData.get('zoneCount') ?? '0')
  const deliveryZones = []
  for (let i = 0; i < zoneCount; i++) {
    const zoneName = formData.get(`zone_name_${i}`) as string
    const zoneFee = Number(formData.get(`zone_fee_${i}`))
    const zoneActive = formData.get(`zone_active_${i}`) === 'on'
    if (zoneName) {
      deliveryZones.push({
        id: `zone_${i}`,
        name: zoneName,
        fee: zoneFee || 0,
        isActive: zoneActive,
      })
    }
  }

  // Add new zone if provided
  const newZoneName = formData.get('new_zone_name') as string
  const newZoneFee = Number(formData.get('new_zone_fee'))
  if (newZoneName) {
    deliveryZones.push({
      id: `zone_${Date.now()}`,
      name: newZoneName,
      fee: newZoneFee || 0,
      isActive: true,
    })
  }

  await adminDb.collection('settings').doc('site').set({
    siteName: parsed.data.siteName,
    siteDescription: parsed.data.siteDescription ?? '',
    ownerEmail: parsed.data.ownerEmail,
    ownerPhone: parsed.data.ownerPhone,
    currency: 'LKR',
    codEnabled: parsed.data.codEnabled,
    payhereEnabled: false,
    pickupEnabled: parsed.data.pickupEnabled,
    deliveryZones,
    socialLinks: {
      tiktok: parsed.data.socialTiktok ?? '',
      instagram: parsed.data.socialInstagram ?? '',
      facebook: parsed.data.socialFacebook ?? '',
    },
    metaPixelId: parsed.data.metaPixelId ?? '',
    tiktokPixelId: parsed.data.tiktokPixelId ?? '',
  }, { merge: true })

  revalidatePath('/admin/settings')
  redirect('/admin/settings?flash=success:Settings saved')
}
