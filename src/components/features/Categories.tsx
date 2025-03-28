'use client'

import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { 
    name: 'ציוד בנייה וכלי עבודה',
    image: '/images/categories/construction-tools.jpg',
    slug: 'construction-tools',
    count: '2,345',
    color: 'bg-amber-500'
  },
  { 
    name: 'אלקטרוניקה',
    image: '/images/categories/electronics.jpg',
    slug: 'electronics',
    count: '856',
    color: 'bg-blue-500'
  },
  {
    name: 'סרטים וצילום',
    image: '/images/categories/photography.jpg',
    slug: 'film-photography',
    count: '789',
    color: 'bg-purple-500'
  },
  {
    name: 'בית וגינה',
    image: '/images/categories/home-garden.jpg',
    slug: 'home-garden',
    count: '3,456',
    color: 'bg-green-500'
  },
  {
    name: 'אירועים ומסיבות',
    image: '/images/categories/party.jpg',
    slug: 'party',
    count: '1,234',
    color: 'bg-pink-500'
  },
  { 
    name: 'ספורט ופנאי',
    image: '/images/categories/sports.jpg',
    slug: 'sports-leisure',
    count: '1,567',
    color: 'bg-red-500'
  },
]

export default function Categories() {
  return (
    <section className="py-12 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            קטגוריות פופולריות
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            מצא מה שאתה צריך בקטגוריות ההשכרה הפופולריות שלנו
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.slug}`}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className={`aspect-w-16 aspect-h-9 relative ${category.color}`} style={{height: "200px"}}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  onError={(e) => {
                    // If image fails to load, we'll rely on the colored background
                    const imgElement = e.currentTarget;
                    imgElement.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-300">{category.count} פריטים</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/categories" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            צפה בכל הקטגוריות
          </Link>
        </div>
      </div>
    </section>
  )
} 