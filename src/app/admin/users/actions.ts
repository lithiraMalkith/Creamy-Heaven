'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb, adminAuth } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'

export async function inviteUser(formData: FormData) {
  await requirePermission('users:write')

  const email = formData.get('email') as string
  const displayName = formData.get('displayName') as string
  const role = formData.get('role') as string

  if (!email || !displayName || !role) {
    redirect('/admin/users/invite?flash=error:All fields are required')
  }

  let errorMsg = ''
  try {
    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      displayName,
      password: Math.random().toString(36).substring(2, 14), // temporary password
    })

    // Set custom claims
    await adminAuth.setCustomUserClaims(userRecord.uid, { role })

    // Create Firestore user profile
    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      role,
      isActive: true,
      createdAt: new Date(),
    })
  } catch (error) {
    errorMsg = encodeURIComponent(error instanceof Error ? error.message : 'Failed to create user')
  }

  if (errorMsg) {
    redirect(`/admin/users/invite?flash=error:${errorMsg}`)
  }

  revalidatePath('/admin/users')
  redirect('/admin/users?flash=success:User invited successfully. They should reset their password.')
}

export async function updateUserRole(formData: FormData) {
  await requirePermission('users:write')

  const uid = formData.get('uid') as string
  const role = formData.get('role') as string

  if (!uid || !role) {
    redirect('/admin/users?flash=error:Missing required fields')
  }

  await adminAuth.setCustomUserClaims(uid, { role })
  await adminDb.collection('users').doc(uid).update({ role })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${uid}`)
  redirect(`/admin/users/${uid}?flash=success:Role updated`)
}

export async function deactivateUser(formData: FormData) {
  await requirePermission('users:write')

  const uid = formData.get('uid') as string
  const isActive = formData.get('isActive') === 'true'

  if (!uid) {
    redirect('/admin/users?flash=error:Missing user ID')
  }

  await adminAuth.updateUser(uid, { disabled: !isActive })
  await adminDb.collection('users').doc(uid).update({ isActive })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${uid}`)
  redirect(`/admin/users/${uid}?flash=success:User ${isActive ? 'activated' : 'deactivated'}`)
}
