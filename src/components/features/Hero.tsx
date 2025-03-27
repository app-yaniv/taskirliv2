'use client'

import { useUserAuth } from '@/context/UserAuthContext'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const { isAuthenticated } = useUserAuth()
  const router = useRouter()

  const handleRentingClick = () => {
    // When someone clicks "Start Renting", take them to our sample product page
    router.push('/product/sample-product')
  }

  const handleListItemClick = () => {
    if (isAuthenticated) {
      // If authenticated, go directly to create listing page
      router.push('/rentals/create')
    } else {
      // If not authenticated, redirect to signin with a redirect back to the create listing page
      router.push('/auth/signin?redirectedFrom=/rentals/create')
    }
  }

  return (
    <div 
      className="relative min-h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg')`
      }}
    >
      {/* Hero Content */}
      <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mr-0 ml-auto text-right text-white">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              להשכיר במקום לקנות
            </h1>
            <p className="mt-6 text-xl">
              השוק הגדול ביותר להשכרת ציוד בישראל. מצלמות, ציוד קמפינג וכל מה שתצטרכו.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-start gap-4">
              <button
                onClick={handleRentingClick}
                className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                התחל להשכיר
              </button>
              <button
                onClick={handleListItemClick}
                className="px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                פרסם פריט להשכרה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 