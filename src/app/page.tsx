'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/features/Hero'
import Categories from '@/components/features/Categories'
import FeaturedItems from '@/components/features/FeaturedItems'
import Benefits from '@/components/features/Benefits'
import { useUserAuth } from '@/context/UserAuthContext'

export default function Home() {
  const { user, isAuthenticated } = useUserAuth()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      // Get the first part of the email before the @ symbol
      const name = user.email.split('@')[0]
      setGreeting(`שלום ${name}, ברוך הבא חזרה!`)
    }
  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen">
      {isAuthenticated && greeting && (
        <div className="bg-blue-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-blue-700 font-medium">{greeting}</p>
              <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                לוח הבקרה שלי &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
      <Hero />
      <Categories />
      <FeaturedItems />
      <Benefits />
    </div>
  )
}
