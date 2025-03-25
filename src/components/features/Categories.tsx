'use client'

import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { 
    name: 'ציוד קמפינג',
    image: 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg',
    count: '2,345'
  },
  { 
    name: 'ציוד די ג\'יי',
    image: 'https://images.pexels.com/photos/4090902/pexels-photo-4090902.jpeg',
    count: '856'
  },
  { 
    name: 'ציוד למסיבות',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
    count: '789'
  },
  { 
    name: 'כלי עבודה',
    image: 'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg',
    count: '3,456'
  },
  { 
    name: 'מצלמות',
    image: 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg',
    count: '1,234'
  },
  { 
    name: 'ציוד ספורט',
    image: 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg',
    count: '1,567'
  },
]

export default function Categories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            קטגוריות פופולריות
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            מצא את מה שאתה צריך בקטגוריות ההשכרה הפופולריות שלנו
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{category.count} פריטים זמינים</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 