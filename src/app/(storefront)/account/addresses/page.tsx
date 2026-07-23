import { ScrollReveal } from '@/components/storefront/scroll-reveal'

export const metadata = {
  title: 'My Addresses - Creamy Heaven',
}

export default function AccountAddressesPage() {
  return (
    <ScrollReveal direction="up" className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">Saved Addresses</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">Manage your delivery locations.</p>
      </div>

      <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px] text-brand-muted">location_on</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-brand-black mb-2">No addresses saved yet</h3>
        <p className="font-body-md text-body-md text-brand-muted mb-6">Addresses used during checkout will appear here.</p>
        <button disabled className="px-6 py-3 rounded-full border border-brand-border text-brand-muted font-label-md text-label-md cursor-not-allowed">
          Add New Address
        </button>
      </div>
    </ScrollReveal>
  )
}
