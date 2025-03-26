'use client'

import { useParams } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'

export default function ProductPage() {
  const { id } = useParams() || {}
  
  return (
    <ProductDetail itemId={id as string} />
  )
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    // Add more IDs as needed
  ]
} 