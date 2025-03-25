// IMPORTANT: This file should only be used in app/ directory components
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createAppClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The cookies API doesn't work in middleware or server actions
            // at the edge runtime, so we ignore those errors
          }
        },
        remove(name, options) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // The cookies API doesn't work in middleware or server actions
            // at the edge runtime, so we ignore those errors
          }
        },
      },
    }
  )
} 