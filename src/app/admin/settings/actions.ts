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

  // Parse announcements from form
  const announcementCount = Number(formData.get('announcementCount') ?? '0')
  const announcements = []
  for (let i = 0; i < announcementCount; i++) {
    const text = (formData.get(`announcement_text_${i}`) as string)?.trim()
    const enabled = formData.get(`announcement_enabled_${i}`) === 'on'
    const link = (formData.get(`announcement_link_${i}`) as string)?.trim() || ''
    const id = (formData.get(`announcement_id_${i}`) as string) || `ann_${i}`
    if (text) {
      announcements.push({
        id,
        text,
        enabled,
        ...(link ? { link } : {}),
      })
    }
  }

  // Add new announcement if provided
  const newAnnouncementText = (formData.get('new_announcement_text') as string)?.trim()
  const newAnnouncementLink = (formData.get('new_announcement_link') as string)?.trim() || ''
  if (newAnnouncementText) {
    announcements.push({
      id: `ann_${Date.now()}`,
      text: newAnnouncementText,
      enabled: true,
      ...(newAnnouncementLink ? { link: newAnnouncementLink } : {}),
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
    announcementsEnabled: parsed.data.announcementsEnabled ?? false,
    announcements,
  }, { merge: true })

  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout')
  redirect('/admin/settings?flash=success:Settings saved')
}
