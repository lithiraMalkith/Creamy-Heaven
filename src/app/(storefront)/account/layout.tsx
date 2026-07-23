import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { requireCustomerAuth } from '@/lib/customer-session'

async function customerSignOut() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.set('customer-session', '', { maxAge: 0, path: '/' })
  redirect('/customer-login')
}

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await requireCustomerAuth().catch(() => null)
  
  if (!session) {
    redirect('/customer-login')
  }

  return (
    <div className="max-w-max-width-content mx-auto px-margin-site-mobile md:px-margin-site pt-12 pb-section-v-space w-full">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Nav */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-surface-container-lowest border border-brand-border rounded-xl p-6 sticky top-[100px]">
            <h2 className="font-headline-sm text-headline-sm text-brand-black mb-6">My Account</h2>
            
            <nav className="flex flex-col gap-2">
              <Link href="/account" className="px-4 py-3 rounded-lg text-brand-black hover:bg-surface-container transition-colors font-label-md text-label-md flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Dashboard
              </Link>
              <Link href="/account/orders" className="px-4 py-3 rounded-lg text-brand-black hover:bg-surface-container transition-colors font-label-md text-label-md flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                Orders
              </Link>
              <Link href="/account/profile" className="px-4 py-3 rounded-lg text-brand-black hover:bg-surface-container transition-colors font-label-md text-label-md flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">person</span>
                Profile
              </Link>
            </nav>
            
            <hr className="border-brand-border my-6" />
            
            <form action={customerSignOut}>
              <button className="w-full px-4 py-3 rounded-lg text-brand-danger hover:bg-error-container transition-colors font-label-md text-label-md flex items-center gap-3 text-left">
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          {children}
        </div>

      </div>
    </div>
  )
}
