import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY

// Crear cliente de Supabase solo si las variables están disponibles
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    if (import.meta.env.DEV) console.warn('Error creating Supabase client:', error)
  }
} else {
  if (import.meta.env.DEV) console.warn('Supabase environment variables not found. Authentication will be disabled.')
}

// Supabase desactivado temporalmente - exportar el cliente o null
export { supabase };

// Tipos para las tablas de la base de datos
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface UserConfiguration {
  id: string
  user_id: string
  name: string
  archetype: string
  selected_parts: Record<string, any>
  total_price: number
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      user_configurations: {
        Row: UserConfiguration
        Insert: Omit<UserConfiguration, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserConfiguration, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 