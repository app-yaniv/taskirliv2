'use client'

import { useEffect, useState } from 'react'
import { useUserAuth } from '@/context/UserAuthContext'
import Hero from '@/components/features/Hero'
import Categories from '@/components/features/Categories'
import FeaturedItems from '@/components/features/FeaturedItems'
import Benefits from '@/components/features/Benefits'

export default function Home() {
  const { user, profile, isAuthenticated } = useUserAuth()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    if (isAuthenticated && user) {
      // Use display_name if available, otherwise fallback to email username
      let name = profile?.display_name || '';
      
      if (!name && user.email) {
        // If no display name, get the first part of the email before the @ symbol
        name = user.email.split('@')[0];
      }
      
      setGreeting(`שלום ${name}! ברוך הבא חזרה.`)
    }
  }, [isAuthenticated, user, profile])

  return (
    <div className="min-h-screen">
      {isAuthenticated && greeting && (
        <div className="bg-blue-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-blue-700 font-medium">{greeting}</p>
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
