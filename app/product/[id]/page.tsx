import { createClient } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'

// Dynamically import the client component to avoid auth context issues during static generation
const ProductClient = dynamic(() => import('./client'), { ssr: false })

// A simple product page that doesn't require auth context
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Product ID: {params.id}</h1>
      <p>This is a statically generated product page.</p>
      
      {/* Client-side only component that handles auth and fetching */}
      <ProductClient id={params.id} />
    </div>
  )
}

// Fetch products from Supabase at build time
export async function generateStaticParams() {
  // Initialize Supabase client for build-time only
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    // Fetch all product IDs from Supabase
    const { data: items, error } = await supabase
      .from('items')
      .select('id')
    
    if (error) {
      console.error('Error fetching items:', error)
      // Fallback to hard-coded IDs if there's an error
      return [
        { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }
      ]
    }
    
    // Map items to the format expected by generateStaticParams
    return items.map(item => ({
      id: item.id.toString()
    }))
  } catch (err) {
    console.error('Exception in generateStaticParams:', err)
    // Fallback to hard-coded IDs if there's an exception
    return [
      { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }
    ]
  }
} 