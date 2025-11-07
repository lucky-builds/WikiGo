-- Game Analytics Table
-- This table tracks all game sessions: starts, completions, and game data

CREATE TABLE IF NOT EXISTS game_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  start_title TEXT NOT NULL,
  goal_title TEXT NOT NULL,
  is_daily_challenge BOOLEAN DEFAULT false,
  start_category TEXT,
  goal_category TEXT,
  completed BOOLEAN DEFAULT false,
  score INTEGER,
  moves INTEGER,
  time_ms INTEGER,
  history JSONB, -- Array of article titles in the path
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_game_analytics_username ON game_analytics(username);
CREATE INDEX IF NOT EXISTS idx_game_analytics_completed ON game_analytics(completed);
CREATE INDEX IF NOT EXISTS idx_game_analytics_is_daily_challenge ON game_analytics(is_daily_challenge);
CREATE INDEX IF NOT EXISTS idx_game_analytics_started_at ON game_analytics(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_analytics_completed_at ON game_analytics(completed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE game_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for tracking)
CREATE POLICY "Allow public inserts" ON game_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow anyone to read (for analytics)
CREATE POLICY "Allow public reads" ON game_analytics
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policy to allow updates (for completion tracking)
CREATE POLICY "Allow public updates" ON game_analytics
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Optional: Add comments for documentation
COMMENT ON TABLE game_analytics IS 'Tracks all game sessions including starts, completions, and game statistics';
COMMENT ON COLUMN game_analytics.history IS 'JSON array of article titles representing the path taken';
COMMENT ON COLUMN game_analytics.completed IS 'Whether the game was completed (reached goal)';

