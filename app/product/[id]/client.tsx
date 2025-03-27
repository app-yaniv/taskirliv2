'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function ProductClient({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          throw new Error(error.message)
        }
        
        setProduct(data)
      } catch (err: any) {
        console.error('Error loading product:', err)
        setError(err.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [id])
  
  if (loading) {
    return <div className="mt-8 text-center">Loading product details...</div>
  }
  
  if (error) {
    return <div className="mt-8 text-center text-red-500">Error: {error}</div>
  }
  
  if (!product) {
    return <div className="mt-8 text-center">Product not found</div>
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">{product.title}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="font-bold mt-4">${product.price}</p>
      
      {product.image_url && (
        <div className="mt-4">
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="max-w-full h-auto rounded"
          />
        </div>
      )}
      
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Contact Seller
        </button>
      </div>
    </div>
  )
} 