import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchUser } from '@/lib/data/users'
import { fetchRoles } from '@/lib/data/roles'
import { formatDate, formatDateLong } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'
import { updateUserRole, deactivateUser } from '../actions'

export default async function ViewUserPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('users:read')
  const { id } = await params
  const { flash } = await searchParams
  const user = await fetchUser(id)
  if (!user) notFound()

  const customRoles = await fetchRoles()
  const builtInRoles = ['superadmin', 'manager', 'fulfillment', 'support']
  const allRoles = [...builtInRoles, ...customRoles.map((r) => r.name)]

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />

      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">{user.displayName}</h1>
          <p className="text-brand-muted text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-brand-white rounded-xl border border-brand-border p-6 card-hover">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Profile</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-brand-muted">Email</span><span className="text-brand-black">{user.email}</span></div>
            <div className="flex justify-between"><span className="text-brand-muted">Role</span><span className="capitalize text-brand-black font-medium">{user.role}</span></div>
            <div className="flex justify-between"><span className="text-brand-muted">Status</span>
              <span className={user.isActive ? 'text-brand-success font-medium' : 'text-brand-danger font-medium'}>{user.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex justify-between"><span className="text-brand-muted">Joined</span><span className="tabular-nums">{formatDateLong(user.createdAt)}</span></div>
            <div className="flex justify-between"><span className="text-brand-muted">Last Login</span><span className="tabular-nums">{formatDate(user.lastLoginAt)}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          {/* Change Role */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Change Role</h2>
            <form action={updateUserRole} className="space-y-3">
              <input type="hidden" name="uid" value={user.uid} />
              <select name="role" defaultValue={user.role} className="form-select">
                {allRoles.map((role) => (
                  <option key={role} value={role} className="capitalize">{role}</option>
                ))}
              </select>
              <button type="submit" className="btn-hover w-full px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium">Update Role</button>
            </form>
          </div>

          {/* Activate/Deactivate */}
          <div className="bg-brand-white rounded-xl border border-brand-border p-6">
            <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
              {user.isActive ? 'Deactivate User' : 'Activate User'}
            </h2>
            <p className="text-xs text-brand-muted mb-3">
              {user.isActive ? 'This will prevent the user from logging in.' : 'This will allow the user to log in again.'}
            </p>
            <form action={deactivateUser}>
              <input type="hidden" name="uid" value={user.uid} />
              <input type="hidden" name="isActive" value={user.isActive ? 'false' : 'true'} />
              <button type="submit" className={`btn-hover w-full px-4 py-2 rounded-lg text-sm font-medium ${
                user.isActive
                  ? 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20 hover:bg-brand-danger/20'
                  : 'bg-brand-success/10 text-brand-success border border-brand-success/20 hover:bg-brand-success/20'
              }`}>
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
