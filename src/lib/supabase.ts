import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type Database = {
  public: {
    Tables: {
      coaching_sessions: {
        Row: {
          id: string
          user_id: string | null
          persona_id: string
          messages: any
          evaluation_report: any
          completed_at: string
          session_duration: number | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          persona_id: string
          messages: any
          evaluation_report?: any
          completed_at?: string
          session_duration?: number | null
        }
        Update: {
          id?: string
          user_id?: string | null
          persona_id?: string
          messages?: any
          evaluation_report?: any
          completed_at?: string
          session_duration?: number | null
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string | null
          persona_id: string
          competency: string
          score: number
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          persona_id: string
          competency: string
          score: number
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          persona_id?: string
          competency?: string
          score?: number
          session_id?: string
          created_at?: string
        }
      }
    }
  }
}