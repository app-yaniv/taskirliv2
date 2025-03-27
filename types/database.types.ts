export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          price: number
          category: string
          user_id: string
          image_url?: string
          status?: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          price: number
          category: string
          user_id: string
          image_url?: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          price?: number
          category?: string
          user_id?: string
          image_url?: string
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
