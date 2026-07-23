'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'

export async function createRole(formData: FormData) {
  const session = await requirePermission('roles:write')

  const name = formData.get('name') as string
  const permissions = formData.getAll('permissions') as string[]

  if (!name || permissions.length === 0) {
    redirect('/admin/roles/new?flash=error:Name and at least one permission are required')
  }

  const now = new Date()
  await adminDb.collection('roles').add({
    name,
    permissions,
    createdBy: session.uid,
    createdAt: now,
    isCustom: true,
  })

  revalidatePath('/admin/roles')
  redirect('/admin/roles?flash=success:Role created')
}

export async function updateRole(id: string, formData: FormData) {
  await requirePermission('roles:write')

  const name = formData.get('name') as string
  const permissions = formData.getAll('permissions') as string[]

  if (!name || permissions.length === 0) {
    redirect(`/admin/roles/${id}/edit?flash=error:Name and at least one permission are required`)
  }

  await adminDb.collection('roles').doc(id).update({
    name,
    permissions,
  })

  revalidatePath('/admin/roles')
  revalidatePath(`/admin/roles/${id}`)
  redirect(`/admin/roles/${id}?flash=success:Role updated`)
}

export async function deleteRole(id: string) {
  await requirePermission('roles:delete')

  const doc = await adminDb.collection('roles').doc(id).get()
  if (!doc.exists) redirect('/admin/roles?flash=error:Role not found')

  await adminDb.collection('roles').doc(id).delete()

  revalidatePath('/admin/roles')
  redirect('/admin/roles?flash=success:Role deleted')
}
