'use server'

import { adminDb } from '@/lib/firebase-admin'

export async function createCustomerRecord(uid: string, data: { name: string, email: string }) {
  await adminDb.collection('customers').doc(uid).set({
    name: data.name,
    email: data.email,
    orderCount: 0,
    totalSpent: 0,
    isRepeat: false,
    createdAt: new Date(),
  }, { merge: true })
}
