'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      await handleSession(idToken)
    } catch (err: any) {
      console.error(err)
      setError('Invalid email or password.')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    const provider = new GoogleAuthProvider()
    
    try {
      const userCredential = await signInWithPopup(auth, provider)
      const idToken = await userCredential.user.getIdToken()
      await handleSession(idToken)
    } catch (err: any) {
      console.error(err)
      setError('Google sign-in failed.')
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.')
      return
    }
    setError('')
    setMessage('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent. Please check your inbox.')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to send password reset email.')
    } finally {
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
          <h1 className="font-headline-sm text-headline-sm text-brand-black">Welcome Back</h1>
          <p className="font-body-md text-body-md text-brand-muted mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-label-md text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-brand-success/10 text-brand-success rounded-lg font-label-md text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {message}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center gap-3 bg-surface-container-lowest border border-brand-border text-brand-black py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors mb-6 disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-brand-border"></div>
          <span className="font-label-sm text-label-sm text-brand-muted uppercase tracking-wider">Or</span>
          <div className="flex-1 h-px bg-brand-border"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block font-label-sm text-label-sm text-brand-muted">Password</label>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                disabled={loading}
                className="font-label-sm text-label-sm text-brand-black hover:underline disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-brand-border rounded-lg font-body-md text-body-md focus:outline-none focus:border-brand-black transition-colors"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-brand-black text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-all disabled:opacity-50 hover:scale-[1.02]"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center font-body-md text-body-md text-brand-muted">
          Don't have an account?{' '}
          <Link href="/customer-signup" className="text-brand-black font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}
