'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUserAuth } from '@/context/UserAuthContext'
import { createClient } from '@/utils/supabase/client'

export default function CreateRentalListing() {
  const { user, isLoading, isAuthenticated } = useUserAuth()
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bucketError, setBucketError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_per_day: '',
    location: '',
    images: [] as string[],
  })

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirectedFrom=/rentals/create')
    }
    
    // Initialize storage bucket if authenticated
    if (isAuthenticated) {
      initializeStorage()
    }
  }, [isLoading, isAuthenticated, router])
  
  const initializeStorage = async () => {
    try {
      // Check if bucket exists
      const { data: bucketExists, error: bucketError } = await supabase
        .storage
        .getBucket('images')
      
      if (bucketError) {
        // Log the error but don't throw it - the bucket might exist but we don't have permission to check
        console.log('Note: Unable to check bucket existence. This is normal if RLS is enabled.')
      }
      
      // Don't try to create the bucket - assume it exists or will be created by admin
      // Just verify we can access it by listing files
      const { data: files, error: listError } = await supabase
        .storage
        .from('images')
        .list()
      
      if (listError) {
        console.error('Error accessing storage:', listError.message)
        setBucketError('Unable to access storage. Please contact support if this persists.')
      }
    } catch (error: any) {
      console.error('Error initializing storage:', error.message)
      setBucketError(error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Format data for database insertion
      const itemData = {
        owner_id: user?.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price_per_day: parseFloat(formData.price_per_day),
        location: formData.location,
        images: uploadedImages, // Store the array of image URLs directly
        status: 'active',
      }
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('items')
        .insert(itemData)
        .select()
      
      if (error) {
        throw error
      }
      
      alert('הפריט נוסף בהצלחה!')
      router.push('/rentals/manage')
    } catch (error: any) {
      console.error('Error creating listing:', error.message)
      alert(`שגיאה בשמירת הפריט: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    // Check for bucket error
    if (bucketError) {
      alert(`לא ניתן להעלות תמונות: ${bucketError}`)
      return
    }
    
    const files = Array.from(e.target.files)
    const newImages: string[] = [...uploadedImages]
    
    // Limit to a maximum of 5 images
    const totalImages = uploadedImages.length + files.length
    if (totalImages > 5) {
      alert('ניתן להעלות עד 5 תמונות בלבד')
      return
    }
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`הקובץ "${file.name}" גדול מדי. גודל מקסימלי הוא 10MB.`)
        continue
      }
      
      // Create a unique file path for the image in Storage
      const filePath = `items/${user?.id}/${new Date().getTime()}-${file.name}`
      
      try {
        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          throw error
        }
        
        // Get the public URL for the image
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)
        
        // Store the clean URL string
        newImages.push(publicUrl.toString())
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      } catch (error: any) {
        console.error('Error uploading image:', error.message)
        alert(`שגיאה בהעלאת התמונה "${file.name}": ${error.message}`)
      }
    }
    
    setUploadedImages(newImages)
    setFormData(prev => ({ ...prev, images: newImages }))
    setUploadProgress(0)
  }
  
  const removeImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">פרסם פריט להשכרה</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {/* 1. פרטי פריט */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">1. פרטי פריט</h2>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  שם הפריט
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="לדוגמה: מצלמת קנון 5D Mark IV"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* 2. קטגוריה */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">2. קטגוריה</h2>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  בחר קטגוריה
                </label>
                <select
                  name="category"
                  id="category"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">בחר קטגוריה</option>
                  <option value="cameras">מצלמות וצילום</option>
                  <option value="electronics">אלקטרוניקה</option>
                  <option value="camping">ציוד קמפינג</option>
                  <option value="tools">כלי עבודה</option>
                  <option value="music">ציוד מוזיקה</option>
                  <option value="sports">ספורט</option>
                  <option value="garden">גינה וחצר</option>
                  <option value="party">אירועים ומסיבות</option>
                  <option value="travel">טיולים ונסיעות</option>
                  <option value="other">אחר</option>
                </select>
              </div>
            </div>
            
            {/* 3. תיאור */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">3. תיאור</h2>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  תיאור הפריט
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="תאר את הפריט בפירוט, כולל מצב, גיל, מפרט וכל מידע רלוונטי אחר."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* 4. תמונות */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">4. תמונות</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  העלה תמונות (עד 5 תמונות)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>העלה תמונות</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          multiple 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadedImages.length >= 5 || isSubmitting}
                        />
                      </label>
                      <p className="pr-1">או גרור ושחרר</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF עד 10MB</p>
                    
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        <p className="text-xs text-gray-500 mt-1">מעלה... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Preview uploaded images */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">תמונות שהועלו:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                            <img src={url} alt={`תמונה ${index + 1}`} className="object-cover object-center" />
                          </div>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 5. מחיר */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">5. מחיר</h2>
              <div>
                <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700">
                  מחיר ליום (₪)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₪</span>
                  </div>
                  <input
                    type="number"
                    name="price_per_day"
                    id="price_per_day"
                    required
                    min="1"
                    step="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-8"
                    placeholder="50"
                    value={formData.price_per_day}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  ניתן לשנות את המחיר בכל עת
                </p>
              </div>
            </div>
            
            {/* 6. מיקום */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">6. מיקום</h2>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  מיקום
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="לדוגמה: תל אביב, מרכז"
                  value={formData.location}
                  onChange={handleChange}
                />
                <p className="mt-2 text-sm text-gray-500">
                  המיקום יוצג לשוכרים פוטנציאליים
                </p>
              </div>
            </div>
            
            {/* 7. פרסם פריט */}
            <div>
              <h2 className="text-xl font-semibold mb-4">7. פרסם פריט</h2>
              <div>
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <p className="text-sm text-blue-700">
                    לאחר הפרסום, הפריט שלך יהיה זמין להשכרה באתר. תוכל לעדכן או להסיר את הפריט בכל עת דרך אזור ניהול ההשכרות.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'מפרסם...' : 'פרסם פריט'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* App Download Promotion */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-2">הורד את אפליקציית Taskirli</h3>
            <p className="mb-4">נהל את ההשכרות שלך בקלות מהנייד, קבל התראות על הזמנות חדשות, ופרסם פריטים נוספים בכל מקום!</p>
            
            <div className="flex flex-col space-y-2">
              <a href="#" className="bg-black rounded-lg px-4 py-2 flex items-center justify-center hover:bg-gray-900">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-2">
                  <path d="M17.71,4.01C16.26,2.87,14.29,2,12,2C9.72,2,7.74,2.87,6.29,4.01C4.83,5.16,4,6.83,4,8.5V9h16V8.5C20,6.83,19.17,5.16,17.71,4.01z"></path>
                  <path d="M2,11v2h20v-2H2z M12,20l4-4h-2v-1h-4v1H8L12,20z"></path>
                </svg>
                <span>הורד ל-iPhone</span>
              </a>
              <a href="#" className="bg-black rounded-lg px-4 py-2 flex items-center justify-center hover:bg-gray-900">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-2">
                  <path d="M3,20.5V3.5C3,2.67,3.67,2,4.5,2h0C5.33,2,6,2.67,6,3.5v17c0,0.83-0.67,1.5-1.5,1.5h0C3.67,22,3,21.33,3,20.5z"></path>
                  <path d="M20.5,10H6v4h14.5c0.83,0,1.5-0.67,1.5-1.5v-1C22,10.67,21.33,10,20.5,10z"></path>
                </svg>
                <span>הורד ל-Android</span>
              </a>
            </div>
          </div>
          
          {/* Dropoff Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">מיקום מסירה חכם</h3>
            </div>
            <p className="text-gray-600 mb-4">
              ציון מיקום מדויק יעזור לשוכרים פוטנציאליים למצוא את הפריט שלך ביתר קלות. באפשרותך לציין אזור כללי לצורך פרטיות.
            </p>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>עצה:</strong> אם אתה גר באזור מרוחק, שקול להציע נקודת מסירה נוחה באזור מרכזי יותר כדי למשוך יותר שוכרים.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 