import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

// Load .env.local
dotenv.config({ path: '.env.local' })

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('❌ Missing Firebase Admin credentials in .env.local')
  process.exit(1)
}

const app = getApps().length === 0 ? initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
}) : getApps()[0]

const auth = getAuth(app)
const db = getFirestore(app)

async function makeSuperAdmin(email: string) {
  try {
    // 1. Get the user by email
    const userRecord = await auth.getUserByEmail(email)
    const uid = userRecord.uid

    console.log(`Found user ${email} with UID: ${uid}`)

    // 2. Set Custom Claim
    await auth.setCustomUserClaims(uid, { role: 'superadmin' })
    console.log(`✅ Set custom claim 'role: superadmin' for ${email}`)

    // 3. Create Firestore Document
    await db.collection('users').doc(uid).set({
      uid,
      email,
      displayName: userRecord.displayName || 'Admin User',
      role: 'superadmin',
      isActive: true,
      createdAt: new Date(),
    }, { merge: true })
    
    console.log(`✅ Created/Updated Firestore document in 'users' collection.`)
    console.log(`\n🎉 Success! You can now log into the admin panel as a superadmin.`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Get email from command line args
const email = process.argv[2]
if (!email) {
  console.error('Please provide an email address. Usage: npx tsx make-admin.ts <your-email>')
  process.exit(1)
}

makeSuperAdmin(email)
