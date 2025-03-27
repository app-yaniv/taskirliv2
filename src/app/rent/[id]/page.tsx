import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import ClientPage from './ClientPage'

// Define types directly in this file to avoid import issues
type ItemData = {
  id: string
  title: string
  description: string
  category: string
  price_per_day: number
  location: string
  images: string[]
  status: string
  owner_id: string
  created_at: string
  owner: {
    display_name?: string
    avatar_url?: string
  } | null
}

interface RentalItemProps {
  params: {
    id: string
  }
  searchParams?: Record<string, string | string[] | undefined>
}

// This function tells Next.js which [id] values to pre-render
export async function generateStaticParams() {
  const supabase = createClient()
  const { data } = await supabase.from('items').select('id')
  
  return (data || []).map((item: { id: string }) => ({
    id: item.id,
  }))
}

export default async function RentalDetailPage({ params }: RentalItemProps) {
  // Use the client-side Supabase client instead of app-client
  const supabase = createClient()
  
  try {
    // Fetch the item data directly
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('*')
      .eq('id', params.id)
      .single()
    
    // Handle not found
    if (itemError || !item) {
      console.error('Item not found or error:', itemError)
      return notFound()
    }
    
    // Fetch the owner profile separately if needed
    let ownerProfile = null
    if (item.owner_id) {
      const { data: owner, error: ownerError } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', item.owner_id)
        .single()
      
      if (!ownerError && owner) {
        ownerProfile = owner
      }
    }
    
    // Combine the data
    const fullItem: ItemData = {
      ...item,
      owner: ownerProfile
    }
    
    // Now render the client component with the pre-fetched data
    return <ClientPage item={fullItem} />
  } catch (error) {
    console.error('Error loading rental detail:', error)
    return notFound()
  }
} 