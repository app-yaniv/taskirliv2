import ProductDetail from '@/components/product/ProductDetail'

// This needs to be a Server Component to use generateStaticParams
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <ProductDetail itemId={params.id} />
    </div>
  )
}

// Hard-code static params for build time
export function generateStaticParams() {
  // Generate static params for known product IDs
  // This is a temporary solution until we can fetch from Supabase properly during build
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    // Add more IDs as needed
  ]
} 