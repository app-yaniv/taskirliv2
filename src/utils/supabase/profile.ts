import { createClient } from './client'

/**
 * Update user profile data (client-side only)
 * @param userData Profile data to update
 */
export async function updateUserProfile(
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
    const supabase = createClient()
    
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
 * Get user profile data (client-side only)
 */
export async function getUserProfile() {
  try {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    return { data: user, error: null }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { data: null, error }
  }
} 