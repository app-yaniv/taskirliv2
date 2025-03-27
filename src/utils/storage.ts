import { Profile } from './supabase/profile'

const PROFILE_STORAGE_KEY = 'cached_user_profile'
const PROFILE_TIMESTAMP_KEY = 'profile_cache_timestamp'

export const storage = {
  isStorageAvailable: (): boolean => {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  },

  saveProfile: (profile: Profile): boolean => {
    try {
      if (!storage.isStorageAvailable()) {
        console.warn('Local storage is not available')
        return false
      }
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
      localStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString())
      return true
    } catch (error) {
      console.error('Error saving profile to storage:', error)
      return false
    }
  },

  getProfile: (): Profile | null => {
    try {
      if (!storage.isStorageAvailable()) {
        console.warn('Local storage is not available')
        return null
      }
      const profile = localStorage.getItem(PROFILE_STORAGE_KEY)
      return profile ? JSON.parse(profile) : null
    } catch (error) {
      console.error('Error reading profile from storage:', error)
      return null
    }
  },

  getProfileTimestamp: (): number | null => {
    try {
      if (!storage.isStorageAvailable()) {
        return null
      }
      const timestamp = localStorage.getItem(PROFILE_TIMESTAMP_KEY)
      return timestamp ? parseInt(timestamp) : null
    } catch (error) {
      console.error('Error reading timestamp from storage:', error)
      return null
    }
  },

  clearProfile: (): void => {
    try {
      if (storage.isStorageAvailable()) {
        localStorage.removeItem(PROFILE_STORAGE_KEY)
        localStorage.removeItem(PROFILE_TIMESTAMP_KEY)
      }
    } catch (error) {
      console.error('Error clearing profile from storage:', error)
    }
  }
} 