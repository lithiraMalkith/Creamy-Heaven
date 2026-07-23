'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCustomerRecord } from './actions'

export default function CustomerSignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSession = async (idToken: string) => {
    const res = await fetch('/api/auth/customer-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    
    if (res.ok) {
      router.push('/account')
      router.refresh()
    } else {
      throw new Error('Failed to create session')
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      })

      // Initialize customer record in Firestore via Server Action
      await createCustomerRecord(userCredential.user.uid, {
        name,
        email,
      })

      const idToken = await userCredential.user.getIdToken()
      await handleSession(idToken)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create account.')
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)
    const provider = new GoogleAuthProvider()
    
    try {
      const userCredential = await signInWithPopup(auth, provider)
      
      // Initialize customer record in Firestore (merge: true handles if it already exists)
      await createCustomerRecord(userCredential.user.uid, {
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email || '',
      })

      const idToken = await userCredential.user.getIdToken()
      await handleSession(idToken)
    } catch (err: any) {
      console.error(err)
      setError('Google sign-up failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-brand-border rounded-2xl p-8 shadow-[0_10px_30px_rgba(21,18,16,0.05)]">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-headline-md text-headline-md text-brand-black font-bold mb-2 hover:scale-105 transition-transform">
            Creamy Heaven
          </Link>
          <h1 className="font-headline-sm text-headline-sm text-brand-black">Create Account</h1>
          <p className="font-body-md text-body-md text-brand-muted mt-2">Join us for delicious moments</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-label-md text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex justify-center items-center gap-3 bg-surface-container-lowest border border-brand-border text-brand-black py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors mb-6 disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-brand-border"></div>
          <span className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider">Or</span>
          <div className="flex-1 h-px bg-brand-border"></div>
        </div>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors"
              required
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors"
              required
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-brand-muted mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors"
              required
              minLength={6}
            />
            <p className="text-xs text-brand-muted mt-2">Must be at least 6 characters.</p>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-brand-black text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-all disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center font-body-md text-body-md text-brand-muted">
          Already have an account?{' '}
          <Link href="/customer-login" className="text-brand-black font-semibold hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  )
}
