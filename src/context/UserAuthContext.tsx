'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { getUserProfile, Profile, updateUserProfile } from '@/utils/supabase/profile'

// Increase timeout to 30 seconds for slow backend connections
const PROFILE_LOADING_TIMEOUT = 30000; // 30 seconds

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
  const [isClient, setIsClient] = useState(false)
  const isLoadingRealProfile = useRef(false)
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // This function attempts to load the profile but doesn't wait for it to complete
  // It will first create a temporary profile, then update it when the real one loads
  const loadProfileWithFallback = async (user: User) => {
    if (!user) return null;
    
    // Create and set mock profile immediately
    const mockProfile = createMockProfile(user.id, user.email || undefined);
    setProfile(mockProfile);
    
    // Don't start multiple profile loading requests simultaneously
    if (isLoadingRealProfile.current) return mockProfile;
    
    // Set loading flag
    isLoadingRealProfile.current = true;
    
    // Start loading the actual profile in the background
    getUserProfile().then(result => {
      // Only update if we actually got a profile back
      if (result.data) {
        console.log('Real profile loaded successfully, updating from fallback');
        setProfile(result.data);
      }
    }).catch(error => {
      console.error('Failed to load real profile after fallback:', error);
    }).finally(() => {
      isLoadingRealProfile.current = false;
    });
    
    // Return the mock profile for now
    return mockProfile;
  };

  useEffect(() => {
    // Only run auth logic on the client side
    if (!isClient) return;

    let mounted = true;
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        setUser(session?.user ?? null);
        
        // Set authentication flag immediately based on session existence
        const isAuth = !!session?.user;
        
        if (session?.user) {
          // Load a fallback profile immediately and start loading the real one
          await loadProfileWithFallback(session.user);
        }
        
        // Set loading to false regardless
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load a fallback profile immediately and start loading the real one
          await loadProfileWithFallback(session.user);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isClient]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    try {
      const { data: updatedProfile, error } = await updateUserProfile(data);
      if (error) throw error;
      if (updatedProfile) setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  return (
    <UserAuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated,
        signOut,
        updateProfile
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}

export default UserAuthContext; 