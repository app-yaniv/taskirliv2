import { createClient } from '@/utils/supabase/server'
import RentalDetail from '@/components/rent/RentalDetail'

export default async function RentPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Fetch initial data server-side
  const { data: item } = await supabase
    .from('items')
    .select(`
      *,
      owner_profile:profiles!owner_id(display_name, avatar_url)
    `)
    .eq('id', params.id)
    .single()

  return <RentalDetail initialData={item} id={params.id} />
}

export async function generateStaticParams() {
  const supabase = createClient()
  
  // Fetch all active item IDs
  const { data: items } = await supabase
    .from('items')
    .select('id')
    .eq('status', 'active')
    .limit(20)

  return (items || []).map((item) => ({
    id: item.id.toString()
  }))
} 