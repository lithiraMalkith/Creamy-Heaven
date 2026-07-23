'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { requirePermission } from '@/lib/auth-guard'
import type { Customer, VerificationStatus } from '@/types'

export async function createCustomer(formData: FormData) {
  await requirePermission('customers:write')

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const verificationStatus = formData.get('verificationStatus') as VerificationStatus | null

  if (!name || !email || !phone) {
    redirect('/admin/customers/new?flash=error:Missing required fields')
  }

  // Check if email already exists
  const snapshot = await adminDb.collection('customers').where('email', '==', email).get()
  if (!snapshot.empty) {
    redirect('/admin/customers/new?flash=error:Customer with this email already exists')
  }

  const newCustomerData = {
    name,
    email,
    phone,
    verificationStatus: verificationStatus || 'unverified',
    orderCount: 0,
    totalSpent: 0,
    isRepeat: false,
    createdAt: new Date(),
  }

  await adminDb.collection('customers').add(newCustomerData)

  revalidatePath('/admin/customers')
  redirect('/admin/customers?flash=success:Customer created successfully')
}

export async function updateCustomer(id: string, formData: FormData) {
  await requirePermission('customers:write')

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const verificationStatus = formData.get('verificationStatus') as string

  const updateData: Record<string, unknown> = {}
  if (name) updateData.name = name
  if (phone) updateData.phone = phone
  if (verificationStatus) updateData.verificationStatus = verificationStatus

  await adminDb.collection('customers').doc(id).update(updateData)

  revalidatePath('/admin/customers')
  revalidatePath(`/admin/customers/${id}`)
  redirect(`/admin/customers/${id}?flash=success:Customer updated`)
}

export async function deleteCustomer(id: string) {
  await requirePermission('customers:write')

  const doc = await adminDb.collection('customers').doc(id).get()
  if (!doc.exists) redirect('/admin/customers?flash=error:Customer not found')

  await adminDb.collection('customers').doc(id).delete()

  revalidatePath('/admin/customers')
  redirect('/admin/customers?flash=success:Customer deleted')
}
