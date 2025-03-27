'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useUserAuth } from '@/context/UserAuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface Item {
  id: string;
  title: string;
  price_per_day: number;
  images: string[];
  status: string;
  category: string;
}

export default function FeaturedItems() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [featuredItems, setFeaturedItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const { isAuthenticated } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    async function fetchFeaturedItems() {
      try {
        if (!isMounted) return;
        setIsLoading(true)
        setError(null)
        
        console.log('Fetching featured items, attempt:', retryCount + 1)
        const supabase = createClient()
        
        // Add a small delay before fetching to ensure Supabase client is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data, error } = await supabase
          .from('items')
          .select('id, title, price_per_day, images, status, category')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (error) {
          console.error('Supabase error:', error)
          throw error
        }
        
        if (data && isMounted) {
          // Filter out items with invalid image URLs
          const validItems = data.filter((item: Item) => 
            item.images && 
            Array.isArray(item.images) && 
            item.images.length > 0 &&
            typeof item.images[0] === 'string'
          );
          console.log('Featured items loaded:', validItems.length)
          setFeaturedItems(validItems)
        }
      } catch (error) {
        console.error('Error fetching featured items:', error)
        if (isMounted && retryCount < maxRetries) {
          retryCount++;
          console.log('Retrying fetch, attempt:', retryCount + 1)
          setTimeout(fetchFeaturedItems, 1000 * retryCount)
        } else if (isMounted) {
          setError('Failed to load featured items')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchFeaturedItems()
    
    return () => {
      isMounted = false
    }
  }, [])

  const itemsToShow = 3 // Number of items to show at once
  const maxIndex = Math.max(0, featuredItems.length - itemsToShow)

  const getProductLink = (itemId: string) => {
    return `/product/${itemId}`
  }

  const handleRentClick = (itemId: string) => {
    if (isAuthenticated) {
      router.push(`/product/${itemId}`)
    } else {
      router.push(`/auth/signin?redirectedFrom=/product/${itemId}`)
    }
  }

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }))
  }

  // Render loading skeleton while items are loading
  if (isLoading) {
    return (
      <section id="featured-items" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">פריטים מובילים</h2>
            <p className="mt-2 text-gray-600">בדוק את הפריטים הפופולריים ביותר להשכרה</p>
          </div>
          <div className="flex space-x-6 space-x-reverse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Render error message if there was an error
  if (error) {
    return (
      <section id="featured-items" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">פריטים מובילים</h2>
            <p className="mt-2 text-gray-600">בדוק את הפריטים הפופולריים ביותר להשכרה</p>
          </div>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  // If no items found
  if (featuredItems.length === 0) {
    return (
      <section id="featured-items" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">פריטים מובילים</h2>
            <p className="mt-2 text-gray-600">בדוק את הפריטים הפופולריים ביותר להשכרה</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-blue-600 text-center">עדיין אין פריטים להצגה. היה הראשון להוסיף פריט!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="featured-items" className="py-12 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">פריטים מובילים</h2>
          <p className="mt-2 text-gray-600">בדוק את הפריטים הפופולריים ביותר להשכרה</p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[800px] overflow-hidden">
            {featuredItems.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className="w-full"
              >
                <div 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(getProductLink(item.id))}
                >
                  <div className="relative h-48">
                    {item.images && 
                     item.images.length > 0 && 
                     !imageErrors[item.id] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(item.id)}
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">אין תמונה</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/80 text-sm font-medium text-gray-900 py-1 px-2 rounded">
                      {item.category || 'כללי'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRentClick(item.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        השכר עכשיו
                      </button>
                      <span className="font-bold text-gray-900">₪{item.price_per_day} / יום</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 