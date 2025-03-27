'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import { Star, MapPin, Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'

interface RentalDetailProps {
  id: string
  initialData: any
}

export default function RentalDetail({ id, initialData }: RentalDetailProps) {
  const { user, isAuthenticated, isLoading } = useUserAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [item, setItem] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [rentalDays, setRentalDays] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ownerAvatarFailed, setOwnerAvatarFailed] = useState(false)

  const handleRentNow = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    if (!startDate) {
      setError('נא לבחור תאריך התחלה')
      return
    }

    try {
      setIsSubmitting(true)
      
      const { error } = await supabase
        .from('rentals')
        .insert({
          item_id: id,
          renter_id: user.id,
          start_date: startDate,
          days: rentalDays,
          total_price: item.price_per_day * rentalDays,
          status: 'pending'
        })

      if (error) throw error

      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error creating rental:', error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-red-800">שגיאה בטעינת הפריט</h3>
          <p className="mt-2 text-red-700">{error || 'פריט לא נמצא'}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            חזרה
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="relative">
          {item.images && item.images.length > 0 && (
            <>
              <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
                <SafeImage
                  src={item.images[selectedImage]}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              {item.images.length > 1 && (
                <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2 space-x-reverse">
                  {item.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === selectedImage ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Item Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
          <div className="mt-4 flex items-center space-x-4 space-x-reverse">
            <span className="text-2xl font-bold text-blue-600">₪{item.price_per_day}</span>
            <span className="text-gray-500">ליום</span>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">פרטי המשכיר</h2>
            <div className="mt-2 flex items-center">
              {item.owner_profile?.avatar_url && !ownerAvatarFailed ? (
                <SafeImage
                  src={item.owner_profile.avatar_url}
                  alt={item.owner_profile.display_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  onError={() => setOwnerAvatarFailed(true)}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <span className="mr-2 text-gray-900">{item.owner_profile?.display_name}</span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">תיאור</h2>
            <p className="mt-2 text-gray-600">{item.description}</p>
          </div>

          {/* Rental Form */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900">פרטי השכרה</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                  תאריך התחלה
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                  מספר ימים
                </label>
                <input
                  type="number"
                  id="days"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">סה"כ:</span>
                <span className="text-xl font-bold text-blue-600">₪{item.price_per_day * rentalDays}</span>
              </div>
              <button
                onClick={handleRentNow}
                disabled={isSubmitting || !startDate}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'מעבד...' : 'השכר עכשיו'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 