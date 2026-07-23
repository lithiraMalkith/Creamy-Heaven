'use server'

import { adminDb } from '@/lib/firebase-admin'

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    throw new Error('Please fill out all required fields.')
  }

  await adminDb.collection('messages').add({
    name,
    email,
    subject: subject || 'General Inquiry',
    body: message,
    status: 'unread',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}
