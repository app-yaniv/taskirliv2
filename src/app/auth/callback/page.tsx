'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(
        searchParams?.get('code') || ''
      )

      if (error) {
        console.error('Error during auth callback:', error)
        router.push('/auth/signin?error=אירעה שגיאה באימות החשבון')
        return
      }

      // Redirect to the home page after successful authentication
      router.push('/')
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            מאמת את החשבון שלך...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            אנא המתן בזמן שאנו מאמתים את החשבון שלך.
          </p>
        </div>
      </div>
    </div>
  )
} 