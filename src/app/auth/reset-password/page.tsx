'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

function ResetPasswordContent() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(true)
    } catch (error) {
      setError('אירעה שגיאה בשליחת הוראות איפוס הסיסמה.')
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
            איפוס סיסמה
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            הזן את כתובת האימייל שלך ונשלח לך הוראות לאיפוס הסיסמה.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
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
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 text-right">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 text-right">
              נשלחו הוראות איפוס סיסמה לכתובת האימייל שלך.
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'שולח...' : 'שלח הוראות איפוס'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            חזרה להתחברות
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Suspense fallback={
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              טוען...
            </h2>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  )
} 