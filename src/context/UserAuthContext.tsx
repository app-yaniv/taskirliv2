'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { getUserProfile, Profile, updateUserProfile } from '@/utils/supabase/profile'

// Reduce timeout to 5 seconds since we've optimized the loading
const PROFILE_LOADING_TIMEOUT = 5000; // 5 seconds

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
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run auth logic on the client side
    if (!isClient) return

    let mounted = true
    const startTime = performance.now();
    console.log("🔄 Auth Provider initialized at", new Date().toISOString());

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("🔍 Getting session...")
        console.time('getSession');
        const sessionStart = performance.now();
        const { data: { session } } = await supabase.auth.getSession()
        const sessionEnd = performance.now();
        console.timeEnd('getSession');
        console.log(`🕒 Get session took ${sessionEnd - sessionStart}ms`)
        console.log("📋 Session data:", session ? "Session exists" : "No session")
        
        if (!mounted) return

        setUser(session?.user ?? null)
        if (session?.user) {
          console.log("👤 User found, loading profile...")
          const profileStart = performance.now();
          await loadProfile(session.user)
          const profileEnd = performance.now();
          console.log(`🕒 Total profile loading took ${profileEnd - profileStart}ms`)
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
      } finally {
        if (mounted) {
          const endTime = performance.now();
          console.log(`🕒 Auth initialization complete, took ${endTime - startTime}ms`)
          console.log("✅ Setting isLoading to false")
          setIsLoading(false)
          setInitAttempted(true)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log("🔔 Auth state change:", event, session ? "Session exists" : "No session")
      
      if (!mounted) return
      
      setUser(session?.user ?? null)
      if (session?.user) {
        const profileStart = performance.now();
        await loadProfile(session.user)
        const profileEnd = performance.now();
        console.log(`🕒 Profile loading during auth change took ${profileEnd - profileStart}ms`)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
      setInitAttempted(true)
    })

    return () => {
      console.log("🧹 Cleaning up auth provider")
      mounted = false
      subscription.unsubscribe()
    }
  }, [isClient])

  // Failsafe for profile loading
  useEffect(() => {
    if (!isClient) return
    
    // If we've attempted initialization, we're not loading auth, but we are still loading profile
    // after timeout seconds, consider it a failure and stop loading
    if (initAttempted && !isLoading && isLoadingProfile) {
      if (loadingStartTime === null) {
        // Set the start time if it's not set yet
        setLoadingStartTime(performance.now())
      }
      
      const currentTime = performance.now();
      const elapsedTime = loadingStartTime !== null ? currentTime - loadingStartTime : 0;
      
      console.log(`⏳ Profile loading in progress for ${Math.round(elapsedTime)}ms (timeout: ${PROFILE_LOADING_TIMEOUT}ms)`)
      
      const timeout = setTimeout(() => {
        console.log(`⚠️ Profile loading timeout reached after ${PROFILE_LOADING_TIMEOUT}ms, stopping loading state`)
        
        // Create a default profile if we timeout
        if (user) {
          console.log("Creating default profile due to timeout")
          const mockProfile = createMockProfile(user.id, user.email || undefined)
          setProfile(mockProfile)
        }
        
        setIsLoadingProfile(false)
        setLoadingStartTime(null)
      }, PROFILE_LOADING_TIMEOUT)
      
      return () => clearTimeout(timeout)
    } else if (!isLoadingProfile) {
      // Reset the loading start time when not loading
      setLoadingStartTime(null)
    }
  }, [initAttempted, isLoading, isLoadingProfile, isClient, user, loadingStartTime])

  const loadProfile = async (user: User) => {
    if (!user) return
    
    const startTime = performance.now();
    console.log("🔄 Loading profile for user:", user.id)
    setIsLoadingProfile(true)
    setProfileError(null)
    try {
      console.time('getUserProfile');
      const { data, error } = await getUserProfile()
      const profileTime = performance.now() - startTime;
      console.timeEnd('getUserProfile');
      console.log(`🕒 getUserProfile() took ${profileTime}ms`);
      
      console.log("📋 Profile data:", data ? "Profile exists" : "No profile", error ? `Error: ${error.message}` : "No error")
      
      if (error) {
        console.error("❌ Error loading profile:", error)
        setProfileError(error)
        
        // Create a mock profile to unblock the UI
        console.log("⚠️ Creating mock profile to unblock UI")
        const mockProfile = createMockProfile(user.id, user.email || undefined)
        
        setProfile(mockProfile)
      } else if (!data) {
        console.log("⚠️ No profile data found, creating empty profile")
        setProfile(null)
      } else {
        console.log("✅ Profile loaded successfully")
        setProfile(data)
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error)
      setProfileError(error as Error)
      setProfile(null)
    } finally {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      console.log(`🏁 Profile loading complete, took ${totalTime}ms. Setting isLoadingProfile to false`)
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
      console.log("✅ Signed out successfully")
    } catch (error) {
      console.error('❌ Error signing out:', error)
      throw error
    }
  }

  // Consider profile "loaded" even when there's an error, to prevent infinite loading
  const isFullyLoaded = !isLoading && (!isLoadingProfile || !!profileError)
  
  console.log("📊 Auth state:", { 
    isLoading, 
    isLoadingProfile, 
    profileError: !!profileError,
    isFullyLoaded, 
    isAuthenticated: !!user,
    hasProfile: !!profile,
    loadingTime: loadingStartTime !== null ? Math.round(performance.now() - loadingStartTime) : null,
    isClient
  })

  // If we're still on the server side, return a placeholder
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
        isLoading: !isFullyLoaded,
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