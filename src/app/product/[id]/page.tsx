'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'

// Sample product data - in a real app this would come from an API
const sampleProduct = {
  id: 'sample-product',
  title: 'CANON EOS R6 MARK II BODY + 28-70MM F/2.8 LENS + FLASH',
  images: [
    '/product-camera-body.jpg',
    '/product-camera-lens.jpg',
    '/product-camera-flash.jpg',
  ],
  category: 'Camera Package Deals',
  location: 'White City',
  distance: '4.4 mi',
  owner: {
    name: 'Kabir L',
    avatar: '/avatar-placeholder.jpg',
    responseRate: '86%',
    responseTime: 'Usually responds within an hour',
    verified: true,
    rating: 5
  },
  pricing: {
    day1: 45,
    day3: 120,
    day7: 230
  },
  description: 'This versatile bundle combines the Canon EOS R6 Mark II with the RF 28-70mm f/2.8 lens, offering exceptional image quality and low-light performance. Paired with a high-quality flash, it ensures optimal lighting for your shots, whether in the studio or on-location.',
  useCases: [
    'Event Photography: Capture vivid and sharp images during weddings, parties, and corporate events with excellent low-light capabilities and a flash for balanced lighting.',
    'Studio Photography: Use the flash to illuminate subjects and achieve professional-grade results in controlled environments.',
    'Portrait Photography: Create stunning portraits with rich details and perfectly lit subjects.',
    'Travel Photography: The flexible zoom lens ensures wide-angle and close-up capabilities, making it ideal for capturing moments on the go.'
  ],
  included: [
    'Canon EOS R6 Mark II camera body',
    'RF 28-70mm f/2.8 lens',
    'High-performance flash',
    '3x batteries for extended usage',
    'Battery charger'
  ],
  insurance: 'Fat Llama covers damages up to £25,000 per item',
  cancellation: 'Free cancellation until 2 days before your rental starts. After that, you\'ll get half your money back until the day before.'
}

