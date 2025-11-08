// User statistics utilities for gamification features

import { supabase, GAME_ANALYTICS_TABLE, LEADERBOARD_TABLE } from './supabase';
import { getStoredUsername } from './username';

/**
 * Get date string in YYYY-MM-DD format
 */
function getDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate user's current streak (consecutive daily challenge completions)
 * @returns {Promise<number>} - Number of consecutive days completed
 */
export async function getUserStreak() {
  try {
    const username = getStoredUsername();
    if (!username) return 0;

    // Get all completed daily challenges for this user, ordered by completion date descending
    const { data, error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('completed_at')
      .eq('username', username)
      .eq('is_daily_challenge', true)
      .eq('completed', true)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching streak data:', error);
      return 0;
    }

    if (!data || data.length === 0) return 0;

    // Calculate streak by checking consecutive days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    // Group by date and get unique completion dates (sorted descending)
    const completionDates = [...new Set(
      data.map(entry => {
        const date = new Date(entry.completed_at);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    )].sort((a, b) => b - a);

    if (completionDates.length === 0) return 0;

    // Check if today is completed
    let streak = 0;
    let checkDate = todayTime;
    
    // If today is completed, start from today
    if (completionDates[0] === todayTime) {
      streak = 1;
      checkDate = todayTime - 24 * 60 * 60 * 1000; // Move to yesterday
    } else {
      // Check if yesterday was completed
      const yesterdayTime = todayTime - 24 * 60 * 60 * 1000;
      if (completionDates[0] !== yesterdayTime) {
        return 0; // No streak if most recent completion wasn't yesterday
      }
      streak = 1;
      checkDate = yesterdayTime - 24 * 60 * 60 * 1000; // Move to day before yesterday
    }

    // Count consecutive days backwards
    for (let i = 1; i < completionDates.length; i++) {
      if (completionDates[i] === checkDate) {
        streak++;
        checkDate -= 24 * 60 * 60 * 1000; // Move back one day
      } else if (completionDates[i] < checkDate) {
        // Gap found, streak broken
        break;
      }
    }

    return streak;
  } catch (err) {
    console.error('Error calculating streak:', err);
    return 0;
  }
}

/**
 * Get total number of daily challenges completed by user
 * @returns {Promise<number>} - Total completions count
 */
export async function getTotalCompletions() {
  try {
    const username = getStoredUsername();
    if (!username) return 0;

    const { count, error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('*', { count: 'exact', head: true })
      .eq('username', username)
      .eq('is_daily_challenge', true)
      .eq('completed', true);

    if (error) {
      console.error('Error fetching total completions:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Error calculating total completions:', err);
    return 0;
  }
}

/**
 * Get user's global rank for today's daily challenge
 * @returns {Promise<number|null>} - User's rank or null if not ranked
 */
export async function getUserGlobalRank() {
  try {
    const username = getStoredUsername();
    if (!username) return null;

    const today = getDateString();
    
    // Get user's best score for today
    const { data: userScore, error: userError } = await supabase
      .from(LEADERBOARD_TABLE)
      .select('score')
      .eq('date', today)
      .eq('username', username)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (userError || !userScore) {
      return null; // User hasn't completed today's challenge
    }

    // Count how many users have a higher score
    const { count } = await supabase
      .from(LEADERBOARD_TABLE)
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .gt('score', userScore.score);

    return (count || 0) + 1;
  } catch (err) {
    console.error('Error calculating global rank:', err);
    return null;
  }
}

/**
 * Get all user stats in one call
 * @returns {Promise<{streak: number, totalCompletions: number, globalRank: number|null}>}
 */
export async function getAllUserStats() {
  const [streak, totalCompletions, globalRank] = await Promise.all([
    getUserStreak(),
    getTotalCompletions(),
    getUserGlobalRank(),
  ]);

  return {
    streak,
    totalCompletions,
    globalRank,
  };
}

