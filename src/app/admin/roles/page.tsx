import Link from 'next/link'
import { Plus, Shield } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchRoles } from '@/lib/data/roles'
import { BUILT_IN_ROLE_PERMISSIONS } from '@/lib/permissions'
import { FlashMessage } from '@/components/flash-message'
import type { BuiltInRole } from '@/types'

export default async function RolesPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('roles:read')
  const { flash } = await searchParams
  const customRoles = await fetchRoles()

  const builtInRoles: { name: BuiltInRole; permissionCount: number }[] = [
    { name: 'superadmin', permissionCount: BUILT_IN_ROLE_PERMISSIONS.superadmin.length },
    { name: 'manager', permissionCount: BUILT_IN_ROLE_PERMISSIONS.manager.length },
    { name: 'fulfillment', permissionCount: BUILT_IN_ROLE_PERMISSIONS.fulfillment.length },
    { name: 'support', permissionCount: BUILT_IN_ROLE_PERMISSIONS.support.length },
  ]

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Roles</h1>
          <p className="text-brand-muted text-sm mt-1">{4 + customRoles.length} total</p>
        </div>
        <Link href="/admin/roles/new" className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Role
        </Link>
      </div>

      {/* Built-in roles */}
      <div>
        <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">Built-in Roles</h2>
        <div className="animate-in-stagger grid grid-cols-1 md:grid-cols-2 gap-4">
          {builtInRoles.map((role) => (
            <div key={role.name} className="bg-brand-white rounded-xl border border-brand-border p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-cream"><Shield className="w-5 h-5 text-brand-black" /></div>
                <div>
                  <p className="font-medium text-brand-black capitalize">{role.name}</p>
                  <p className="text-xs text-brand-muted">{role.permissionCount} permissions • Built-in</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom roles */}
      <div>
        <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">Custom Roles</h2>
        {customRoles.length > 0 ? (
          <div className="animate-in-stagger grid grid-cols-1 md:grid-cols-2 gap-4">
            {customRoles.map((role) => (
              <Link key={role.id} href={`/admin/roles/${role.id}`} className="bg-brand-white rounded-xl border border-brand-border p-5 card-hover">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-cream"><Shield className="w-5 h-5 text-brand-black" /></div>
                  <div>
                    <p className="font-medium text-brand-black">{role.name}</p>
                    <p className="text-xs text-brand-muted">{role.permissions.length} permissions • Custom</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-muted py-8 text-center">No custom roles created yet.</p>
        )}
      </div>
    </div>
  )
}
