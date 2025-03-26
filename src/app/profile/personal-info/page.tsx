'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

function PersonalInfoContent() {
  const { user, profile, isLoading, isAuthenticated, updateProfile } = useUserAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [alternativeEmail, setAlternativeEmail] = useState('')
  const [addressStreet, setAddressStreet] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressState, setAddressState] = useState('')
  const [addressPostalCode, setAddressPostalCode] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirectedFrom=/profile/personal-info')
    }
  }, [isLoading, isAuthenticated, router, isClient])

  // Loading profile data
  useEffect(() => {
    if (!isClient) return
    
    if (profile) {
      setDisplayName(profile.display_name || '')
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setAlternativeEmail(profile.alternative_email || '')
      setAddressStreet(profile.address_street || '')
      setAddressCity(profile.address_city || '')
      setAddressState(profile.address_state || '')
      setAddressPostalCode(profile.address_postal_code || '')
    }
  }, [profile, isClient])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      await updateProfile({
        display_name: displayName,
        full_name: fullName,
        phone,
        alternative_email: alternativeEmail,
        address_street: addressStreet,
        address_city: addressCity,
        address_state: addressState,
        address_postal_code: addressPostalCode
      })
      
      setMessage({ type: 'success', text: 'הפרופיל עודכן בהצלחה' })
      setIsEditing(false)
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'אירעה שגיאה בעדכון הפרופיל' })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
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
        <h1 className="text-2xl font-bold text-gray-900 mt-2">מידע אישי</h1>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">פרטי פרופיל</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">עריכת פרטים אישיים ומידע על החשבון שלך.</p>
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
          <form onSubmit={handleSaveProfile} className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  כתובת אימייל
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    disabled
                    className="bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={user?.email || ''}
                  />
                  <p className="mt-1 text-xs text-gray-500">לא ניתן לשנות את כתובת האימייל הראשית.</p>
                </div>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  שם תצוגה
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="displayName"
                    id="displayName"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  שם מלא
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    dir="ltr"
                  />
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
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">כתובת</h3>
                
                <div>
                  <label htmlFor="addressStreet" className="block text-sm font-medium text-gray-700">
                    רחוב ומספר
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="addressStreet"
                      id="addressStreet"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="addressCity" className="block text-sm font-medium text-gray-700">
                    עיר
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="addressCity"
                      id="addressCity"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="addressState" className="block text-sm font-medium text-gray-700">
                      מחוז
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="addressState"
                        id="addressState"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="addressPostalCode" className="block text-sm font-medium text-gray-700">
                      מיקוד
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="addressPostalCode"
                        id="addressPostalCode"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-right"
                        value={addressPostalCode}
                        onChange={(e) => setAddressPostalCode(e.target.value)}
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">כתובת אימייל</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">שם תצוגה</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {displayName || 'לא הוגדר'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">שם מלא</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {fullName || 'לא הוגדר'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">מספר טלפון</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="ltr">
                  {phone || 'לא הוגדר'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">אימייל חלופי</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="ltr">
                  {alternativeEmail || 'לא הוגדר'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">כתובת</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {addressStreet ? (
                    <>
                      {addressStreet}
                      {addressCity && <>, {addressCity}</>}
                      {addressState && <>, {addressState}</>}
                      {addressPostalCode && <> {addressPostalCode}</>}
                    </>
                  ) : (
                    'לא הוגדרה'
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">הצטרף בתאריך</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : 'לא זמין'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}

// Export a client-only version of the component to avoid hydration errors
export default dynamic(() => Promise.resolve(PersonalInfoContent), { ssr: false }); 