import { redirect } from 'next/navigation'
import { getSession } from './session'
import { hasPermission } from './permissions'
import type { SessionData } from '@/types'

/**
 * Guard for Server Components and Server Actions.
 * Call at the top of any protected page or action.
 *
 * - If not authenticated → redirect to /adminlogin
 * - If missing permission → redirect to /admin with error flash
 * - Otherwise → returns the session data
 */
export async function requirePermission(permission: string): Promise<SessionData> {
  const session = await getSession()

  if (!session) {
    redirect('/adminlogin')
  }

  if (!hasPermission(session.role, permission)) {
    redirect('/admin?flash=error:Not authorized')
  }

  return session
}

/**
 * Guard that only checks authentication, no specific permission.
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession()

  if (!session) {
    redirect('/adminlogin')
  }

  return session
}
