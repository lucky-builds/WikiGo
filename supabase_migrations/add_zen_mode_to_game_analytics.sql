-- Add Zen Mode columns to game_analytics table
-- This migration adds support for tracking Zen Mode games and solution viewing

-- Add solution_viewed column to track if user forfeited and viewed solution
ALTER TABLE game_analytics 
ADD COLUMN IF NOT EXISTS solution_viewed BOOLEAN DEFAULT false;

-- Add is_zen_mode column to distinguish Zen Mode games from other modes
ALTER TABLE game_analytics 
ADD COLUMN IF NOT EXISTS is_zen_mode BOOLEAN DEFAULT false;

-- Create index on is_zen_mode for efficient queries
CREATE INDEX IF NOT EXISTS idx_game_analytics_is_zen_mode ON game_analytics(is_zen_mode);

-- Create index on solution_viewed for efficient queries
CREATE INDEX IF NOT EXISTS idx_game_analytics_solution_viewed ON game_analytics(solution_viewed);

-- Create composite index for checking Zen Mode game status
CREATE INDEX IF NOT EXISTS idx_game_analytics_zen_mode_status 
ON game_analytics(username, start_title, goal_title, is_zen_mode, completed, solution_viewed);

-- Add comments for documentation
COMMENT ON COLUMN game_analytics.solution_viewed IS 'Whether the user forfeited and viewed the solution (prevents replay)';
COMMENT ON COLUMN game_analytics.is_zen_mode IS 'Whether this game session is part of Zen Mode practice games';