export default function ProductPage() {
  const { id } = useParams() || {}
  const [product, setProduct] = useState(sampleProduct)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedDays, setSelectedDays] = useState(1)
  
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [startDate, setStartDate] = useState('')
  
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800">All categories</Link>
        <span className="mx-2">›</span>
        <Link href="/film-photography" className="text-blue-600 hover:text-blue-800">Film & Photography</Link>
        <span className="mx-2">›</span>
        <Link href="/camera-package-deals" className="text-blue-600 hover:text-blue-800">Camera Package Deals</Link>
      </div>
      
      {/* Product Hero Section */}
      <div className="lg:flex">
        {/* Product Images */}
        <div className="lg:w-1/2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg overflow-hidden">
          <div className="flex flex-col">
            <div className="p-6 text-white text-center font-bold text-2xl">
              {product.title}
            </div>
            <div className="flex justify-center p-6">
              {product.images && product.images.length > 0 ? (
                <div className="flex items-center justify-center w-full">
                  <img
                    src={product.images[selectedImage] || '/placeholder.jpg'}
                    alt={product.title}
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center gap-2 pb-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-white' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || '/placeholder.jpg'}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Product Details and Booking */}
        <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 text-sm font-medium text-gray-900">5.0</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">(5/5)</span>
              <span className="ml-2 text-sm text-gray-500">•</span>
              <span className="flex items-center ml-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {product.location} {product.distance}
              </span>
            </div>
          </div>
          
          {/* Calendar Section */}
          <div className="mb-6 border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className="text-blue-600">
                &lt; Previous
              </button>
              <h2 className="text-lg font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button onClick={nextMonth} className="text-blue-600">
                Next &gt;
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
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
                <p className="text-sm font-semibold">Pickup</p>
                <p className="text-sm">{startDate || 'Select date'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Drop off</p>
                <p className="text-sm">
                  {startDate 
                    ? new Date(new Date(startDate).getTime() + selectedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    : 'Select date'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Rental Period Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select rental period</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div 
                onClick={() => setSelectedDays(1)} 
                className={`border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 ${selectedDays === 1 ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <p className="font-bold">£{product.pricing.day1}</p>
                <p className="text-sm">1 day</p>
              </div>
              <div 
                onClick={() => setSelectedDays(3)} 
                className={`border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 ${selectedDays === 3 ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <p className="font-bold">£{product.pricing.day3}</p>
                <p className="text-sm">3 days</p>
              </div>
              <div 
                onClick={() => setSelectedDays(7)} 
                className={`border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 ${selectedDays === 7 ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <p className="font-bold">£{product.pricing.day7}</p>
                <p className="text-sm">7 days</p>
              </div>
            </div>
            
            <button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium"
              disabled={!startDate}
            >
              Send a request
            </button>
            
            <p className="text-sm text-center mt-2">
              No strings attached when you send a request but you can ask questions to {product.owner.name}
            </p>
          </div>
          
          {/* Owner Information */}
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img 
                  src={product.owner.avatar}
                  alt={product.owner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">Owned by {product.owner.name}</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < product.owner.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill={i < product.owner.rating ? 'currentColor' : 'none'} 
                    />
                  ))}
                  <span className="ml-1 text-sm">{product.owner.rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {product.owner.verified && (
                <p className="flex items-center">
                  <span className="mr-2">✓</span>
                  Identified
                </p>
              )}
              <p className="flex items-center">
                <span className="mr-2">🕒</span>
                {product.owner.responseTime}
              </p>
              <p className="flex items-center">
                <span className="mr-2">💬</span>
                {product.owner.responseRate} response rate
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span>
                {product.location} {product.distance}
              </p>
              <p className="flex items-center">
                <span className="mr-2">🛡️</span>
                {product.insurance} <a href="#" className="text-blue-600 ml-1">Read more</a>
              </p>
            </div>
            
            <button className="w-full mt-4 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-purple-50">
              Send message
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">DESCRIPTION</h2>
        <p className="mb-6">{product.description}</p>
        
        <h3 className="text-xl font-bold mb-4">What This Setup is Perfect For:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          {product.useCases.map((useCase, index) => (
            <li key={index}>{useCase}</li>
          ))}
        </ul>
        
        <h3 className="text-xl font-bold mb-4">What's Included:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          {product.included.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        
        <p className="mb-6 font-medium">
          Perfect for photographers looking for a reliable, high-performance setup to handle diverse shooting needs. Book now to elevate your photography game!
        </p>
      </div>
      
      {/* Guarantee Section */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">GUARANTEE</h2>
        <p className="mb-4">
          {product.insurance} <a href="#" className="text-blue-600">Read more</a>
        </p>
      </div>
      
      {/* Cancellation Terms */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">CANCELLATION TERMS</h2>
        <p className="mb-4">
          {product.cancellation} <a href="#" className="text-blue-600">Read more</a>
        </p>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        {/* Sample Review */}
        <div className="border rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">Tia C borrowed</p>
            <a href="#" className="text-blue-600">Sony A7 IV + 28-70mm f/2.8 Lens + ND Filter</a>
            <span className="ml-auto text-sm text-gray-500">a day ago</span>
          </div>
          <div className="flex mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
            ))}
            <span className="ml-1 text-sm">5/5</span>
          </div>
          <p className="text-gray-700">"Great equipment and really easy to arrange getting the equipment - I will be renting again"</p>
        </div>
        
        <div className="border rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <p className="font-semibold mr-2">Tia C borrowed</p>
            <a href="#" className="text-blue-600">Sony A7S III Body & 24-105mm G Lens</a>
            <span className="ml-auto text-sm text-gray-500">a day ago</span>
          </div>
          <div className="flex mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
            ))}
            <span className="ml-1 text-sm">5/5</span>
          </div>
          <p className="text-gray-700">"Great equipment and really easy to arrange getting the equipment - I will be renting again"</p>
        </div>
        
        <button className="w-full border border-gray-300 rounded-lg py-2 text-center hover:bg-gray-50">
          Show more
        </button>
      </div>
      
      {/* More Items Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">More items from <a href="#" className="text-blue-600">Kabir L</a></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample Item 1 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative">
              <img 
                src="/product-filter.jpg" 
                alt="Pro mist filter 82mm" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-tl-lg p-2">
                <img 
                  src={product.owner.avatar} 
                  alt={product.owner.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">Pro mist filter 82mm</h3>
              <p className="text-sm text-gray-500 mb-2">4.1 mi (Shepherd's Bush Green, Hammersmith and Fulham)</p>
              <p className="font-bold">£10 - 15/day</p>
            </div>
          </div>
          
          {/* Sample Item 2 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-pink-500 p-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded absolute top-2 right-2 text-xs font-bold">
                POPULAR
              </div>
              <h3 className="text-white font-bold text-center mb-2">SONY FX3 + 28-70 SONY GM 2 LENS</h3>
              <div className="bg-white rounded-lg p-4 flex justify-center">
                <img 
                  src="/product-sony-fx3.jpg" 
                  alt="Sony FX3" 
                  className="h-36 object-contain"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                <img 
                  src={product.owner.avatar} 
                  alt={product.owner.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">Sony fx3 + 24-70 mm g master ii lens</h3>
              <p className="text-sm text-gray-500 mb-2">4.1 mi (Shepherd's Bush Green, Hammersmith and Fulham)</p>
              <p className="font-bold">£34 - 52/day</p>
            </div>
          </div>
          
          {/* Sample Item 3 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-pink-500 p-2">
              <h3 className="text-white font-bold text-center mb-2">SONY 24-70MM F/2.8 GM 2 LENS</h3>
              <div className="bg-white rounded-lg p-4 flex justify-center">
                <img 
                  src="/product-sony-lens.jpg" 
                  alt="Sony 24-70mm lens" 
                  className="h-36 object-contain"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                <img 
                  src={product.owner.avatar} 
                  alt={product.owner.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">24-70mm sony gm 2 lens | gm ii | g master 2| g master ii</h3>
              <p className="text-sm text-gray-500 mb-2">4.1 mi (Shepherd's Bush Green, Hammersmith and Fulham)</p>
              <p className="font-bold">£21 - 30/day</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* More in Category Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">More in category <a href="#" className="text-blue-600">Camera Package Deals</a></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample Category Item 1 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-orange-300 p-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded absolute top-2 left-2 text-xs font-bold">
                POPULAR
              </div>
              <h3 className="text-white font-bold text-center mb-2">5X GOPRO 12 + SUCTION MOUNTS</h3>
              <div className="bg-white rounded-lg p-4 flex justify-center">
                <img 
                  src="/product-gopro.jpg" 
                  alt="GoPro 12" 
                  className="h-36 object-contain"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                <img 
                  src="/avatar-placeholder-2.jpg" 
                  alt="Owner" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">5x gopro 12 + suction mount</h3>
              <p className="text-sm text-gray-500 mb-2">100 m (St James's, Westminster)</p>
              <p className="font-bold">£34 - 66/day</p>
            </div>
          </div>
          
          {/* Sample Category Item 2 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-amber-200 p-2">
              <h3 className="text-black font-bold text-center mb-2">SONY FX3 + 24-70MM ZOOM + TRIPOD + SHOTGUN MIC</h3>
              <div className="bg-white rounded-lg p-4 flex justify-center">
                <img 
                  src="/product-sony-kit.jpg" 
                  alt="Sony FX3 Kit" 
                  className="h-36 object-contain"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                <img 
                  src="/avatar-placeholder-3.jpg" 
                  alt="Owner" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">Sony fx 3 fx3 full frame 4k cinema camera + 24-70mm lens</h3>
              <p className="text-sm text-gray-500 mb-2">50 m (St James's, Westminster)</p>
              <p className="font-bold">£49 - 70/day</p>
            </div>
          </div>
          
          {/* Sample Category Item 3 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="relative bg-amber-200 p-2">
              <h3 className="text-black font-bold text-center mb-2">BMPCC 6K FULL FRAME + 24-105MM ZOOM + GIMBAL</h3>
              <div className="bg-white rounded-lg p-4 flex justify-center">
                <img 
                  src="/product-blackmagic.jpg" 
                  alt="Blackmagic 6K" 
                  className="h-36 object-contain"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                <img 
                  src="/avatar-placeholder-4.jpg" 
                  alt="Owner" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">Blackmagic bmpcc 6k full frame cinema camera + 24-105mm lens</h3>
              <p className="text-sm text-gray-500 mb-2">50 m (St James's, Westminster)</p>
              <p className="font-bold">£43 - 70/day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 