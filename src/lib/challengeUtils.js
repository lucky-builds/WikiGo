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
    const totalTime = data.reduce((sum, entry) => sum + (entry.time_ms || 0), 0);
    
    return {
      completionCount,
      averageMoves: Math.round(totalMoves / completionCount),
      averageTime: Math.round(totalTime / completionCount),
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
 * Fetch the highest score solution for yesterday's challenge
 * @param {string} yesterdayDate - Yesterday's date string in YYYY-MM-DD format
 * @returns {Promise<{username: string, moves: number, timeMs: number, score: number, history: string[]} | null>}
 */
export async function fetchYesterdayHighestScore(yesterdayDate) {
  try {
    // Get solution from leaderboard table ordered by score
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from(LEADERBOARD_TABLE)
      .select('username, moves, time_ms, score, history')
      .eq('date', yesterdayDate)
      .order('score', { ascending: false })
      .limit(1);
    
    if (leaderboardError) {
      console.error('Error fetching highest score from leaderboard:', leaderboardError);
      return null;
    }
    
    if (!leaderboardData || leaderboardData.length === 0) {
      return null;
    }
    
    const bestSolution = leaderboardData[0];
    let historyArray = [];
    
    // Parse history if available
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
    
    return {
      username: bestSolution.username,
      moves: bestSolution.moves,
      timeMs: bestSolution.time_ms,
      score: bestSolution.score,
      history: historyArray,
    };
  } catch (err) {
    console.error('Failed to fetch highest score solution:', err);
    return null;
  }
}

/**
 * Fetch the best solution (least moves) for yesterday's challenge
 * First priority: daily_challenges table
 * Second priority: leaderboard table
 * If moves count is the same, prioritize daily_challenges table
 * @param {string} yesterdayDate - Yesterday's date string in YYYY-MM-DD format
 * @returns {Promise<{username: string, moves: number, timeMs: number, score: number, history: string[]} | null>}
 */
export async function fetchYesterdayBestSolution(yesterdayDate) {
  try {
    // First priority: Get solution from daily_challenges table
    const { data: challengeData, error: challengeError } = await supabase
      .from(DAILY_CHALLENGES_TABLE)
      .select('best_solution_history')
      .eq('date', yesterdayDate)
      .single();
    
    let dailyChallengeHistory = [];
    let dailyChallengeMoves = null;
    
    if (!challengeError && challengeData && challengeData.best_solution_history) {
      // Parse the history from daily_challenges table
      if (Array.isArray(challengeData.best_solution_history)) {
        dailyChallengeHistory = challengeData.best_solution_history;
      } else if (typeof challengeData.best_solution_history === 'string') {
        try {
          dailyChallengeHistory = JSON.parse(challengeData.best_solution_history);
        } catch (e) {
          console.error('Error parsing best_solution_history JSON:', e);
        }
      }
      
      // Calculate moves from history (moves = path length - 1)
      if (dailyChallengeHistory.length > 0) {
        dailyChallengeMoves = dailyChallengeHistory.length - 1;
      }
    }
    
    // Second priority: Get solution from leaderboard table
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from(LEADERBOARD_TABLE)
      .select('username, moves, time_ms, score, history')
      .eq('date', yesterdayDate)
      .order('moves', { ascending: true })
      .limit(50); // Get top 50 to find the best one
    
    let bestLeaderboardSolution = null;
    let leaderboardHistory = [];
    
    if (!leaderboardError && leaderboardData && leaderboardData.length > 0) {
      // Sort by moves ASC, then time ASC, then score DESC
      const sorted = leaderboardData.sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        if (a.time_ms !== b.time_ms) return a.time_ms - b.time_ms;
        return b.score - a.score;
      });
      
      bestLeaderboardSolution = sorted[0];
      
      // Check if history exists in leaderboard entry
      if (bestLeaderboardSolution.history) {
        if (Array.isArray(bestLeaderboardSolution.history)) {
          leaderboardHistory = bestLeaderboardSolution.history;
        } else if (typeof bestLeaderboardSolution.history === 'string') {
          try {
            leaderboardHistory = JSON.parse(bestLeaderboardSolution.history);
          } catch (e) {
            console.error('Error parsing history JSON:', e);
          }
        }
      }
    }
    
    // Compare solutions and prioritize based on rules:
    // 1. If daily_challenges has a solution, check if leaderboard has one
    // 2. If moves count is the same, prioritize daily_challenges
    // 3. Otherwise, use the one with fewer moves
    
    if (dailyChallengeMoves !== null && dailyChallengeHistory.length > 0) {
      // We have a solution from daily_challenges
      if (bestLeaderboardSolution) {
        const leaderboardMoves = bestLeaderboardSolution.moves || Infinity;
        
        // If moves are the same, prioritize daily_challenges
        if (dailyChallengeMoves === leaderboardMoves) {
          return {
            username: 'Daily Challenge',
            moves: dailyChallengeMoves,
            timeMs: 0,
            score: 0,
            history: dailyChallengeHistory,
          };
        }
        
        // If daily_challenges has fewer moves, use it
        if (dailyChallengeMoves < leaderboardMoves) {
          return {
            username: 'Daily Challenge',
            moves: dailyChallengeMoves,
            timeMs: 0,
            score: 0,
            history: dailyChallengeHistory,
          };
        }
        
        // If leaderboard has fewer moves, use it
        return {
          username: bestLeaderboardSolution.username,
          moves: bestLeaderboardSolution.moves,
          timeMs: bestLeaderboardSolution.time_ms,
          score: bestLeaderboardSolution.score,
          history: leaderboardHistory.length > 0 ? leaderboardHistory : dailyChallengeHistory,
        };
      } else {
        // No leaderboard solution, use daily_challenges
        return {
          username: 'Daily Challenge',
          moves: dailyChallengeMoves,
          timeMs: 0,
          score: 0,
          history: dailyChallengeHistory,
        };
      }
    } else if (bestLeaderboardSolution) {
      // Only leaderboard solution available
      return {
        username: bestLeaderboardSolution.username,
        moves: bestLeaderboardSolution.moves,
        timeMs: bestLeaderboardSolution.time_ms,
        score: bestLeaderboardSolution.score,
        history: leaderboardHistory,
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
 * @returns {Promise<{challenge: {startTitle: string, goalTitle: string, date: string} | null, stats: {completionCount: number, averageMoves: number, averageTime: number}, bestSolution: {username: string, moves: number, timeMs: number, score: number, history: string[]} | null}, highestScore: {username: string, moves: number, timeMs: number, score: number, history: string[]} | null}>}
 */
export async function fetchYesterdayChallengeData() {
  const yesterdayDate = getYesterdayDateString();
  
  const [challenge, stats, bestSolution, highestScore] = await Promise.all([
    fetchYesterdayChallenge(),
    fetchYesterdayCompletionStats(yesterdayDate),
    fetchYesterdayBestSolution(yesterdayDate),
    fetchYesterdayHighestScore(yesterdayDate),
  ]);
  
  return {
    challenge,
    stats,
    bestSolution,
    highestScore,
    date: yesterdayDate,
  };
}

