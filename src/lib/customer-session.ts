import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'

const CUSTOMER_SESSION_COOKIE = 'customer-session'

export interface CustomerSession {
  uid: string
  email?: string
  name?: string
  role?: string
}

/**
 * Verify the Firebase session cookie for customers
 */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    
    // Additional check: Ensure it's a customer. Admin users might have role claim
    // but we can allow them to shop too. Just ensuring token is valid.
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      name: decodedClaims.name,
      role: (decodedClaims as any).role,
    }
  } catch (error) {
    console.error('Error verifying customer session cookie', error)
    return null
  }
}

export async function requireCustomerAuth() {
  const session = await getCustomerSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
