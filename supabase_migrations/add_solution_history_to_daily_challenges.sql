-- Add best_solution_history column to daily_challenges table
-- This stores the best solution path (array of article titles) for each challenge
-- Used as a fallback when history is not available in the leaderboard table

ALTER TABLE daily_challenges 
ADD COLUMN IF NOT EXISTS best_solution_history JSONB;

-- Add comment for documentation
COMMENT ON COLUMN daily_challenges.best_solution_history IS 'JSON array of article titles representing the best solution path for this challenge. Used as fallback when history is not available in leaderboard table.';

