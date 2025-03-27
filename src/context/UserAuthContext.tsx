'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { getUserProfile, Profile, updateUserProfile } from '@/utils/supabase/profile'
import { storage } from '@/utils/storage'

// Maximum time to wait for profile fetch (5 seconds)
const FETCH_TIMEOUT = 5000
// How often to sync the profile (15 minutes)
const SYNC_INTERVAL = 15 * 60 * 1000

export type UserAuthContextType = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  updateProfile: async () => {}
})

// Create a static date string to avoid hydration mismatch
const STATIC_DATE = '2023-01-01T00:00:00.000Z'

// Helper to create a mock profile with static dates
const createMockProfile = (userId: string, email?: string): Profile => ({
  id: userId,
  created_at: STATIC_DATE,
  updated_at: STATIC_DATE,
  display_name: email?.split('@')[0] || null,
  full_name: null,
  phone: null,
  alternative_email: null,
  address_street: null,
  address_city: null,
  address_state: null,
  address_postal_code: null,
  address_country: null,
  avatar_url: null,
  bio: null,
  is_verified: false,
  stripe_customer_id: null,
  stripe_account_id: null,
  stripe_onboarding_completed: false,
  avg_rating: 0,
  total_reviews: 0,
  total_rentals: 0
})

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<Error | null>(null)
  const [initAttempted, setInitAttempted] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Profile sync effect
  useEffect(() => {
    if (!isClient || !user) return

    const syncProfile = async () => {
      const cachedTimestamp = storage.getProfileTimestamp()
      // Only sync if cache is older than sync interval
      if (!cachedTimestamp || Date.now() - cachedTimestamp > SYNC_INTERVAL) {
        console.log("🔄 Auto-syncing profile")
        try {
          const { data, error } = await getUserProfile()
          if (!error && data) {
            setProfile(data)
            storage.saveProfile(data)
          }
        } catch (error) {
          console.error('Error during profile sync:', error)
        }
      }
    }

    const interval = setInterval(syncProfile, SYNC_INTERVAL)
    return () => clearInterval(interval)
  }, [isClient, user])

  const loadProfile = async (user: User) => {
    if (!user) return
    
    const startTime = performance.now()
    console.log("🔄 Loading profile for user:", user.id)
    setIsLoadingProfile(true)
    setProfileError(null)

    // Try to load cached profile first
    const cachedProfile = storage.getProfile()
    if (cachedProfile) {
      console.log("📦 Using cached profile while fetching fresh data")
      setProfile(cachedProfile)
    }

    try {
      console.time('getUserProfile')
      const { data, error } = await getUserProfile()
      const profileTime = performance.now() - startTime
      console.timeEnd('getUserProfile')
      console.log(`🕒 getUserProfile() took ${profileTime}ms`)
      
      if (error) {
        console.error("❌ Error loading profile:", error)
        setProfileError(error)
        // Keep using cached profile if available
        if (!cachedProfile) {
          throw error
        }
      } else if (!data) {
        console.log("⚠️ No profile data found")
        if (!cachedProfile) {
          setProfile(null)
          throw new Error('No profile data found')
        }
      } else {
        console.log("✅ Profile loaded successfully")
        setProfile(data)
        // Update cache with fresh data
        storage.saveProfile(data)
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error)
      setProfileError(error as Error)
      if (!cachedProfile) {
        setProfile(null)
      }
    } finally {
      const endTime = performance.now()
      console.log(`🏁 Profile loading complete, took ${endTime - startTime}ms`)
      setIsLoadingProfile(false)
    }
  }

  const updateProfile = async (data: Partial<Profile>) => {
    console.log("🔄 Updating profile with data:", data)
    try {
      const { error } = await updateUserProfile(data)
      if (error) throw error
      
      console.log("✅ Profile updated successfully")
      // Reload profile after update
      if (user) {
        await loadProfile(user)
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log("🔄 Signing out")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      storage.clearProfile() // Clear cached profile
      console.log("✅ Signed out successfully")
    } catch (error) {
      console.error('❌ Error signing out:', error)
      throw error
    }
  }

  useEffect(() => {
    if (!isClient) return

    let mounted = true
    const startTime = performance.now()
    console.log("🔄 Auth Provider initialized")

    const initializeAuth = async () => {
      try {
        console.log("🔍 Getting session...")
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return

        setUser(session?.user ?? null)
        if (session?.user) {
          console.log("👤 User found, loading profile...")
          await loadProfile(session.user)
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
      } finally {
        if (mounted) {
          console.log(`🕒 Auth initialization complete, took ${performance.now() - startTime}ms`)
          setIsLoading(false)
          setInitAttempted(true)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user)
      } else {
        setProfile(null)
        storage.clearProfile()
      }
      setIsLoading(false)
      setInitAttempted(true)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [isClient])

  if (!isClient) {
    return (
      <UserAuthContext.Provider
        value={{
          user: null,
          profile: null,
          isLoading: true,
          isAuthenticated: false,
          signOut: async () => {},
          updateProfile: async () => {}
        }}
      >
        {children}
      </UserAuthContext.Provider>
    )
  }

  return (
    <UserAuthContext.Provider
      value={{
        user,
        profile,
        isLoading: !initAttempted || isLoadingProfile,
        isAuthenticated: !!user,
        signOut,
        updateProfile
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => {
  const context = useContext(UserAuthContext)
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider')
  }
  return context
}

export default UserAuthContext 