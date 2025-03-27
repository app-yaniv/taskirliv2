'use client'

import { useEffect, useState } from 'react'
import RentalDetailClient from './RentalDetailClient'
import { createClient } from '@/utils/supabase/client'

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

interface ClientPageProps {
  item: ItemData
}

export default function ClientPage({ item: initialItem }: ClientPageProps) {
  // Fix the useState linter errors by using individual useState calls without destructuring
  const itemState = useState<ItemData>(initialItem);
  const item = itemState[0];
  const setItem = itemState[1];
  
  const loadingState = useState(false);
  const loading = loadingState[0];
  const setLoading = loadingState[1];
  
  // Optionally refetch data on the client side to get the most up-to-date information
  // This is useful since we're using static generation
  useEffect(() => {
    const refreshData = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        // Fetch item data
        const { data: itemData, error: itemError } = await supabase
          .from('items')
          .select('*')
          .eq('id', initialItem.id)
          .single()
          
        if (itemData && !itemError) {
          // Fetch owner profile separately
          let ownerProfile = null
          if (itemData.owner_id) {
            const { data: owner, error: ownerError } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', itemData.owner_id)
              .single()
              
            if (!ownerError && owner) {
              ownerProfile = owner
            }
          }
          
          // Combine the data
          const fullItem: ItemData = {
            ...itemData,
            owner: ownerProfile
          }
          
          setItem(fullItem)
        }
      } catch (error) {
        console.error('Error refreshing item data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Uncomment this if you want to refresh data on client-side
    // refreshData()
  }, [initialItem.id])
  
  return <RentalDetailClient item={item} isRefreshing={loading} />
}
