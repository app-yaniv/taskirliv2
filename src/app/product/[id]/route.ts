import { createClient } from '@/utils/supabase/server'

// Generate static params for static export
export async function generateStaticParams() {
  // In a real app, you would fetch this from your database
  return [{ id: 'sample-product' }]
}

// This is a server-side route handler
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  
  // Here you would fetch the actual product data
  // For now, returning a 200 OK
  return new Response(null, {
    status: 200
  })
} 