'use client'

import { useEffect, useState } from 'react'
import { useUserAuth } from '@/context/UserAuthContext'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Calendar, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Booking {
  id: string
  item_id: string
  renter_id: string
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'canceled'
  payment_status: string
  created_at: string
  items: {
    title: string
    description: string
    images: string[]
    price_per_day: number
    owner_id: string
  }
}

export default function BookingsPage() {
  const { user, isLoading } = useUserAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({})
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!isLoading && user) {
      fetchBookings()
    }
  }, [isLoading, user, retryCount])

  const fetchBookings = async () => {
    setIsLoadingBookings(true)
    setError(null)
    try {
      // Small delay to ensure client is initialized
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const supabase = createClient()
      
      // First query bookings with item data
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          items (
            title,
            description,
            images,
            price_per_day,
            owner_id
          )
        `)
        .eq('renter_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('שגיאה בטעינת ההזמנות:', error.message)
        throw new Error(`שגיאת מסד נתונים: ${error.message}`)
      }
      
      // Filter out invalid data
      const validBookings = (data || []).filter((booking: Booking) => booking.items && booking.items.title)
      console.log(`נטענו ${validBookings.length} הזמנות תקינות מתוך ${data?.length || 0}`)
      
      setBookings(validBookings)
    } catch (err: any) {
      console.error('שגיאה בטעינת ההזמנות:', err)
      setError(`אירעה שגיאה בטעינת ההזמנות: ${err.message}. אנא נסה שוב מאוחר יותר.`)
    } finally {
      setIsLoadingBookings(false)
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('he-IL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (err) {
      console.error('שגיאה בעיבוד התאריך:', err)
      return 'תאריך לא תקין'
    }
  }

  const getDurationDays = (booking: Booking) => {
    if (!booking.start_date || !booking.end_date) return 0;
    
    try {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (err) {
      console.error('שגיאה בחישוב מספר ימים:', err);
      return 0;
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'ממתין לאישור'
      case 'approved': return 'מאושר'
      case 'rejected': return 'נדחה'
      case 'completed': return 'הושלם'
      case 'canceled': return 'בוטל'
      default: return 'סטטוס לא ידוע'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'rejected': case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleImageError = (id: string) => {
    setImageFailed(prev => ({ ...prev, [id]: true }))
  }

  // RTL wrapper for all content
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ההזמנות שלי</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={handleRetry} 
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
              >
                <RefreshCw className="h-4 w-4 ml-1" />
                נסה שוב
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="mr-3 text-gray-700">טוען פרופיל משתמש...</span>
        </div>
      ) : !user ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-yellow-800">אינך מחובר</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>יש להתחבר כדי לצפות בהזמנות שלך.</p>
                <Link href="/auth/signin" className="font-medium underline text-yellow-700 hover:text-yellow-600 mt-2 inline-block">
                  התחבר כעת
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : isLoadingBookings ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="mr-3 text-gray-700">טוען את ההזמנות שלך...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין לך הזמנות עדיין</h3>
          <p className="text-gray-600 mb-4">נראה שעדיין לא ביצעת הזמנות. תוכל למצוא פריטים להשכרה בדף הבית.</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            חזרה לדף הבית
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
                      {booking.items?.images?.[0] && !imageFailed[booking.id] ? (
                        <Image
                          src={booking.items.images[0]}
                          alt={booking.items.title}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(booking.id)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">אין תמונה</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-3/4 md:pr-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {booking.items?.title || 'פריט לא קיים'}
                      </h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>

                    {booking.items?.description && (
                      <p className="text-gray-600 mt-1 mb-3 line-clamp-2">{booking.items.description}</p>
                    )}
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 ml-2 text-gray-400" />
                        <span>תאריך התחלה: {formatDate(booking.start_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 ml-2 text-gray-400" />
                        <span>משך זמן: {getDurationDays(booking)} ימים</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-blue-600">₪{booking.total_price}</div>
                      <Link
                        href={`/rent/${booking.item_id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        צפה בפריט
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
