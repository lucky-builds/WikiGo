// Game analytics tracking utilities

import { supabase, GAME_ANALYTICS_TABLE, LEADERBOARD_TABLE } from './supabase';
import { getStoredUsername } from './username';

/**
 * Track when a game is started
 * @param {Object} gameData - Game data object
 * @param {string} gameData.startTitle - Starting article title
 * @param {string} gameData.goalTitle - Goal article title
 * @param {boolean} gameData.isDailyChallenge - Whether it's a daily challenge
 * @param {string} gameData.startCategory - Starting category (if any)
 * @param {string} gameData.goalCategory - Goal category (if any)
 * @returns {Promise<string|null>} - Game session ID or null if tracking fails
 */
export async function trackGameStart({ startTitle, goalTitle, isDailyChallenge, startCategory = null, goalCategory = null }) {
  try {
    const username = getStoredUsername() || 'anonymous';
    
    const { data, error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .insert([
        {
          username: username,
          start_title: startTitle,
          goal_title: goalTitle,
          is_daily_challenge: isDailyChallenge,
          start_category: startCategory,
          goal_category: goalCategory,
          completed: false,
          started_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error tracking game start:', error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Error tracking game start:', err);
    return null;
  }
}

/**
 * Update game history as player progresses
 * @param {string} gameSessionId - Game session ID from trackGameStart
 * @param {string[]} history - Array of article titles in the current path
 * @returns {Promise<boolean>} - Success status
 */
export async function updateGameHistory(gameSessionId, history) {
  if (!gameSessionId) {
    return false;
  }

  try {
    const { error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .update({
        history: history,
      })
      .eq('id', gameSessionId);

    if (error) {
      console.error('Error updating game history:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error updating game history:', err);
    return false;
  }
}

/**
 * Track when a game is completed
 * @param {string} gameSessionId - Game session ID from trackGameStart
 * @param {Object} completionData - Completion data object
 * @param {number} completionData.score - Final score
 * @param {number} completionData.moves - Number of moves taken
 * @param {number} completionData.timeMs - Time taken in milliseconds
 * @param {string[]} completionData.history - Array of article titles in the path
 * @returns {Promise<boolean>} - Success status
 */
export async function trackGameCompletion(gameSessionId, { score, moves, timeMs, history }) {
  if (!gameSessionId) {
    // If no session ID, try to track as a new completion entry
    return trackGameCompletionWithoutSession({ score, moves, timeMs, history });
  }

  try {
    const { error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .update({
        completed: true,
        score: score,
        moves: moves,
        time_ms: timeMs,
        history: history,
        completed_at: new Date().toISOString(),
      })
      .eq('id', gameSessionId);

    if (error) {
      console.error('Error tracking game completion:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error tracking game completion:', err);
    return false;
  }
}

/**
 * Track game completion when we don't have a session ID (fallback)
 */
async function trackGameCompletionWithoutSession({ score, moves, timeMs, history }) {
  try {
    const username = getStoredUsername() || 'anonymous';
    
    const { error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .insert([
        {
          username: username,
          completed: true,
          score: score,
          moves: moves,
          time_ms: timeMs,
          history: history,
          completed_at: new Date().toISOString(),
          started_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error tracking game completion (no session):', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error tracking game completion (no session):', err);
    return false;
  }
}

/**
 * Update username across all tables (leaderboard and game_analytics)
 * This is called when a user changes their username
 * @param {string} oldUsername - The old username to replace
 * @param {string} newUsername - The new username
 * @returns {Promise<boolean>} - Success status
 */
export async function updateUsernameAcrossTables(oldUsername, newUsername) {
  if (!oldUsername || !newUsername || oldUsername === newUsername) {
    return false;
  }

  try {
    // Update leaderboard entries
    const { error: leaderboardError } = await supabase
      .from(LEADERBOARD_TABLE)
      .update({ username: newUsername })
      .eq('username', oldUsername);

    if (leaderboardError) {
      console.error('Error updating username in leaderboard:', leaderboardError);
    }

    // Update game_analytics entries
    const { error: analyticsError } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .update({ username: newUsername })
      .eq('username', oldUsername);

    if (analyticsError) {
      console.error('Error updating username in game_analytics:', analyticsError);
    }

    // Return true if at least one update succeeded (or if there were no errors)
    return !leaderboardError && !analyticsError;
  } catch (err) {
    console.error('Error updating username across tables:', err);
    return false;
  }
}

