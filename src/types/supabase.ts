export interface User {
  id: string
  email?: string
  user_metadata?: {
    [key: string]: any
  }
  app_metadata?: {
    [key: string]: any
  }
}

export interface Profile {
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