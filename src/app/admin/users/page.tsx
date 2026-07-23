import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { requirePermission } from '@/lib/auth-guard'
import { fetchUsers } from '@/lib/data/users'
import { formatDate } from '@/lib/utils'
import { FlashMessage } from '@/components/flash-message'

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
  await requirePermission('users:read')
  const { flash } = await searchParams
  const users = await fetchUsers()

  return (
    <div className="space-y-6">
      <FlashMessage value={flash} />

      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-black">Admin Users</h1>
          <p className="text-brand-muted text-sm mt-1">{users.length} users</p>
        </div>
        <Link href="/admin/users/invite" className="btn-hover flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-lg text-sm font-medium">
          <UserPlus className="w-4 h-4" /> Invite User
        </Link>
      </div>

      <div className="bg-brand-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last Login</th><th>Joined</th><th className="w-12"></th></tr></thead>
            <tbody className="animate-in-stagger">
              {users.map((user) => (
                <tr key={user.uid} className="row-hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center text-sm font-semibold text-brand-black">
                        {user.displayName?.charAt(0)?.toUpperCase() ?? user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-brand-black">{user.displayName}</p>
                        <p className="text-xs text-brand-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="px-2 py-0.5 rounded-full bg-brand-cream text-brand-black-soft text-xs font-medium capitalize">{user.role}</span></td>
                  <td>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.isActive ? 'text-brand-success' : 'text-brand-danger'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-brand-success' : 'bg-brand-danger'}`} />
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-sm text-brand-muted tabular-nums">{formatDate(user.lastLoginAt)}</td>
                  <td className="text-sm text-brand-muted tabular-nums">{formatDate(user.createdAt)}</td>
                  <td>
                    <Link href={`/admin/users/${user.uid}`} className="text-sm text-brand-muted hover:text-brand-black">View</Link>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={6} className="text-center py-12"><p className="text-brand-muted text-sm">No users found</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
