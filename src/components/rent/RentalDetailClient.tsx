'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import { Star, MapPin, Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'

interface RentalDetailClientProps {
  id: string
}

export default function RentalDetailClient({ id }: RentalDetailClientProps) {
  const { user, isAuthenticated, isLoading } = useUserAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [rentalDays, setRentalDays] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ownerAvatarFailed, setOwnerAvatarFailed] = useState(false)

  useEffect(() => {
    fetchItemDetails()
  }, [id])

  const fetchItemDetails = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          owner_profile:profiles!owner_id(display_name, avatar_url)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (!data) throw new Error('פריט לא נמצא')

      setItem(data)
    } catch (error: any) {
      console.error('Error fetching item:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Copy all the remaining functions and JSX from the original component
  // ... (handleRentNow, getCategoryFeatures, etc.)

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

  // Rest of your component JSX
  return (
    // ... your existing JSX
  )
} 