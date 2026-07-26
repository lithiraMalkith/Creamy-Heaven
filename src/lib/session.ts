import { cache } from 'react'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'
import type { SessionData } from '@/types'

/**
 * Reads and verifies the Firebase session cookie.
 * Returns session data or null if not authenticated.
 * Call this in Server Components and Server Actions.
 * Wrapped in React cache to deduplicate calls within a single request context.
 */
export const getSession = cache(async (): Promise<SessionData | null> => {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value

  if (!sessionCookie) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, false)
    return {
      uid: decoded.uid,
      email: decoded.email ?? '',
      role: (decoded.role as string) ?? 'support',
    }
  } catch {
    return null
  }
})

