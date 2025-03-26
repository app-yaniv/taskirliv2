'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Clock, Package, ShoppingBag, CalendarDays, Ban, Check, ArrowRight } from 'lucide-react'

type Booking = {
  id: string
  item_id: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  created_at: string
  item?: {
    title: string
    images: string[]
    owner_id: string
  }
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useUserAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rentals, setRentals] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirectedFrom=/dashboard')
      return
    }

    if (isAuthenticated && user) {
      fetchBookingsAndRentals()
    }
  }, [isLoading, isAuthenticated, router, user])
  
  const fetchBookingsAndRentals = async () => {
    try {
      setLoading(true)
      
      // Fetch user's bookings (items they are renting)
      const { data: userBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          item:items(title, images, owner_id)
        `)
        .eq('renter_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (bookingsError) throw bookingsError
      
      // Fetch rentals of user's items (items the user owns that others are renting)
      const { data: userItems, error: itemsError } = await supabase
        .from('items')
        .select('id')
        .eq('owner_id', user?.id)
      
      if (itemsError) throw itemsError
      
      if (userItems && userItems.length > 0) {
        const itemIds = userItems.map((item: { id: string }) => item.id)
        
        const { data: rentalsOfMyItems, error: rentalsError } = await supabase
          .from('bookings')
          .select(`
            *,
            item:items(title, images, owner_id)
          `)
          .in('item_id', itemIds)
          .order('created_at', { ascending: false })
        
        if (rentalsError) throw rentalsError
        
        setRentals(rentalsOfMyItems || [])
      }
      
      setBookings(userBookings || [])
    } catch (error: any) {
      console.error('Error fetching data:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL')
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'ממתין לאישור', color: 'bg-yellow-100 text-yellow-800' }
      case 'confirmed':
        return { text: 'מאושר', color: 'bg-green-100 text-green-800' }
      case 'active':
        return { text: 'פעיל', color: 'bg-blue-100 text-blue-800' }
      case 'completed':
        return { text: 'הושלם', color: 'bg-purple-100 text-purple-800' }
      case 'cancelled':
        return { text: 'בוטל', color: 'bg-red-100 text-red-800' }
      default:
        return { text: 'לא ידוע', color: 'bg-gray-100 text-gray-800' }
    }
  }
  
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
      
      if (error) throw error
      
      // Refresh data
      fetchBookingsAndRentals()
    } catch (error: any) {
      console.error('Error updating booking status:', error.message)
      alert(`שגיאה בעדכון סטטוס ההזמנה: ${error.message}`)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">לוח בקרה</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">פרטי משתמש</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">מידע אישי ופרטי החשבון שלך.</p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ערוך פרופיל <ArrowRight className="mr-1 h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">כתובת אימייל</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">מזהה חשבון</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.id?.slice(0, 8)}...</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">תאריך הצטרפות</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.created_at ? formatDate(user.created_at) : 'לא זמין'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">סטטוס חשבון</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    פעיל
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">פעולות מהירות</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link
                href="/rentals/create"
                className="inline-flex flex-col items-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Package className="h-8 w-8 text-blue-500 mb-2" />
                פרסם פריט חדש
              </Link>
              <Link
                href="/rentals/manage"
                className="inline-flex flex-col items-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ShoppingBag className="h-8 w-8 text-green-500 mb-2" />
                נהל את הפריטים שלי
              </Link>
              <button
                className="inline-flex flex-col items-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => fetchBookingsAndRentals()}
              >
                <Clock className="h-8 w-8 text-purple-500 mb-2" />
                רענן נתונים
              </button>
              <Link
                href="/"
                className="inline-flex flex-col items-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CalendarDays className="h-8 w-8 text-orange-500 mb-2" />
                חפש פריטים להשכרה
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* My Bookings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">ההשכרות שלי</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">פריטים שאתה שוכר מאחרים.</p>
        </div>
        
        {bookings.length === 0 ? (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6 text-center">
            <p className="text-gray-500">אין לך השכרות פעילות כרגע.</p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              מצא פריטים להשכרה
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 relative">
                      {booking.item?.images && booking.item.images.length > 0 ? (
                        <img
                          src={booking.item.images[0]}
                          alt={booking.item?.title}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">אין תמונה</span>
                        </div>
                      )}
                    </div>
                    <div className="mr-4">
                      <p className="text-lg font-medium text-blue-600 truncate">{booking.item?.title}</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                      </p>
                      <p className="mt-1 flex items-center text-sm text-gray-900 font-semibold">
                        ₪{booking.total_price}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${getStatusText(booking.status).color}`}>
                      {getStatusText(booking.status).text}
                    </span>
                    <div className="mt-2 flex space-x-2 space-x-reverse">
                      <Link
                        href={`/rent/${booking.item_id}`}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        פרטי פריט
                      </Link>
                      {booking.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          ביטול
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Rentals of my items */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">השכרות של הפריטים שלי</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">פריטים שלך שאחרים שוכרים.</p>
        </div>
        
        {rentals.length === 0 ? (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6 text-center">
            <p className="text-gray-500">אין הזמנות השכרה לפריטים שלך כרגע.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {rentals.map((rental) => (
              <li key={rental.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 relative">
                      {rental.item?.images && rental.item.images.length > 0 ? (
                        <img
                          src={rental.item.images[0]}
                          alt={rental.item?.title}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">אין תמונה</span>
                        </div>
                      )}
                    </div>
                    <div className="mr-4">
                      <p className="text-lg font-medium text-blue-600 truncate">{rental.item?.title}</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                      </p>
                      <p className="mt-1 flex items-center text-sm text-gray-900 font-semibold">
                        ₪{rental.total_price}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${getStatusText(rental.status).color}`}>
                      {getStatusText(rental.status).text}
                    </span>
                    <div className="mt-2 flex space-x-2 space-x-reverse">
                      <Link
                        href={`/rent/${rental.item_id}`}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        פרטי פריט
                      </Link>
                      
                      {rental.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(rental.id, 'confirmed')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Check className="ml-1 h-3 w-3" />
                            אשר
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(rental.id, 'cancelled')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <Ban className="ml-1 h-3 w-3" />
                            דחה
                          </button>
                        </>
                      )}
                      
                      {rental.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(rental.id, 'active')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          סמן כפעיל
                        </button>
                      )}
                      
                      {rental.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(rental.id, 'completed')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-purple-100 text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          סמן כהושלם
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 