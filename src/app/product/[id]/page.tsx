'use client'

import { useParams } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'

export default function ProductPage() {
  const { id } = useParams() || {}
  
  return (
    <ProductDetail itemId={id as string} />
  )
} 