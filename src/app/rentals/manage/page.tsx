'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { Pencil, Trash2, Eye, DollarSign } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

type Listing = {
  id: string
  title: string
  price_per_day: number
  images: string[]
  status: string
  created_at: string
  bookings_count?: number
  total_revenue?: number
}

export default function ManageRentals() {
  const { user, isLoading, isAuthenticated } = useUserAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirectedFrom=/rentals/manage')
      return
    }
    
    // Fetch user's listings if authenticated
    if (isAuthenticated && user) {
      fetchUserListings()
    }
  }, [isLoading, isAuthenticated, router, user])
  
  const fetchUserListings = async () => {
    try {
      setLoading(true)
      
      // Fetch items owned by the user
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      // Transform the data
      const formattedListings = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        price_per_day: item.price_per_day,
        images: item.images,
        status: item.status,
        created_at: item.created_at,
        // We'll implement these with real data once bookings are added
        bookings_count: 0,
        total_revenue: 0
      }))
      
      setListings(formattedListings)
    } catch (error: any) {
      console.error('Error fetching listings:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteListing = async (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      try {
        // Delete the item from Supabase
        const { error } = await supabase
          .from('items')
          .delete()
          .eq('id', id)
        
        if (error) {
          throw error
        }
        
        // Update the local state
        setListings(listings.filter(listing => listing.id !== id))
      } catch (error: any) {
        console.error('Error deleting listing:', error.message)
        alert(`שגיאה במחיקת הפריט: ${error.message}`)
      }
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
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-red-800">שגיאה בטעינת הפריטים</h3>
          <p className="mt-2 text-red-700">{error}</p>
          <button 
            onClick={fetchUserListings} 
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            נסה שוב
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">ניהול הפריטים שלי</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/rentals/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            פרסם פריט חדש
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">אין לך פריטים להשכרה</h3>
          <p className="mt-2 text-sm text-gray-500">התחל להרוויח על ידי פרסום הפריט הראשון שלך להשכרה</p>
          <div className="mt-6">
            <Link
              href="/rentals/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              פרסם פריט חדש
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <li key={listing.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative">
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">אין תמונה</span>
                            </div>
                          )}
                        </div>
                        <div className="mr-4">
                          <p className="text-lg font-medium text-blue-600 truncate">{listing.title}</p>
                          <p className="mt-1 flex items-center text-sm text-gray-500">
                            <DollarSign className="flex-shrink-0 ml-1 h-4 w-4 text-gray-400" />
                            <span>₪{listing.price_per_day} / יום</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex space-x-2 space-x-reverse">
                          <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                            listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.status === 'active' ? 'פעיל' : 
                             listing.status === 'rented' ? 'מושכר' : 
                             listing.status === 'maintenance' ? 'בתחזוקה' : 'לא פעיל'}
                          </span>
                          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {listing.bookings_count} השכרות
                          </span>
                          <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            ₪{listing.total_revenue} הכנסות
                          </span>
                        </div>
                        <div className="mt-2 flex space-x-3 space-x-reverse">
                          <Link
                            href={`/rent/${listing.id}`}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            title="צפייה"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/rentals/edit/${listing.id}`}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            title="עריכה"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteListing(listing.id)}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="מחיקה"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 