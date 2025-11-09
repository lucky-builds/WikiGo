// Utility functions for fetching yesterday's challenge data

import { supabase, DAILY_CHALLENGES_TABLE, LEADERBOARD_TABLE } from './supabase';

/**
 * Get yesterday's date string in YYYY-MM-DD format
 * @returns {string} Yesterday's date string
 */
export function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date string for display (e.g., "January 15, 2024")
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export function formatDateForDisplay(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Fetch yesterday's challenge from the database
 * @returns {Promise<{startTitle: string, goalTitle: string, date: string} | null>}
 */
export async function fetchYesterdayChallenge() {
  try {
    const yesterdayDate = getYesterdayDateString();
    
    const { data, error } = await supabase
      .from(DAILY_CHALLENGES_TABLE)
      .select('start_title, goal_title, date')
      .eq('date', yesterdayDate)
      .single();
    
    if (error) {
      // If no challenge found, that's okay - return null
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching yesterday challenge:', error);
      return null;
    }
    
    if (!data || !data.start_title || !data.goal_title) {
      return null;
    }
    
    return {
      startTitle: data.start_title,
      goalTitle: data.goal_title,
      date: data.date || yesterdayDate,
    };
  } catch (err) {
    console.error('Failed to fetch yesterday challenge:', err);
    return null;
  }
}

/**
 * Fetch completion statistics for yesterday's challenge
 * @param {string} yesterdayDate - Yesterday's date string in YYYY-MM-DD format
 * @returns {Promise<{completionCount: number, averageMoves: number, averageTime: number}>}
 */
export async function fetchYesterdayCompletionStats(yesterdayDate) {
  try {
    const { data, error, count } = await supabase
      .from(LEADERBOARD_TABLE)
      .select('moves, time_ms', { count: 'exact' })
      .eq('date', yesterdayDate);
    
    if (error) {
      console.error('Error fetching completion stats:', error);
      return {
        completionCount: 0,
        averageMoves: 0,
        averageTime: 0,
      };
    }
    
    const completionCount = count || (data ? data.length : 0);
    
    if (completionCount === 0 || !data || data.length === 0) {
      return {
        completionCount: 0,
        averageMoves: 0,
        averageTime: 0,
      };
    }
    
    const totalMoves = data.reduce((sum, entry) => sum + (entry.moves || 0), 0);
    // time_ms is stored in seconds, convert to milliseconds for calculations
    const totalTime = data.reduce((sum, entry) => sum + ((entry.time_ms || 0) * 1000), 0);
    
    return {
      completionCount,
      averageMoves: Math.round(totalMoves / completionCount),
      averageTime: Math.round(totalTime / completionCount), // Returns in milliseconds
    };
  } catch (err) {
    console.error('Failed to fetch completion stats:', err);
    return {
      completionCount: 0,
      averageMoves: 0,
      averageTime: 0,
    };
  }
}

/**
 * Fetch the best solution for yesterday's challenge
 * First tries to get from leaderboard table, then falls back to daily_challenges table
 * @param {string} yesterdayDate - Yesterday's date string in YYYY-MM-DD format
 * @returns {Promise<{username: string, moves: number, timeMs: number, score: number, history: string[]} | null>}
 */
export async function fetchYesterdayBestSolution(yesterdayDate) {
  try {
    // First, try to get solution from leaderboard table
    const { data, error } = await supabase
      .from(LEADERBOARD_TABLE)
      .select('username, moves, time_ms, score, history')
      .eq('date', yesterdayDate)
      .order('score', { ascending: false })
      .limit(50); // Get top 50 to find the best one
    
    if (error) {
      console.error('Error fetching best solution from leaderboard:', error);
      // Continue to fallback
    }
    
    let bestSolution = null;
    let historyArray = [];
    
    if (data && data.length > 0) {
      // Sort by score DESC, then moves ASC, then time ASC
      const sorted = data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.moves !== b.moves) return a.moves - b.moves;
        return a.time_ms - b.time_ms;
      });
      
      bestSolution = sorted[0];
      
      // Check if history exists in leaderboard entry
      if (bestSolution.history) {
        if (Array.isArray(bestSolution.history)) {
          historyArray = bestSolution.history;
        } else if (typeof bestSolution.history === 'string') {
          try {
            historyArray = JSON.parse(bestSolution.history);
          } catch (e) {
            console.error('Error parsing history JSON:', e);
          }
        }
      }
    }
    
    // If history is not available in leaderboard, fallback to daily_challenges table
    if (historyArray.length === 0) {
      const { data: challengeData, error: challengeError } = await supabase
        .from(DAILY_CHALLENGES_TABLE)
        .select('best_solution_history')
        .eq('date', yesterdayDate)
        .single();
      
      if (!challengeError && challengeData && challengeData.best_solution_history) {
        // Parse the history from daily_challenges table
        if (Array.isArray(challengeData.best_solution_history)) {
          historyArray = challengeData.best_solution_history;
        } else if (typeof challengeData.best_solution_history === 'string') {
          try {
            historyArray = JSON.parse(challengeData.best_solution_history);
          } catch (e) {
            console.error('Error parsing best_solution_history JSON:', e);
          }
        }
      }
    }
    
    // If we have a solution from leaderboard, return it (even if history is empty)
    if (bestSolution) {
      return {
        username: bestSolution.username,
        moves: bestSolution.moves,
        // time_ms is stored in seconds, convert to milliseconds
        timeMs: bestSolution.time_ms * 1000,
        score: bestSolution.score,
        history: historyArray,
      };
    }
    
    // If no leaderboard entry but we have history from daily_challenges, return partial solution
    if (historyArray.length > 0) {
      return {
        username: 'Unknown',
        moves: historyArray.length - 1, // Approximate moves based on path length
        timeMs: 0,
        score: 0,
        history: historyArray,
      };
    }
    
    return null;
  } catch (err) {
    console.error('Failed to fetch best solution:', err);
    return null;
  }
}

/**
 * Fetch all data needed for yesterday's challenge display
 * @returns {Promise<{challenge: {startTitle: string, goalTitle: string, date: string} | null, stats: {completionCount: number, averageMoves: number, averageTime: number}, bestSolution: {username: string, moves: number, timeMs: number, score: number, history: string[]} | null}>}
 */
export async function fetchYesterdayChallengeData() {
  const yesterdayDate = getYesterdayDateString();
  
  const [challenge, stats, bestSolution] = await Promise.all([
    fetchYesterdayChallenge(),
    fetchYesterdayCompletionStats(yesterdayDate),
    fetchYesterdayBestSolution(yesterdayDate),
  ]);
  
  return {
    challenge,
    stats,
    bestSolution,
    date: yesterdayDate,
  };
}

