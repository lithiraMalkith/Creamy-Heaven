import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchRole } from '@/lib/data/roles'
import { PERMISSION_GROUPS } from '@/lib/permissions'
import { FlashMessage } from '@/components/flash-message'

export default async function ViewRolePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('roles:read')
  const { id } = await params
  const { flash } = await searchParams
  const role = await fetchRole(id)
  if (!role) notFound()

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6 pb-20">
      <FlashMessage value={flash} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/roles" className="btn-hover p-2 rounded-lg text-brand-muted hover:text-brand-black hover:bg-brand-cream"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">{role.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/roles/${id}/edit`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-white border border-brand-border rounded-lg text-sm"><Edit2 className="w-4 h-4" /> Edit</Link>
          <Link href={`/admin/roles/${id}/delete`} className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-sm text-brand-danger"><Trash2 className="w-4 h-4" /> Delete</Link>
        </div>
      </div>

      <div className="bg-brand-white rounded-xl border border-brand-border p-6">
        <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Permissions ({role.permissions.length})</h2>
        <div className="space-y-4">
          {PERMISSION_GROUPS.map((group) => {
            const granted = group.permissions.filter((p) => role.permissions.includes(p.key))
            if (granted.length === 0) return null
            return (
              <div key={group.label}>
                <p className="text-sm font-medium text-brand-black mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {granted.map((p) => (
                    <span key={p.key} className="px-2.5 py-1 rounded-full bg-brand-cream text-brand-black-soft text-xs font-medium">{p.label}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
