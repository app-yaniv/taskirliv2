import ProductDetail from '@/components/product/ProductDetail'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

type Item = Database['public']['Tables']['items']['Row']

// This needs to be a Server Component to use generateStaticParams
async function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <ProductDetail itemId={params.id} />
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const supabase = createClient()
    
    const { data: items } = await supabase
      .from('items')
      .select('id')
    
    if (!items) return []
    
    return items.map((item: Item) => ({
      id: item.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default ProductPage 