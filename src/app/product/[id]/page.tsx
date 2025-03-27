'use client'

import ProductDetail from '@/components/product/ProductDetail'

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetail itemId={params.id} />
} 