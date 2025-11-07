-- Add tracking columns to leaderboard table
-- This adds start_title, goal_title, and history columns to store game path data

-- Add start_title column
ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS start_title TEXT;

-- Add goal_title column
ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS goal_title TEXT;

-- Add history column as JSONB to store the array of article titles
ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS history JSONB;

-- Add index on start_title and goal_title for common queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_start_title ON leaderboard(start_title);
CREATE INDEX IF NOT EXISTS idx_leaderboard_goal_title ON leaderboard(goal_title);

-- Add comment for documentation
COMMENT ON COLUMN leaderboard.history IS 'JSON array of article titles representing the path taken from start to goal';
COMMENT ON COLUMN leaderboard.start_title IS 'The starting article title for this game';
COMMENT ON COLUMN leaderboard.goal_title IS 'The goal article title for this game';

