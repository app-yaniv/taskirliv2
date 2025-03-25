'use client'

import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { name: 'מצלמות', image: 'https://picsum.photos/400/300?random=1', count: '1,234' },
  { name: 'ציוד די ג\'יי', image: 'https://picsum.photos/400/300?random=2', count: '856' },
  { name: 'ציוד קמפינג', image: 'https://picsum.photos/400/300?random=3', count: '2,345' },
  { name: 'כלי עבודה', image: 'https://picsum.photos/400/300?random=4', count: '3,456' },
  { name: 'ציוד למסיבות', image: 'https://picsum.photos/400/300?random=5', count: '789' },
  { name: 'ציוד ספורט', image: 'https://picsum.photos/400/300?random=6', count: '1,567' },
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