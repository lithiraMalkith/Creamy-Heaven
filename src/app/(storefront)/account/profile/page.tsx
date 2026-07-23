import { requireCustomerAuth } from '@/lib/customer-session'
import { adminDb } from '@/lib/firebase-admin'
import { ScrollReveal } from '@/components/storefront/scroll-reveal'
import { revalidatePath } from 'next/cache'

export const metadata = {
  title: 'My Profile - Creamy Heaven',
}

async function updateProfileAction(formData: FormData) {
  'use server'
  const session = await requireCustomerAuth()
  
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  // We could save this to a 'customers' collection in firestore
  const customerRef = adminDb.collection('customers').doc(session.uid)
  
  await customerRef.set({
    name,
    phone,
    address,
    email: session.email,
    updatedAt: new Date(),
  }, { merge: true })

  revalidatePath('/account/profile')
}

export default async function AccountProfilePage() {
  const session = await requireCustomerAuth()
  
  // Fetch extra details if stored
  const doc = await adminDb.collection('customers').doc(session.uid).get()
  const customerData = doc.exists ? doc.data() : {}

  return (
    <ScrollReveal direction="up" className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-brand-black mb-2">My Profile</h1>
        <p className="font-body-lead text-body-lead text-brand-muted">Update your personal information.</p>
      </div>

      <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-8">
        <form action={updateProfileAction} className="space-y-6">
          <div>
            <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Email Address</label>
            <input 
              type="email" 
              defaultValue={session.email} 
              disabled 
              className="w-full px-4 py-3 bg-surface-container border border-brand-border rounded-lg font-body-md text-body-md text-brand-muted cursor-not-allowed" 
            />
            <p className="mt-2 text-xs text-brand-muted">Email address cannot be changed.</p>
          </div>
          
          <div>
            <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Full Name</label>
            <input 
              name="name" 
              type="text" 
              defaultValue={customerData?.name || session.name || ''} 
              required
              className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" 
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Phone Number</label>
            <input 
              name="phone" 
              type="tel" 
              defaultValue={customerData?.phone || ''} 
              className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" 
              placeholder="+94 77 123 4567"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Delivery Address</label>
            <textarea 
              name="address" 
              rows={3}
              defaultValue={customerData?.address || ''} 
              className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-colors" 
              placeholder="123 Main St, Colombo 05"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-brand-border">
            <button 
              type="submit"
              className="px-8 py-3 rounded-lg bg-brand-black text-on-primary font-label-md text-label-md hover:bg-surface-tint transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </ScrollReveal>
  )
}
