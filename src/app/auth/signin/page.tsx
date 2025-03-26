'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectedFrom') || '/'

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Redirect to the page the user was trying to access, or the home page
      router.push(redirectTo)
    } catch (error) {
      setError('אירעה שגיאה במהלך ההתחברות.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            התחברות לחשבון שלך
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            או{' '}
            <Link 
              href="/auth/signup" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              צור חשבון חדש
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                כתובת אימייל
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="כתובת אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                סיסמה
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-right">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                href="/auth/reset-password" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                שכחת את הסיסמה?
              </Link>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                זכור אותי
              </label>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  )
} 