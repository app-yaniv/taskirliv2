import ProductDetail from '@/components/product/ProductDetail'

export default async function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetail itemId={params.id} />
}

export async function generateStaticParams() {
  // For now, return a fixed set of IDs
  // This will be replaced with dynamic IDs in production
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ]
} 