'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useParams } from 'next/navigation'

interface Item {
  id: string
  title: string
  description: string
  price_per_day: number
  category: string
  subcategory: string
  images: string[]
  status: string
  location: string
  owner_id: string
  profiles: {
    display_name: string
    avatar_url: string | null
  }
}

interface CategoryInfo {
  name: string
  slug: string
  subcategories: {
    name: string
    slug: string
    parentCategory: string
  }[]
}

export default function SubcategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const subcategorySlug = params.subcategory as string
  
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null)
  const [subcategoryName, setSubcategoryName] = useState('')
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({})

  // All category data (this should match your categories page)
  const categories = [
    {
      name: 'ציוד בנייה וכלי עבודה',
      slug: 'construction-tools',
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
    // Include all other categories here (omitted for brevity)
  ]

  useEffect(() => {
    // Find the category and subcategory information
    const category = categories.find(cat => cat.slug === categorySlug)
    if (category) {
      setCategoryInfo(category)
      
      const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug)
      if (subcategory) {
        setSubcategoryName(subcategory.name)
        fetchItems()
      } else {
        setError('תת-קטגוריה לא נמצאה')
        setLoading(false)
      }
    } else {
      setError('קטגוריה לא נמצאה')
      setLoading(false)
    }
  }, [categorySlug, subcategorySlug])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // In a real app, you'd have a subcategory field or tag.
      // This is a simplified example - adapt to your database schema
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('category', categorySlug)
        .eq('subcategory', subcategorySlug) // Assuming you have a subcategory field
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      setItems(data || [])
    } catch (err: any) {
      console.error('שגיאה בטעינת פריטים:', err)
      setError('אירעה שגיאה בטעינת הפריטים. אנא נסה שוב מאוחר יותר.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (id: string) => {
    setImageFailed(prev => ({ ...prev, [id]: true }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">
          דף הבית
        </Link>
        <ChevronRight className="mx-2 h-5 w-5" />
        <Link href="/categories" className="hover:text-blue-600">
          קטגוריות
        </Link>
        <ChevronRight className="mx-2 h-5 w-5" />
        {categoryInfo && (
          <>
            <Link href={`/categories/${categorySlug}`} className="hover:text-blue-600">
              {categoryInfo.name}
            </Link>
            <ChevronRight className="mx-2 h-5 w-5" />
          </>
        )}
        <span className="text-gray-900 font-medium">{subcategoryName}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{subcategoryName}</h1>
        
        {/* Filter button */}
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <SlidersHorizontal className="h-4 w-4 ml-2" />
          סינון
        </button>
      </div>

      {/* Related subcategories */}
      {categoryInfo && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-3">תת-קטגוריות אחרות ב{categoryInfo.name}</h2>
          <div className="flex flex-wrap gap-2">
            {categoryInfo.subcategories
              .filter(subcat => subcat.slug !== subcategorySlug)
              .map(subcat => (
                <Link
                  href={`/categories/${categorySlug}/${subcat.slug}`}
                  key={subcat.slug}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-800"
                >
                  {subcat.name}
                </Link>
              ))
            }
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="mr-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="mr-3 text-gray-700">טוען פריטים...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין פריטים בתת-קטגוריה זו</h3>
          <p className="text-gray-600 mb-4">לא נמצאו פריטים זמינים להשכרה בתת-קטגוריה {subcategoryName}.</p>
          {categoryInfo && (
            <Link 
              href={`/categories/${categorySlug}`} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              חזרה ל{categoryInfo.name}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link href={`/rent/${item.id}`} key={item.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9 relative bg-gray-200">
                {item.images?.[0] && !imageFailed[item.id] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">אין תמונה</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{item.title}</h3>
                {item.location && (
                  <p className="text-sm text-gray-500 mb-2">{item.location}</p>
                )}
                <p className="text-blue-600 font-bold mt-2">{formatPrice(item.price_per_day)} / יום</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 