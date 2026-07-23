import { requirePermission } from '@/lib/auth-guard'
import { fetchRoles } from '@/lib/data/roles'
import { inviteUser } from '../actions'
import { parseFlash } from '@/lib/utils'

export default async function InviteUserPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('users:write')
  const { flash } = await searchParams
  const customRoles = await fetchRoles()

  const builtInRoles = ['superadmin', 'manager', 'fulfillment', 'support']
  const allRoles = [...builtInRoles, ...customRoles.map((r) => r.name)]
  
  const flashData = parseFlash(flash)

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-brand-black">Invite Admin User</h1>
      
      {flashData && (
        <div className={`p-4 rounded-lg text-sm font-medium border ${
          flashData.type === 'success' 
            ? 'bg-brand-success/10 text-brand-success border-brand-success/20' 
            : flashData.type === 'error'
              ? 'bg-brand-danger/10 text-brand-danger border-brand-danger/20'
              : 'bg-brand-cream text-brand-black border-brand-border'
        }`}>
          {flashData.message}
        </div>
      )}

      <form action={inviteUser} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Email *</label>
          <input name="email" type="email" required className="form-input" placeholder="user@creamyheaven.lk" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Display Name *</label>
          <input name="displayName" required className="form-input" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Role *</label>
          <select name="role" required className="form-select">
            <option value="">Select role</option>
            {allRoles.map((role) => (
              <option key={role} value={role} className="capitalize">{role}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-brand-muted">A temporary password will be generated. The user should reset it on first login.</p>
        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">Send Invite</button>
          <a href="/admin/users" className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">Cancel</a>
        </div>
      </form>
    </div>
  )
}
