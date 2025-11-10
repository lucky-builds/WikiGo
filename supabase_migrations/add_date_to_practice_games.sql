-- Add date column to practice_games table for date-based practice games
-- This allows different practice game sets to be shown on different dates

ALTER TABLE practice_games 
ADD COLUMN IF NOT EXISTS date DATE;

-- Create index on date for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_practice_games_date ON practice_games(date DESC);

-- Add comment for documentation
COMMENT ON COLUMN practice_games.date IS 'Date for which this practice game set is active (NULL means always available)';

