import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initFirebaseAdmin(): App {
  if (getApps().length) {
    return getApps()[0]
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '⚠️  Firebase Admin credentials missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local'
    )
    // Initialize without credentials — pages will error at runtime but build won't crash
    return initializeApp({ projectId: 'demo-creamy-heaven' })
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
}

const app = initFirebaseAdmin()

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
