'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

interface Category {
  name: string
  slug: string
  subcategories: Subcategory[]
  image?: string
}

interface Subcategory {
  name: string
  slug: string
  parentCategory: string
}

export default function CategoriesPage() {
  // Define main categories with their subcategories
  const categories: Category[] = [
    {
      name: 'ציוד בנייה וכלי עבודה',
      slug: 'construction-tools',
      image: '/images/categories/construction-tools.jpg',
      subcategories: [
        { name: 'מקדחות ומברגים', slug: 'drills-screwdrivers', parentCategory: 'construction-tools' },
        { name: 'ציוד חשמל ואנרגיה', slug: 'electricity-energy', parentCategory: 'construction-tools' },
        { name: 'מסורים וחיתוך', slug: 'sawing-cutting', parentCategory: 'construction-tools' },
        { name: 'מלטשות וליטוש', slug: 'sanding-polishing', parentCategory: 'construction-tools' },
        { name: 'כלי מדידה', slug: 'measuring-instruments', parentCategory: 'construction-tools' },
        { name: 'ציוד איוורור', slug: 'ventilation', parentCategory: 'construction-tools' },
        { name: 'כלי עבודה ידניים', slug: 'hand-tools', parentCategory: 'construction-tools' },
        { name: 'צביעה וטפטים', slug: 'painting-wallpaper', parentCategory: 'construction-tools' },
        { name: 'פיגומים', slug: 'scaffolding', parentCategory: 'construction-tools' },
        { name: 'מדחסי אוויר', slug: 'compressed-air', parentCategory: 'construction-tools' },
      ]
    },
    {
      name: 'אלקטרוניקה',
      slug: 'electronics',
      image: '/images/categories/electronics.jpg',
      subcategories: [
        { name: 'מערכות סאונד', slug: 'sound', parentCategory: 'electronics' },
        { name: 'רחפנים', slug: 'drones', parentCategory: 'electronics' },
        { name: 'מקרנים וטלוויזיות', slug: 'projectors-tv', parentCategory: 'electronics' },
        { name: 'מחשבים ואביזרים', slug: 'computers-accessories', parentCategory: 'electronics' },
        { name: 'משחקי וידאו', slug: 'video-games', parentCategory: 'electronics' },
        { name: 'סלולרי וטאבלטים', slug: 'mobile-tablets', parentCategory: 'electronics' },
        { name: 'מכשירי קשר', slug: 'two-way-radio', parentCategory: 'electronics' },
        { name: 'ציוד משרדי', slug: 'office-machinery', parentCategory: 'electronics' },
        { name: 'מסופי סליקה', slug: 'card-terminals', parentCategory: 'electronics' },
      ]
    },
    {
      name: 'סרטים וצילום',
      slug: 'film-photography',
      image: '/images/categories/photography.jpg',
      subcategories: [
        { name: 'עדשות מצלמה', slug: 'camera-lenses', parentCategory: 'film-photography' },
        { name: 'מצלמות', slug: 'cameras', parentCategory: 'film-photography' },
        { name: 'פלאשים ותאורה', slug: 'flash-lights', parentCategory: 'film-photography' },
        { name: 'חצובות וריגים', slug: 'stands-rigs', parentCategory: 'film-photography' },
        { name: 'ערכות מצלמה', slug: 'camera-packages', parentCategory: 'film-photography' },
        { name: 'מוניטורים', slug: 'monitors', parentCategory: 'film-photography' },
        { name: 'סוללות למצלמה', slug: 'camera-batteries', parentCategory: 'film-photography' },
        { name: 'כרטיסי זיכרון', slug: 'memory-cards', parentCategory: 'film-photography' },
        { name: 'רקעים לצילום', slug: 'photo-backgrounds', parentCategory: 'film-photography' },
      ]
    },
    {
      name: 'בית וגינה',
      slug: 'home-garden',
      image: '/images/categories/home-garden.jpg',
      subcategories: [
        { name: 'ציוד לבית', slug: 'home', parentCategory: 'home-garden' },
        { name: 'מכונות גינה', slug: 'garden-machinery', parentCategory: 'home-garden' },
        { name: 'סולמות', slug: 'ladders', parentCategory: 'home-garden' },
        { name: 'כלי גינה', slug: 'garden-tools', parentCategory: 'home-garden' },
        { name: 'ריהוט גן', slug: 'garden-furniture', parentCategory: 'home-garden' },
      ]
    },
    {
      name: 'אירועים ומסיבות',
      slug: 'party',
      image: '/images/categories/party.jpg',
      subcategories: [
        { name: 'הגברה, תאורה ובמה', slug: 'sound-light-scene', parentCategory: 'party' },
        { name: 'תלבושות', slug: 'clothes', parentCategory: 'party' },
        { name: 'ריהוט לאירועים', slug: 'party-furniture', parentCategory: 'party' },
        { name: 'ציוד מטבח לאירועים', slug: 'party-kitchen', parentCategory: 'party' },
        { name: 'אוהלים וגזיבו', slug: 'marquees', parentCategory: 'party' },
        { name: 'פעילויות לאירועים', slug: 'party-activities', parentCategory: 'party' },
        { name: 'קישוטים לאירועים', slug: 'party-decorations', parentCategory: 'party' },
        { name: 'ערכות לאירועים', slug: 'party-combos', parentCategory: 'party' },
        { name: 'חימום לפטיו', slug: 'patio-heaters', parentCategory: 'party' },
      ]
    },
    {
      name: 'ספורט ופנאי',
      slug: 'sports-leisure',
      image: '/images/categories/sports.jpg',
      subcategories: [
        { name: 'כלי נגינה', slug: 'musical-instruments', parentCategory: 'sports-leisure' },
        { name: 'אופניים', slug: 'cycling', parentCategory: 'sports-leisure' },
        { name: 'חיי שטח', slug: 'outdoor-life', parentCategory: 'sports-leisure' },
        { name: 'משחקים ותחביבים', slug: 'play-hobby', parentCategory: 'sports-leisure' },
        { name: 'ספורט', slug: 'sports', parentCategory: 'sports-leisure' },
        { name: 'ספורט ימי', slug: 'watersports', parentCategory: 'sports-leisure' },
        { name: 'אימון וכושר', slug: 'training-gym', parentCategory: 'sports-leisure' },
        { name: 'ספורט חורף', slug: 'winter-sports', parentCategory: 'sports-leisure' },
        { name: 'נסיעות וטיולים', slug: 'travel', parentCategory: 'sports-leisure' },
      ]
    },
    {
      name: 'רכב',
      slug: 'vehicle',
      image: '/images/categories/vehicle.jpg',
      subcategories: [
        { name: 'אביזרי רכב', slug: 'car-accessories', parentCategory: 'vehicle' },
        { name: 'כלי עבודה לרכב', slug: 'workshop', parentCategory: 'vehicle' },
        { name: 'סירות', slug: 'boats', parentCategory: 'vehicle' },
        { name: 'קרוואנים', slug: 'recreational-vehicle', parentCategory: 'vehicle' },
        { name: 'נגררים', slug: 'trailers', parentCategory: 'vehicle' },
        { name: 'אופנועים ואביזרים', slug: 'mc-accessories', parentCategory: 'vehicle' },
      ]
    },
    {
      name: 'אחר',
      slug: 'other',
      image: '/images/categories/other.jpg',
      subcategories: [
        { name: 'נכסים', slug: 'premises', parentCategory: 'other' },
        { name: 'שונות', slug: 'misc', parentCategory: 'other' },
      ]
    },
  ]

  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map(cat => [cat.slug, false]))
  )

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categorySlug]: !prev[categorySlug]
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">כל הקטגוריות</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.slug} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="relative h-48 bg-gray-200">
              {category.image ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={category.image} 
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">אין תמונה</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center">
                <Link 
                  href={`/categories/${category.slug}`} 
                  className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                >
                  {category.name}
                </Link>
                
                <button 
                  onClick={() => toggleCategory(category.slug)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  aria-label={expandedCategories[category.slug] ? "הסתר תת-קטגוריות" : "הצג תת-קטגוריות"}
                >
                  {expandedCategories[category.slug] ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
              </div>
              
              {expandedCategories[category.slug] && (
                <div className="mt-3 grid grid-cols-1 gap-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      href={`/categories/${category.slug}/${subcategory.slug}`}
                      key={subcategory.slug}
                      className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2 py-1.5 text-sm"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 