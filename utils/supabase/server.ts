import { createClient as createClientBase } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export function createClient() {
  const supabase = createClientBase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  return supabase
} 