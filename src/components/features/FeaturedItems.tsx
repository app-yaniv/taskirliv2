'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useUserAuth } from '@/context/UserAuthContext'
import { useRouter } from 'next/navigation'

export default function FeaturedItems() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { isAuthenticated } = useUserAuth()
  const router = useRouter()

  const featuredItems = [
    {
      id: 'canon-eos-r6-kit',
      name: 'CANON EOS R6 MARK II BODY + 28-70MM F/2.8 LENS + FLASH',
      price: 45,
      image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg',
      reviews: 28,
      rating: 4.9,
      category: 'מצלמות',
    },
    {
      id: 2,
      name: 'אוהל קמפינג 4 אנשים',
      price: 75,
      image: 'https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg',
      reviews: 42,
      rating: 4.8,
      category: 'ציוד קמפינג',
    },
    {
      id: 3,
      name: 'קונסולת PlayStation 5',
      price: 85,
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      reviews: 36,
      rating: 4.7,
      category: 'אלקטרוניקה',
    },
    {
      id: 4,
      name: 'תרמיל גב מקצועי',
      price: 30,
      image: 'https://images.pexels.com/photos/1282316/pexels-photo-1282316.jpeg',
      reviews: 19,
      rating: 4.6,
      category: 'ציוד טיולים',
    },
    {
      id: 5,
      name: 'מקדחה חשמלית',
      price: 45,
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      reviews: 57,
      rating: 4.8,
      category: 'כלי עבודה',
    },
  ]

  const itemsToShow = 3 // Number of items to show at once
  const maxIndex = featuredItems.length - itemsToShow

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  const getProductLink = (itemId: string | number) => {
    if (itemId === 'canon-eos-r6-kit') {
      return '/product/sample-product'
    } else {
      return `/rent/${itemId}`
    }
  }

  const handleRentClick = (itemId: string | number) => {
    if (isAuthenticated) {
      // If authenticated, go to the product page for our sample product
      if (itemId === 'canon-eos-r6-kit') {
        router.push(`/product/sample-product`)
      } else {
        // Go to the original rent page for other items
        router.push(`/rent/${itemId}`)
      }
    } else {
      // If not authenticated, redirect to signin with a redirect back to the item
      if (itemId === 'canon-eos-r6-kit') {
        router.push(`/auth/signin?redirectedFrom=/product/sample-product`)
      } else {
        router.push(`/auth/signin?redirectedFrom=/rent/${itemId}`)
      }
    }
  }

  return (
    <section id="featured-items" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">פריטים מובילים</h2>
          <p className="mt-2 text-gray-600">בדוק את הפריטים הפופולריים ביותר להשכרה</p>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out space-x-6 space-x-reverse"
              style={{ transform: `translateX(${currentIndex * 25}%)` }}
            >
              {featuredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4"
                >
                  <div 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(getProductLink(item.id))}
                  >
                    <div className="relative h-48">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2 bg-white/80 text-sm font-medium text-gray-900 py-1 px-2 rounded">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 ml-1" />
                        <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                        <span className="text-sm text-gray-500 mr-1">({item.reviews} ביקורות)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">₪{item.price} / יום</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRentClick(item.id);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          השכר עכשיו
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {currentIndex > 0 && (
            <button 
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}
          
          {currentIndex < maxIndex && (
            <button 
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
} 