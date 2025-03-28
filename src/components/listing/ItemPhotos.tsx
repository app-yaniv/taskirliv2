'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface ItemPhotosProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export default function ItemPhotos({ photos, onChange }: ItemPhotosProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    handleFiles(files)
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    setUploadError(null)
    
    if (photos.length + files.length > 10) {
      setUploadError('ניתן להעלות עד 10 תמונות')
      return
    }
    
    // This is a mock implementation that creates URL objects
    // In a real app, you would upload these to a server/storage
    const newPhotos = [...photos]
    
    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('ניתן להעלות תמונות בלבד')
        return
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('גודל התמונה חייב להיות פחות מ-5MB')
        return
      }
      
      const url = URL.createObjectURL(file)
      newPhotos.push(url)
    })
    
    onChange(newPhotos)
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    onChange(newPhotos)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="text-blue-800 font-medium mb-2">טיפים לתמונות מוצלחות:</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>העלה תמונות בפורמט לנדסקייפ (4:3) לתצוגה אופטימלית</li>
          <li>ודא שהתמונות ברורות, באור טוב וחדות</li>
          <li>הראה את הפריט מזוויות שונות</li>
          <li>הוסף תמונות של אביזרים או חלקים שמגיעים עם הפריט</li>
        </ul>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="mt-4 flex text-sm text-gray-600 justify-center">
          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <span>העלה קבצים</span>
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              accept="image/*"
              multiple
              className="sr-only" 
              onChange={handleFileChange}
            />
          </label>
          <p className="pr-1">או גרור ושחרר</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          PNG, JPG, GIF עד 5MB
        </p>
      </div>

      {uploadError && (
        <div className="text-red-500 text-sm mt-2">{uploadError}</div>
      )}

      {photos.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">התמונות שהועלו:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={photo}
                  alt={`תמונה ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-1">
                    תמונה ראשית
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {photos.length} מתוך 10 תמונות
          </p>
        </div>
      )}
    </div>
  )
} 