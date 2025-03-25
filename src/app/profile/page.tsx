'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/context/UserAuthContext'
import { SettingsSection } from '@/components/features/SettingsSection'
import { SettingsItem } from '@/components/features/SettingsItem'
import { 
  User, 
  Phone, 
  CreditCard, 
  Shield, 
  Bell, 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Lightbulb,
  Moon
} from 'lucide-react'

export default function Profile() {
  const { user, isLoading, isAuthenticated, signOut } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirectedFrom=/profile')
    }
  }, [isLoading, isAuthenticated, router])

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">פרופיל והגדרות</h1>
        <button
          onClick={() => signOut()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          התנתקות
        </button>
      </div>
      
      <SettingsSection title="הפרופיל שלי">
        <SettingsItem 
          icon={<User size={20} />} 
          title="מידע אישי" 
          description="עריכת פרטים אישיים ומידע על החשבון שלך" 
          href="/profile/personal-info" 
        />
        <SettingsItem 
          icon={<Phone size={20} />} 
          title="פרטי קשר" 
          description="ניהול מספר טלפון וכתובות דוא״ל" 
          href="/profile/contact-info" 
        />
        <SettingsItem 
          icon={<CreditCard size={20} />} 
          title="אמצעי תשלום" 
          description="הוספה וניהול כרטיסי אשראי ואמצעי תשלום" 
          href="/profile/payment-methods" 
        />
        <SettingsItem 
          icon={<Shield size={20} />} 
          title="אבטחה וכניסה" 
          description="הגדרות סיסמה ואימות דו-שלבי" 
          href="/profile/security" 
        />
        <SettingsItem 
          icon={<Bell size={20} />} 
          title="התראות והודעות" 
          description="ניהול העדפות התראות ועדכונים" 
          href="/profile/notifications" 
        />
      </SettingsSection>
      
      <SettingsSection title="עזרה">
        <SettingsItem 
          icon={<HelpCircle size={20} />} 
          title="מרכז עזרה" 
          description="שאלות נפוצות ומדריכים" 
          href="/help" 
        />
        <SettingsItem 
          icon={<MessageCircle size={20} />} 
          title="תמיכה טכנית" 
          description="יצירת קשר עם צוות התמיכה" 
          href="/help/support" 
        />
        <SettingsItem 
          icon={<FileText size={20} />} 
          title="תנאי שימוש ופרטיות" 
          description="מדיניות האתר, תנאי שימוש והגנת פרטיות" 
          href="/legal" 
        />
      </SettingsSection>
      
      <SettingsSection title="בטא">
        <SettingsItem 
          icon={<Lightbulb size={20} />} 
          title="תכונות ניסיוניות" 
          description="הפעלת תכונות חדשות בגרסת בטא" 
          href="/beta-features" 
        />
        <SettingsItem 
          icon={<Moon size={20} />} 
          title="מצב תצוגה" 
          description="בחירת ערכת צבעים לממשק" 
          href="/display-settings"
          value="בהיר" 
        />
      </SettingsSection>
    </div>
  )
} 