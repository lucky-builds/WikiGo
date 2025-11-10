-- Practice Games Table
-- This table stores practice game pairs for Zen Mode
-- Each game has a start article, goal article, and pre-stored solution path

CREATE TABLE IF NOT EXISTS practice_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_title TEXT NOT NULL,
  goal_title TEXT NOT NULL,
  solution_history JSONB NOT NULL, -- Array of article titles representing the solution path
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_practice_games_start_title ON practice_games(start_title);
CREATE INDEX IF NOT EXISTS idx_practice_games_goal_title ON practice_games(goal_title);
CREATE INDEX IF NOT EXISTS idx_practice_games_created_at ON practice_games(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE practice_games ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read (for fetching practice games)
CREATE POLICY "Allow public reads" ON practice_games
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policy to allow authenticated users to insert (for admin use)
CREATE POLICY "Allow authenticated inserts" ON practice_games
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update (for admin use)
CREATE POLICY "Allow authenticated updates" ON practice_games
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE practice_games IS 'Stores practice game pairs for Zen Mode with pre-defined solutions';
COMMENT ON COLUMN practice_games.solution_history IS 'JSON array of article titles representing the optimal solution path';

