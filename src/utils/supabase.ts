import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export interface HabitData {
  id?: string
  user_id: string
  start_date: string
  days_data: Record<string, boolean[]>
  updated_at?: string
}

// Get habit data for a user
export async function getHabitData(userId: string): Promise<HabitData | null> {
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('habit_tracker')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching habit data:', error)
    return null
  }
  
  return data
}

// Save habit data
export async function saveHabitData(
  userId: string, 
  startDate: string, 
  daysData: Record<string, boolean[]>
): Promise<boolean> {
  if (!supabase) return false
  
  const { error } = await supabase
    .from('habit_tracker')
    .upsert({
      user_id: userId,
      start_date: startDate,
      days_data: daysData,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
  
  if (error) {
    console.error('Error saving habit data:', error)
    return false
  }
  
  return true
}

export function isSupabaseConfigured(): boolean {
  return !!supabase
}
