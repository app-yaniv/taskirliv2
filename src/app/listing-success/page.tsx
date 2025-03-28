'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ListingSuccessPage() {
  const router = useRouter()

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            הפריט שלך פורסם בהצלחה!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            הפריט שלך זמין כעת להשכרה. אתה יכול לצפות ולערוך אותו בכל עת מהפרופיל שלך.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
            <Link
              href="/my-listings"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              צפה במודעות שלי
            </Link>
            
            <Link
              href="/list-item"
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              פרסם פריט נוסף
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-8">
            תועבר אוטומטית לדף הבית תוך 5 שניות...
          </p>
        </div>
      </div>
    </div>
  )
} 