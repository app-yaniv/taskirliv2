import { createClient } from '@/utils/supabase/server'

export async function generateStaticParams() {
  // For static export, we need to provide a list of possible IDs
  // Since we don't know all IDs at build time in a static export scenario,
  // we'll provide a placeholder and use fallback handling in the component
  
  // In a production environment with dynamic rendering, you would fetch all IDs from the database
  // For now, we'll use the IDs we know about
  return [
    { id: 'placeholder' },
    { id: '442c096c-e409-42cf-ad21-14842718f944' },
    // Add any other specific IDs you know are being accessed
  ]
}

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return children
} 