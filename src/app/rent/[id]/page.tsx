'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import Image from 'next/image'
import { Star, MapPin, Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'

interface RentalItemProps {
  params: {
    id: string
  }
}

export default function RentalDetail({ params }: RentalItemProps) {
  const { id } = params
  const { isAuthenticated, isLoading } = useUserAuth()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [rentalDays, setRentalDays] = useState(1)
  const [startDate, setStartDate] = useState('')

  // Mock item data (in a real app, this would be fetched from the backend)
  const item = {
    id: parseInt(id),
    title: 'מצלמת Sony A7III',
    description: 'מצלמת מירורלס מקצועית עם חיישן פול פריים 24.2 מגה פיקסל. כוללת עדשת 28-70mm, סוללה נוספת, כרטיס זיכרון 64GB וחצובה.',
    price: 120,
    location: 'תל אביב, מרכז',
    owner: {
      name: 'דני כהן',
      joined: '2022',
      rating: 4.9,
      reviews: 28,
    },
    images: [
      '/assets/items/camera.jpg',
      '/assets/items/camera-2.jpg',
      '/assets/items/camera-3.jpg',
    ],
    features: [
      'חיישן פול פריים 24.2MP',
      'צילום וידאו 4K',
      'מייצב תמונה מובנה',
      'מסך מגע נטוי',
      'עמידות לתנאי מזג אוויר'
    ],
    rating: 4.9,
    reviews: 28,
  }

  const handleRentNow = () => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      router.push(`/auth/signin?redirectedFrom=/rent/${id}`)
      return
    }

    if (!startDate) {
      alert('אנא בחר תאריך התחלה')
      return
    }

    // In a real app, this would send the rental request to the backend
    alert(`הזמנת השכרה נשלחה: ${rentalDays} ימים החל מ-${startDate}`)
    // Redirect to confirmation page or dashboard
    router.push('/bookings')
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="text-xl">פריט לא נמצא</div>
      </div>
    )
  }

  const totalPrice = item.price * rentalDays

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
            <Image
              src={item.images[selectedImage]}
              alt={item.title}
              fill
              className="object-cover object-center"
            />
          </div>
          
          {item.images.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-24 overflow-hidden rounded-lg ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    fill
                    className="object-cover object-center"
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
              <span className="mr-1 text-sm font-medium text-gray-900">{item.rating}</span>
            </div>
            <span className="mr-2 text-sm text-gray-500">({item.reviews} ביקורות)</span>
            <span className="mr-2 text-sm text-gray-500">•</span>
            <span className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 ml-1" />
              {item.location}
            </span>
          </div>

          <div className="mt-4">
            <h2 className="sr-only">מחיר</h2>
            <p className="text-3xl text-gray-900">₪{item.price} <span className="text-base">/יום</span></p>
          </div>

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
                {item.features.map((feature, index) => (
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
                  <User className="h-6 w-6" />
                </div>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.owner.name}
                </h3>
                <p className="text-xs text-gray-500">
                  משתמש מ-{item.owner.joined}
                </p>
              </div>
            </div>
          </div>

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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">מספר ימים</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                    className="relative inline-flex items-center space-x-2 px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
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
                className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isAuthenticated ? 'השכר עכשיו' : 'התחבר כדי להשכיר'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 