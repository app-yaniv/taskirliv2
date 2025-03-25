'use server'

import { createAppClient } from './app-client'

/**
 * Update user profile data (server-side only, use in app/ directory only)
 * @param userData Profile data to update
 */
export async function updateUserProfileServer(
  userData: {
    phone?: string;
    alternativeEmail?: string;
    address?: {
      street?: string;
      city?: string;
      zip?: string;
    };
    name?: string;
    [key: string]: any;
  }
) {
  try {
    const supabase = createAppClient()
    
    // Fetch current user metadata to avoid overwriting existing data
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Merge new data with existing metadata
    const updatedMetadata = {
      ...user.user_metadata,
      ...userData
    }
    
    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: updatedMetadata
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { data: null, error }
  }
}

/**
 * Get user profile data (server-side only, use in app/ directory only)
 */
export async function getUserProfileServer() {
  try {
    const supabase = createAppClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    return { data: user, error: null }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { data: null, error }
  }
} 