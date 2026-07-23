import { requirePermission } from '@/lib/auth-guard'
import { fetchSettings } from '@/lib/data/settings'
import { updateSettings } from './actions'
import { FlashMessage } from '@/components/flash-message'

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('settings:read')
  const { flash } = await searchParams
  const settings = await fetchSettings()

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />

      <div>
        <h1 className="font-heading text-2xl font-semibold text-brand-black">Settings</h1>
        <p className="text-brand-muted text-sm mt-1">Manage your site configuration</p>
      </div>

      <form action={updateSettings} className="space-y-6">
        {/* General */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Site Name *</label>
              <input name="siteName" defaultValue={settings.siteName} required className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Owner Email *</label>
              <input name="ownerEmail" type="email" defaultValue={settings.ownerEmail} required className="form-input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Site Description</label>
            <textarea name="siteDescription" defaultValue={settings.siteDescription ?? ''} className="form-textarea" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Owner Phone *</label>
            <input name="ownerPhone" defaultValue={settings.ownerPhone} required className="form-input" placeholder="+94XXXXXXXXX" />
          </div>
        </div>

        {/* Fulfilment */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Fulfilment</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="codEnabled" defaultChecked={settings.codEnabled} className="w-4 h-4 rounded border-brand-border" />
              <span className="text-sm text-brand-black">Enable Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="pickupEnabled" defaultChecked={settings.pickupEnabled} className="w-4 h-4 rounded border-brand-border" />
              <span className="text-sm text-brand-black">Enable Store Pickup</span>
            </label>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Delivery Zones</h2>
          <input type="hidden" name="zoneCount" value={settings.deliveryZones.length} />

          {settings.deliveryZones.length > 0 ? (
            <div className="space-y-3">
              {settings.deliveryZones.map((zone, i) => (
                <div key={zone.id} className="flex items-center gap-3 p-3 rounded-lg bg-brand-cream/50">
                  <input name={`zone_name_${i}`} defaultValue={zone.name} className="form-input flex-1" placeholder="Zone name" />
                  <input name={`zone_fee_${i}`} type="number" min="0" defaultValue={zone.fee} className="form-input w-32" placeholder="Fee" />
                  <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                    <input type="checkbox" name={`zone_active_${i}`} defaultChecked={zone.isActive} className="w-4 h-4 rounded border-brand-border" />
                    Active
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-muted">No delivery zones configured.</p>
          )}

          <div className="pt-4 border-t border-brand-border">
            <p className="text-xs text-brand-muted mb-2">Add new zone:</p>
            <div className="flex items-center gap-3">
              <input name="new_zone_name" className="form-input flex-1" placeholder="Zone name (e.g. Colombo)" />
              <input name="new_zone_fee" type="number" min="0" className="form-input w-32" placeholder="Fee (LKR)" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">TikTok</label>
              <input name="socialTiktok" defaultValue={settings.socialLinks?.tiktok ?? ''} className="form-input" placeholder="@creamyheaven" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Instagram</label>
              <input name="socialInstagram" defaultValue={settings.socialLinks?.instagram ?? ''} className="form-input" placeholder="@creamyheaven" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Facebook</label>
              <input name="socialFacebook" defaultValue={settings.socialLinks?.facebook ?? ''} className="form-input" placeholder="creamyheaven" />
            </div>
          </div>
        </div>

        {/* Tracking Pixels */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Tracking</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">Meta Pixel ID</label>
              <input name="metaPixelId" defaultValue={settings.metaPixelId ?? ''} className="form-input font-body tabular-nums" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">TikTok Pixel ID</label>
              <input name="tiktokPixelId" defaultValue={settings.tiktokPixelId ?? ''} className="form-input font-body tabular-nums" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" className="btn-hover px-8 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
