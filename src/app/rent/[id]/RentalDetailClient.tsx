'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import Image from 'next/image'
import { Star, MapPin, Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

type ItemData = {
  id: string
  title: string
  description: string
  category: string
  price_per_day: number
  location: string
  images: string[]
  status: string
  owner_id: string
  created_at: string
  owner: {
    display_name?: string
    avatar_url?: string
  } | null
}

interface RentalDetailClientProps {
  item: ItemData
  isRefreshing?: boolean
}

export default function RentalDetailClient({ item, isRefreshing = false }: RentalDetailClientProps) {
  const { user, isAuthenticated, isLoading } = useUserAuth()
  const router = useRouter()
  const supabase = createClient()
  
  // Fix useState TypeScript errors by not destructuring the return value
  const selectedImageState = useState(0);
  const selectedImage = selectedImageState[0];
  const setSelectedImage = selectedImageState[1];
  
  const rentalDaysState = useState(1);
  const rentalDays = rentalDaysState[0];
  const setRentalDays = rentalDaysState[1];
  
  const startDateState = useState('');
  const startDate = startDateState[0];
  const setStartDate = startDateState[1];
  
  const isSubmittingState = useState(false);
  const isSubmitting = isSubmittingState[0];
  const setIsSubmitting = isSubmittingState[1];

  // Features based on category
  const getCategoryFeatures = (category: string) => {
    const featureMap: Record<string, string[]> = {
      'cameras': ['איכות תמונה גבוהה', 'עדשה מקצועית', 'סוללה לשימוש ממושך', 'מתאים לצילום סטילס ווידאו'],
      'electronics': ['מצב חדש', 'כל האביזרים הנלווים', 'הוראות הפעלה', 'אחריות להשכרה'],
      'camping': ['קל לנשיאה', 'עמיד למים', 'מתאים לכל מזג אוויר', 'קל להרכבה'],
      'tools': ['כלי עבודה מקצועי', 'במצב עבודה מעולה', 'סוללות/חשמל', 'כל האביזרים הנלווים'],
      'music': ['מצב מעולה', 'צליל איכותי', 'סוללות/חשמל', 'מתאים למתחילים ומקצוענים'],
      'sports': ['ציוד מקצועי', 'מצב חדש', 'קל לשימוש', 'מתאים לכל הרמות'],
      'garden': ['כלי גינון איכותיים', 'קל לשימוש', 'מתוחזק היטב', 'מתאים לעבודות גינון מגוונות'],
      'party': ['עיצוב מרשים', 'קל להתקנה', 'מתאים לכל אירוע', 'ניתן להתאמה אישית'],
      'travel': ['קל לנשיאה', 'עמיד לתנאי שטח', 'איכותי ובטיחותי', 'מתאים לטיולים מגוונים'],
    }
    
    return featureMap[category] || ['פריט איכותי', 'מתוחזק היטב', 'מתאים לשימוש', 'במצב עבודה מלא']
  }

  const handleRentNow = async () => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      router.push(`/auth/signin?redirectedFrom=/rent/${item.id}`)
      return
    }

    if (!startDate) {
      alert('אנא בחר תאריך התחלה')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Calculate booking dates
      const start = new Date(startDate)
      const end = new Date(startDate)
      end.setDate(end.getDate() + rentalDays)
      
      // Calculate total price
      const totalPrice = item.price_per_day * rentalDays
      
      // Create booking in Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          item_id: item.id,
          renter_id: user?.id,
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
          total_price: totalPrice,
          status: 'pending'
        })
        .select()
      
      if (error) {
        throw error
      }
      
      alert('הזמנת ההשכרה נשלחה בהצלחה!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error creating booking:', error.message)
      alert(`שגיאה ביצירת הזמנה: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = item.price_per_day * rentalDays
  const features = getCategoryFeatures(item.category)
  const joinedYear = new Date(item.created_at).getFullYear()

  // Don't allow renting if item is not active
  const isItemAvailable = item.status === 'active'
  
  // Check if the current user is the owner
  const isOwner = user && user.id === item.owner_id

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-blue-600 mb-6"
      >
        <ChevronRight className="h-5 w-5 ml-1" />
        חזרה
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col">
          <div className="relative w-full h-80 sm:h-96 overflow-hidden rounded-lg">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">אין תמונה</span>
              </div>
            )}
          </div>
          
          {item.images && item.images.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-24 overflow-hidden rounded-lg ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item details */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
          
          <div className="mt-3 flex items-center">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="mr-1 text-sm font-medium text-gray-900">4.5</span>
            </div>
            <span className="mr-2 text-sm text-gray-500">(0 ביקורות)</span>
            <span className="mr-2 text-sm text-gray-500">•</span>
            <span className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 ml-1" />
              {item.location}
            </span>
          </div>

          <div className="mt-4">
            <h2 className="sr-only">מחיר</h2>
            <p className="text-3xl text-gray-900">₪{item.price_per_day} <span className="text-base">/יום</span></p>
          </div>

          {!isItemAvailable && (
            <div className="mt-4 bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-yellow-800">
                {item.status === 'rented' ? 'פריט זה מושכר כרגע ואינו זמין להשכרה' : 
                 item.status === 'maintenance' ? 'פריט זה נמצא בתחזוקה ואינו זמין כרגע' :
                 'פריט זה אינו זמין כרגע להשכרה'}
              </p>
            </div>
          )}

          {isOwner && (
            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                זה הפריט שלך! אתה יכול <Link href={`/rentals/edit/${item.id}`} className="underline">לערוך אותו</Link> באזור ניהול הפריטים.
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">תיאור</h3>
            <div className="mt-2 space-y-6">
              <p className="text-base text-gray-500">{item.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">מאפיינים</h3>
            <div className="mt-4">
              <ul className="grid grid-cols-1 gap-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="ml-2 text-blue-600">•</span>
                    <span className="text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {item.owner?.avatar_url ? (
                    <img
                      src={item.owner.avatar_url}
                      alt={item.owner.display_name || 'משתמש'}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.owner?.display_name || 'משתמש'}
                </h3>
                <p className="text-xs text-gray-500">
                  משתמש מ-{joinedYear}
                </p>
              </div>
            </div>
          </div>

          {!isOwner && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">פרטי השכרה</h3>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">תאריך התחלה</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={!isItemAvailable || isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">מספר ימים</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      className="relative inline-flex items-center space-x-2 px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                      disabled={!isItemAvailable || isSubmitting}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="flex-1 flex items-center justify-center border-t border-b border-gray-300 bg-white text-sm text-gray-700">
                      {rentalDays}
                    </div>
                    <button
                      type="button"
                      onClick={() => setRentalDays(rentalDays + 1)}
                      className="relative inline-flex items-center space-x-2 px-4 py-2 border border-r-0 border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                      disabled={!isItemAvailable || isSubmitting}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-lg font-medium text-gray-900">סה"כ:</p>
                <p className="text-xl font-bold text-gray-900">₪{totalPrice}</p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleRentNow}
                  className={`w-full border rounded-md py-3 px-8 flex items-center justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isItemAvailable && !isSubmitting
                      ? 'bg-blue-600 border-transparent text-white hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isItemAvailable || isSubmitting}
                >
                  {isSubmitting ? 'שולח בקשת השכרה...' : 
                   !isAuthenticated ? 'התחבר כדי להשכיר' :
                   !isItemAvailable ? 'לא זמין להשכרה' : 'השכר עכשיו'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 