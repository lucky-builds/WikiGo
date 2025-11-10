import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// These should be set as environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Leaderboard table name
export const LEADERBOARD_TABLE = 'leaderboard'

// Daily challenges table name
export const DAILY_CHALLENGES_TABLE = 'daily_challenges'

// Game analytics table name
export const GAME_ANALYTICS_TABLE = 'game_analytics'

// Practice games table name
export const PRACTICE_GAMES_TABLE = 'practice_games'


