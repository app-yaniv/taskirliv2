import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/utils/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      // Get auth code from URL
      const code = router.query.code

      if (code) {
        // Try to handle the sign in
        await supabase.auth.exchangeCodeForSession(code as string)
        
        // Redirect to home or intended route
        router.push('/')
      }
    }

    if (router.isReady) {
      handleCallback()
    }
  }, [router.isReady, router.query.code])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-center">Completing sign in...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  )
} 