import { requirePermission } from '@/lib/auth-guard'
import { PERMISSION_GROUPS } from '@/lib/permissions'
import { createRole } from '../actions'
import { FlashMessage } from '@/components/flash-message'

export default async function NewRolePage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('roles:write')
  const { flash } = await searchParams

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6">
      <FlashMessage value={flash} />
      <h1 className="font-heading text-2xl font-semibold text-brand-black">Create Custom Role</h1>
      <form action={createRole} className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Role Name *</label>
          <input name="name" required className="form-input" placeholder="e.g. Content Editor" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Permissions</h3>
          <div className="space-y-6">
            {PERMISSION_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-sm font-medium text-brand-black mb-2">{group.label}</p>
                <div className="space-y-2 pl-1">
                  {group.permissions.map((perm) => (
                    <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="permissions" value={perm.key} className="w-4 h-4 rounded border-brand-border" />
                      <span className="text-sm text-brand-black-soft">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button type="submit" className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium">Create Role</button>
          <a href="/admin/roles" className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">Cancel</a>
        </div>
      </form>
    </div>
  )
}
