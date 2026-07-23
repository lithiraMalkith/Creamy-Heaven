'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'

export async function updateMessageStatus(formData: FormData) {
  await requirePermission('messages:write')

  const messageId = formData.get('messageId') as string
  const status = formData.get('status') as string

  if (!messageId || !status) {
    redirect('/admin/messages?flash=error:Missing required fields')
  }

  const updateData: Record<string, unknown> = { status }
  if (status === 'replied') {
    updateData.repliedAt = new Date()
  }

  await adminDb.collection('messages').doc(messageId).update(updateData)

  revalidatePath('/admin/messages')
  revalidatePath(`/admin/messages/${messageId}`)
  redirect(`/admin/messages/${messageId}?flash=success:Message marked as ${status}`)
}

export async function deleteMessage(id: string) {
  await requirePermission('messages:delete')

  const doc = await adminDb.collection('messages').doc(id).get()
  if (!doc.exists) redirect('/admin/messages?flash=error:Message not found')

  await adminDb.collection('messages').doc(id).delete()

  revalidatePath('/admin/messages')
  redirect('/admin/messages?flash=success:Message deleted')
}
