'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CategorySelectorProps {
  selectedCategory: string;
  onChange: (category: string) => void;
}

// Using the same categories as in the Categories.tsx component
const categories = [
  { 
    name: 'ציוד בנייה וכלי עבודה',
    image: '/images/categories/construction-tools.jpg',
    slug: 'construction-tools',
    color: 'bg-amber-500'
  },
  { 
    name: 'אלקטרוניקה',
    image: '/images/categories/electronics.jpg',
    slug: 'electronics',
    color: 'bg-blue-500'
  },
  {
    name: 'סרטים וצילום',
    image: '/images/categories/photography.jpg',
    slug: 'film-photography',
    color: 'bg-purple-500'
  },
  {
    name: 'בית וגינה',
    image: '/images/categories/home-garden.jpg',
    slug: 'home-garden',
    color: 'bg-green-500'
  },
  {
    name: 'אירועים ומסיבות',
    image: '/images/categories/party.jpg',
    slug: 'party',
    color: 'bg-pink-500'
  },
  { 
    name: 'ספורט ופנאי',
    image: '/images/categories/sports.jpg',
    slug: 'sports-leisure',
    color: 'bg-red-500'
  },
]

export default function CategorySelector({ selectedCategory, onChange }: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredCategories = searchTerm 
    ? categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories

  return (
    <div className="space-y-6" dir="rtl">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
          </svg>
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pr-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
          placeholder="חפש קטגוריה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div 
            key={category.slug}
            className={`cursor-pointer rounded-lg overflow-hidden shadow-sm border-2 transition-all ${
              selectedCategory === category.slug 
                ? 'border-blue-500 scale-105 shadow-md' 
                : 'border-transparent hover:shadow-md'
            }`}
            onClick={() => onChange(category.slug)}
          >
            <div className={`relative h-32 ${category.color}`}>
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                onError={(e) => {
                  // If image fails to load, we'll rely on the colored background
                  const imgElement = e.currentTarget;
                  imgElement.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-blue-50 p-4 rounded-lg mt-6 text-center">
          <p className="text-blue-700">
            נבחרה קטגוריה: <span className="font-bold">
              {categories.find(c => c.slug === selectedCategory)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  )
} 