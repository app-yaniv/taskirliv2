import { createClient } from './client'

// Create a static date string to avoid hydration mismatch
const STATIC_DATE = '2023-01-01T00:00:00.000Z'

export type Profile = {
  id: string
  created_at: string
  updated_at: string
  display_name: string | null
  full_name: string | null
  phone: string | null
  alternative_email: string | null
  address_street: string | null
  address_city: string | null
  address_state: string | null
  address_postal_code: string | null
  address_country: string | null
  avatar_url: string | null
  bio: string | null
  is_verified: boolean
  stripe_customer_id: string | null
  stripe_account_id: string | null
  stripe_onboarding_completed: boolean
  avg_rating: number
  total_reviews: number
  total_rentals: number
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'avg_rating' | 'total_reviews' | 'total_rentals'>>

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

/**
 * Get user profile data
 */
export async function getUserProfile(): Promise<{ data: Profile | null, error: Error | null }> {
  try {
    const supabase = createClient()
    
    // Get both user and profile in parallel
    const [userResponse, profileResponse] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle()
    ]);
    
    const user = userResponse.data.user;
    
    if (!user) {
      return { data: null, error: new Error('User not found') }
    }
    
    // If profile exists, return it
    if (profileResponse.data) {
      return { data: profileResponse.data, error: null }
    }
    
    // If no profile exists, create one
    if (profileResponse.error?.code === 'PGRST116' || !profileResponse.data) {
      try {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id })
          .select()
          .single()
        
        if (insertError) {
          const mockProfile = createMockProfile(user.id, user.email || undefined)
          return { data: mockProfile, error: null }
        }
        
        return { data: newProfile, error: null }
      } catch (insertError) {
        return { data: null, error: insertError as Error }
      }
    }
    
    return { data: null, error: profileResponse.error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Update user profile data
 */
export async function updateUserProfile(profileData: ProfileUpdate): Promise<{ data: Profile | null, error: Error | null }> {
  const startTime = performance.now();
  console.log("🔄 updateUserProfile called with data:", profileData)
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    console.log("🔍 Current user:", user ? `ID: ${user.id}` : "No user found")
    
    if (!user) {
      console.log("❌ No user found, cannot update profile")
      throw new Error('User not found')
    }
    
    console.log("🔍 Updating profile for user:", user.id)
    console.time('updateProfile');
    const updateStart = performance.now();
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single()
    const updateEnd = performance.now();
    console.timeEnd('updateProfile');
    console.log(`🕒 Profile update took ${updateEnd - updateStart}ms`);
    
    console.log("📊 Profile update result:", data ? "Profile updated" : "Update failed", error ? `Error: ${error.message}` : "No error")
    
    if (error) {
      // If there's a 'not found' error, try to insert instead
      if (error.code === 'PGRST116') {
        console.log("⚠️ Profile not found for update, creating a new one")
        console.time('insertProfile');
        const insertStart = performance.now();
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, ...profileData })
          .select()
          .single()
        const insertEnd = performance.now();
        console.timeEnd('insertProfile');
        console.log(`🕒 Profile insert took ${insertEnd - insertStart}ms`);
        
        if (insertError) {
          console.error("❌ Error creating profile during update:", insertError)
          throw insertError
        }
        
        console.log("✅ New profile created during update:", newProfile ? "Success" : "Failed")
        const endTime = performance.now();
        console.log(`🕒 Total updateUserProfile time (insert): ${endTime - startTime}ms`);
        return { data: newProfile, error: null }
      }
      
      throw error
    }
    
    console.log("✅ Profile updated successfully")
    const endTime = performance.now();
    console.log(`🕒 Total updateUserProfile time: ${endTime - startTime}ms`);
    return { data, error: null }
  } catch (error) {
    console.error('❌ Error updating user profile:', error)
    const endTime = performance.now();
    console.log(`🕒 Total updateUserProfile time (error): ${endTime - startTime}ms`);
    return { data: null, error: error as Error }
  }
}

/**
 * Upload profile avatar
 */
export async function uploadProfileAvatar(file: File): Promise<{ data: { url: string } | null, error: Error | null }> {
  console.log("🔄 uploadProfileAvatar called")
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    console.log("🔍 Current user:", user ? `ID: ${user.id}` : "No user found")
    
    if (!user) {
      console.log("❌ No user found, cannot upload avatar")
      throw new Error('User not found')
    }
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`
    
    console.log("🔍 Uploading avatar:", filePath)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
    
    if (uploadError) {
      console.error("❌ Error uploading avatar:", uploadError)
      throw uploadError
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
    
    console.log("🔍 Updating profile with avatar URL:", publicUrl)
    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)
    
    if (updateError) {
      console.error("❌ Error updating profile with avatar URL:", updateError)
      throw updateError
    }
    
    console.log("✅ Avatar uploaded and profile updated successfully")
    return { data: { url: publicUrl }, error: null }
  } catch (error) {
    console.error('❌ Error uploading profile avatar:', error)
    return { data: null, error: error as Error }
  }
} 