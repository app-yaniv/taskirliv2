'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart } from 'lucide-react'

const featuredItems = [
  {
    id: 1,
    name: 'מצלמת Sony A7III',
    price: '₪180/יום',
    rating: 4.8,
    reviews: 128,
    image: 'https://picsum.photos/400/300?random=7',
    location: 'תל אביב',
  },
  {
    id: 2,
    name: 'קונטרולר DJ מקצועי',
    price: '₪140/יום',
    rating: 4.9,
    reviews: 89,
    image: 'https://picsum.photos/400/300?random=8',
    location: 'חיפה',
  },
  {
    id: 3,
    name: 'אוהל ל-4 אנשים',
    price: '₪100/יום',
    rating: 4.7,
    reviews: 156,
    image: 'https://picsum.photos/400/300?random=9',
    location: 'ירושלים',
  },
  {
    id: 4,
    name: 'סט כלי עבודה חשמליים',
    price: '₪60/יום',
    rating: 4.6,
    reviews: 234,
    image: 'https://picsum.photos/400/300?random=10',
    location: 'באר שבע',
  },
  {
    id: 5,
    name: 'מערכת הגברה למסיבות',
    price: '₪160/יום',
    rating: 4.8,
    reviews: 167,
    image: 'https://picsum.photos/400/300?random=11',
    location: 'רמת גן',
  },
  {
    id: 6,
    name: 'אופני הרים',
    price: '₪120/יום',
    rating: 4.7,
    reviews: 145,
    image: 'https://picsum.photos/400/300?random=12',
    location: 'הרצליה',
  },
]

export default function FeaturedItems() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            פריטים מובילים
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            בדוק את הפריטים הפופולריים ביותר להשכרה
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <button className="absolute top-2 left-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <span className="text-lg font-semibold text-[#5E3EBA]">{item.price}</span>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="mr-1 text-sm text-gray-600">{item.rating}</span>
                    <span className="mr-1 text-sm text-gray-500">({item.reviews} ביקורות)</span>
                  </div>
                  <span className="mr-4 text-sm text-gray-500">{item.location}</span>
                </div>
                <Link
                  href={`/product/${item.id}`}
                  className="mt-4 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#5E3EBA] hover:bg-[#4A2F9E]"
                >
                  פרטים נוספים
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 