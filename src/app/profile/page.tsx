'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import { 
  User, 
  ChevronRight, 
  HelpCircle, 
  MessageCircle, 
  Settings, 
  Moon, 
  Sun, 
  Info, 
  Bell, 
  Lock 
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

// Settings section component
const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-gray-900 mb-4">{title}</h2>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {children}
      </div>
    </div>
  );
};

// Settings item component with right chevron for RTL layout
const SettingsItem = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  value 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description?: string, 
  onClick: () => void, 
  value?: string 
}) => {
  return (
    <div 
      className="flex items-center justify-between px-6 py-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition duration-150"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="text-gray-500 ml-4">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
      </div>
      <div className="flex items-center">
        {value && <span className="text-sm text-gray-500 ml-2">{value}</span>}
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default function Profile() {
  const { user, isLoading, isAuthenticated, signOut, updateUserMetadata } = useUserAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeSection, setActiveSection] = useState<'profile' | 'edit'>('profile')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirectedFrom=/profile')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      console.log('User metadata from context:', user.user_metadata)
      setDisplayName(user.user_metadata?.name || '')
      setPhone(user.user_metadata?.phone || '')
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      console.log('Sending profile update:', { name: displayName, phone: phone })
      
      const { success, error } = await updateUserMetadata({
        name: displayName,
        phone: phone,
      })
      
      console.log('Profile update result:', { success, error })
      
      if (!success) {
        throw new Error(error)
      }
      
      setMessage({ type: 'success', text: 'הפרופיל עודכן בהצלחה' })
      setActiveSection('profile')
      
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error: any) {
      console.error('Error updating profile:', error.message)
      setMessage({ type: 'error', text: `אירעה שגיאה בעדכון הפרופיל: ${error.message}` })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditClick = () => {
    setActiveSection('edit')
  }

  const handleCancelEdit = () => {
    setActiveSection('profile')
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">פרופיל והגדרות</h1>
        <button
          onClick={() => signOut()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          התנתקות
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {activeSection === 'profile' ? (
        <>
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{displayName || 'שם משתמש'}</h2>
                <p className="text-gray-600">{phone || 'לא צוין'}</p>
              </div>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                עריכה
              </button>
            </div>
          </div>

          <SettingsSection title="הגדרות">
            <SettingsItem
              icon={<User size={20} />}
              title="מידע אישי"
              description="עריכת פרטים אישיים"
              onClick={() => navigateTo('/profile/personal-info')}
            />
            <SettingsItem
              icon={<Lock size={20} />}
              title="אבטחה"
              description="שינוי סיסמה והגדרות אבטחה"
              onClick={() => navigateTo('/profile/security')}
            />
            <SettingsItem
              icon={<Bell size={20} />}
              title="התראות"
              description="הגדרות התראות"
              onClick={() => navigateTo('/profile/notifications')}
            />
          </SettingsSection>

          <SettingsSection title="עזרה ותמיכה">
            <SettingsItem
              icon={<HelpCircle size={20} />}
              title="מרכז עזרה"
              description="שאלות נפוצות ומדריכים"
              onClick={() => navigateTo('/help')}
            />
            <SettingsItem
              icon={<MessageCircle size={20} />}
              title="צור קשר"
              description="יצירת קשר עם התמיכה"
              onClick={() => navigateTo('/contact')}
            />
          </SettingsSection>
        </>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSaveProfile}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מספר טלפון
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'שומר...' : 'שמור'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 