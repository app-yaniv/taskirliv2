'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'

type UserAuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  isAuthenticated: false,
})

export const UserAuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get current session on initial load
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error.message)
        setError('שגיאה בהתחברות. אנא בדוק את פרטי ההתחברות שלך.')
      }
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getSession()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      const supabase = createClient()
      
      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
        throw error
      }

      // Clear local state
      setUser(null)
      setSession(null)
      
      // Clear any stored auth data
      localStorage.removeItem('supabase.auth.token')
      
      // Force a complete page reload to clear all state
      window.location.replace('/')
    } catch (error: any) {
      console.error('Error during sign out:', error.message)
      throw error
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
    isAuthenticated: !!user,
  }

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => useContext(UserAuthContext)

export default UserAuthContext 