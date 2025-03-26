'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useUserAuth } from '@/context/UserAuthContext'

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  price_per_day: number;
  location: string;
  images: string[];
  status: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner?: {
    display_name: string;
    avatar_url: string;
    avg_rating: number;
    total_reviews: number;
  }
}

interface ProductDetailProps {
  itemId: string;
}

export default function ProductDetail({ itemId }: ProductDetailProps) {
  const router = useRouter()
  const supabase = createClient()
  const { isAuthenticated, user } = useUserAuth()
  
  const [item, setItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedDays, setSelectedDays] = useState(1)
  
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [startDate, setStartDate] = useState('')
  
  useEffect(() => {
    if (itemId) {
      fetchItem(itemId)
    }
  }, [itemId])

  const fetchItem = async (id: string) => {
    try {
      setIsLoading(true)
      
      // Fetch the item with owner profile info
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          owner:profiles!items_owner_id_fkey (
            display_name,
            avatar_url,
            avg_rating,
            total_reviews
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        throw error
      }
      
      if (data) {
        setItem(data)
      } else {
        setError('Item not found')
      }
    } catch (error: any) {
      console.error('Error fetching item:', error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Calendar setup
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  
  const selectDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    setStartDate(date.toISOString().split('T')[0])
  }
  
  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?redirectedFrom=/product/${itemId}`)
      return
    }
    
    // TODO: Implement actual booking logic
    alert('Thank you! Your booking request has been sent.')
  }
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }
  
  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-red-800">שגיאה בטעינת הפריט</h3>
              <p className="mt-2 text-sm text-red-700">{error || 'פריט לא נמצא'}</p>
              <div className="mt-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-red-800 hover:text-red-600"
                >
                  &rarr; חזרה לדף הבית
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Calculate total price based on days
  const totalPrice = item.price_per_day * selectedDays;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800">כל הקטגוריות</Link>
        <span className="mx-2">›</span>
        <Link href={`/?category=${item.category}`} className="text-blue-600 hover:text-blue-800">{item.category || 'כללי'}</Link>
      </div>
      
      {/* Product Hero Section */}
      <div className="lg:flex">
        {/* Product Images */}
        <div className="lg:w-1/2 bg-white rounded-lg overflow-hidden shadow-md">
          <div className="flex flex-col">
            <div className="p-6 text-center font-bold text-2xl">
              {item.title}
            </div>
            <div className="flex justify-center p-6">
              {item.images && item.images.length > 0 ? (
                <div className="flex items-center justify-center w-full">
                  <img
                    src={item.images[selectedImage] || '/placeholder.jpg'}
                    alt={item.title}
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">אין תמונה זמינה</span>
                </div>
              )}
            </div>
            
            {item.images && item.images.length > 1 && (
              <div className="flex justify-center gap-2 pb-6">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || '/placeholder.jpg'}
                      alt={`${item.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Product Details and Booking */}
        <div className="lg:w-1/2 lg:pr-8 mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {item.title}
          </h1>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="mr-1 text-sm font-medium text-gray-900">{item.owner?.avg_rating || 0}</span>
              </div>
              <span className="mr-2 text-sm text-gray-500">({item.owner?.total_reviews || 0} ביקורות)</span>
              <span className="mr-2 text-sm text-gray-500">•</span>
              <span className="flex items-center mr-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 ml-1" />
                {item.location || 'מיקום לא זמין'}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">מידע על הפריט</h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">בעלים</h2>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 relative">
                {item.owner?.avatar_url ? (
                  <img
                    src={item.owner.avatar_url}
                    alt={item.owner.display_name || 'Owner'}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 font-bold">
                      {(item.owner?.display_name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium">{item.owner?.display_name || 'משתמש'}</p>
                <p className="text-xs text-gray-500">
                  {item.owner?.total_reviews || 0} ביקורות • דירוג {item.owner?.avg_rating || 0}/5
                </p>
              </div>
            </div>
          </div>
          
          {/* Calendar Section */}
          <div className="mb-6 border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className="text-blue-600">
                &gt; הקודם
              </button>
              <h2 className="text-lg font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button onClick={nextMonth} className="text-blue-600">
                הבא &lt;
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm">
              <div>א</div>
              <div>ב</div>
              <div>ג</div>
              <div>ד</div>
              <div>ה</div>
              <div>ו</div>
              <div>ש</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-10"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isToday = today.getDate() === day && 
                               today.getMonth() === currentMonth && 
                               today.getFullYear() === currentYear
                const isSelected = startDate === dateString
                
                return (
                  <button
                    key={day}
                    onClick={() => selectDate(day)}
                    className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full hover:bg-blue-100 
                      ${isToday ? 'border border-blue-500' : ''} 
                      ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            
            <div className="mt-4 flex justify-between">
              <div>
                <p className="text-sm font-semibold">החזרה</p>
                <p className="text-sm">
                  {startDate 
                    ? new Date(new Date(startDate).getTime() + selectedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    : 'בחר תאריך'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">איסוף</p>
                <p className="text-sm">{startDate || 'בחר תאריך'}</p>
              </div>
            </div>
          </div>
          
          {/* Rental Period Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">בחר תקופת השכרה</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div 
                onClick={() => setSelectedDays(1)} 
                className={`border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 ${selectedDays === 1 ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <p className="font-bold">₪{item.price_per_day}</p>
                <p className="text-sm">יום 1</p>
              </div>
              <div 
                onClick={() => setSelectedDays(3)} 
                className={`border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 ${selectedDays === 3 ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <p className="font-bold">₪{item.price_per_day * 3}</p>
                <p className="text-sm">3 ימים</p>
              </div>
              <div 
                onClick={() => setSelectedDays(7)} 
                className={`border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 ${selectedDays === 7 ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <p className="font-bold">₪{item.price_per_day * 7}</p>
                <p className="text-sm">שבוע</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <p>₪{item.price_per_day} × {selectedDays} {selectedDays === 1 ? 'יום' : 'ימים'}</p>
                <p>₪{totalPrice}</p>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <p>סה"כ</p>
                <p>₪{totalPrice}</p>
              </div>
            </div>
            
            <button
              onClick={handleBookNow}
              disabled={!startDate}
              className={`w-full py-3 px-4 rounded-md text-white font-medium 
                ${!startDate
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {isAuthenticated ? 'בקשת השכרה' : 'התחבר להשכרה'}
            </button>
            
            {!startDate && (
              <p className="text-sm text-red-600 mt-2 text-center">יש לבחור תאריך התחלה</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 