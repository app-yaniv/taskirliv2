'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { updateUserProfile } from '@/utils/supabase/profile'

export default function ContactInfoPage() {
  const { user, isLoading, isAuthenticated } = useUserAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [alternativeEmail, setAlternativeEmail] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirectedFrom=/profile/contact-info')
    }
  }, [isLoading, isAuthenticated, router])

  // Loading profile data from user metadata
  useEffect(() => {
    if (user) {
      setEmail(user.email || '')
      setPhone(user.user_metadata?.phone || '')
      setAlternativeEmail(user.user_metadata?.alternativeEmail || '')
      // Set address fields from user metadata if available
      setStreet(user.user_metadata?.address?.street || '')
      setCity(user.user_metadata?.address?.city || '')
      setZip(user.user_metadata?.address?.zip || '')
    }
  }, [user])

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Update user metadata in Supabase
      const { error } = await updateUserProfile({
        phone,
        alternativeEmail,
        address: {
          street,
          city,
          zip
        }
      })
      
      if (error) throw error
      
      setMessage({ type: 'success', text: 'פרטי הקשר והכתובת עודכנו בהצלחה' })
      setIsEditing(false)
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating contact info:', error)
      setMessage({ type: 'error', text: 'אירעה שגיאה בעדכון פרטי הקשר והכתובת' })
    } finally {
      setIsSaving(false)
    }
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <Link href="/profile" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowRight size={16} className="mr-1 transform rotate-180 rtl:rotate-0" />
          חזרה לפרופיל
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">פרטי קשר</h1>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">ניהול פרטי קשר</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">עדכון אמצעי התקשרות וכתובת למשלוח.</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ערוך
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveContact} className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3">אמצעי התקשרות</h3>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  כתובת אימייל ראשית
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    disabled
                    className="bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={email}
                  />
                  <p className="mt-1 text-xs text-gray-500">לא ניתן לשנות את כתובת האימייל הראשית.</p>
                </div>
              </div>

              <div>
                <label htmlFor="alternativeEmail" className="block text-sm font-medium text-gray-700">
                  כתובת אימייל חלופית
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="alternativeEmail"
                    id="alternativeEmail"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={alternativeEmail}
                    onChange={(e) => setAlternativeEmail(e.target.value)}
                    placeholder="כתובת אימייל חלופית (אופציונלי)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  מספר טלפון
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-right"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05X-XXXXXXX"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">כתובת למשלוח</h3>
              </div>
              
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  רחוב ומספר בית
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="street"
                    id="street"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="שם הרחוב ומספר הבית"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  עיר / יישוב
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="שם העיר או היישוב"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  מיקוד
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-right"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="מיקוד"
                    dir="ltr"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                      שומר...
                    </>
                  ) : 'שמור'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200">
            <dl>
              <div className="px-4 py-4 bg-gray-50">
                <h3 className="text-md font-medium text-gray-800">אמצעי התקשרות</h3>
              </div>
            
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">כתובת אימייל ראשית</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {email}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">כתובת אימייל חלופית</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {alternativeEmail || 'לא הוגדר'}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">מספר טלפון</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="ltr">
                  {phone || 'לא הוגדר'}
                </dd>
              </div>
              
              <div className="px-4 py-4 bg-gray-50">
                <h3 className="text-md font-medium text-gray-800">כתובת למשלוח</h3>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">רחוב ומספר בית</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {street || 'לא הוגדר'}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">עיר / יישוב</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {city || 'לא הוגדר'}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">מיקוד</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="ltr">
                  {zip || 'לא הוגדר'}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">הגדרת התראות</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Link href="/profile/notifications" className="text-blue-600 hover:text-blue-800">
                    ניהול העדפות התראות
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
} 