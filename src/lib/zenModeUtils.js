// Zen Mode utilities for practice games

import { supabase, PRACTICE_GAMES_TABLE, GAME_ANALYTICS_TABLE } from './supabase';
import { getStoredUsername } from './username';

// Cache key for practice game summaries in localStorage
const PRACTICE_GAMES_SUMMARIES_CACHE_KEY = 'wikiGo-practice-games-summaries';
// Local storage key for completed Zen Mode games count
const ZEN_MODE_COMPLETED_COUNT_KEY = 'wikiGo-zen-mode-completed-count';

/**
 * Fetch summary from Wikipedia API
 * @param {string} title - Article title
 * @returns {Promise<{title: string, description: string, extract: string, thumbnail: string|null, url: string}|null>}
 */
async function fetchSummaryFromWikipedia(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title,
      description: data.description || '',
      extract: data.extract || '',
      thumbnail: data.thumbnail?.source || null,
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };
  } catch (e) {
    console.error(`Error fetching summary for ${title}:`, e);
    return null;
  }
}

/**
 * Get cached practice game summaries from localStorage
 * @returns {Object|null} - Cached summaries object or null
 */
function getCachedPracticeGameSummaries() {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(PRACTICE_GAMES_SUMMARIES_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    // Check if cache is still valid (24 hours)
    if (parsed.timestamp && Date.now() - parsed.timestamp < 86400000) {
      return parsed.summaries;
    }
    return null;
  } catch (e) {
    console.error('Error reading cached practice game summaries:', e);
    return null;
  }
}

/**
 * Cache practice game summaries to localStorage
 * @param {Object} summaries - Summaries object to cache
 */
function cachePracticeGameSummaries(summaries) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRACTICE_GAMES_SUMMARIES_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      summaries: summaries,
    }));
  } catch (e) {
    console.error('Error caching practice game summaries:', e);
  }
}

/**
 * Fetch summaries for practice games with caching
 * @param {Array<{id: string, start_title: string, goal_title: string}>} practiceGames - Array of practice games
 * @returns {Promise<Object>} - Object mapping game IDs to their summaries
 */
export async function fetchPracticeGameSummaries(practiceGames) {
  // Check cache first
  const cached = getCachedPracticeGameSummaries();
  if (cached) {
    // Verify all games have summaries
    const allCached = practiceGames.every(game => 
      cached[game.id] && 
      cached[game.id].startSummary && 
      cached[game.id].goalSummary
    );
    if (allCached) {
      return cached;
    }
  }

  // Fetch summaries for all games
  const summaries = {};
  
  for (const game of practiceGames) {
    try {
      const [startSummary, goalSummary] = await Promise.all([
        fetchSummaryFromWikipedia(game.start_title),
        fetchSummaryFromWikipedia(game.goal_title),
      ]);
      
      summaries[game.id] = {
        startSummary: startSummary || null,
        goalSummary: goalSummary || null,
      };
    } catch (e) {
      console.error(`Error fetching summaries for game ${game.id}:`, e);
      summaries[game.id] = {
        startSummary: null,
        goalSummary: null,
      };
    }
  }

  // Cache the summaries
  cachePracticeGameSummaries(summaries);
  
  return summaries;
}

/**
 * Get today's date string in YYYY-MM-DD format
 * @returns {string} Today's date string
 */
function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Fetch practice games for today's date
 * Falls back to games without dates if no games exist for today
 * @returns {Promise<Array<{id: string, start_title: string, goal_title: string, solution_history: string[], date?: string}>>}
 */
export async function fetchPracticeGames() {
  try {
    const today = getDateString();
    
    // First, try to fetch games for today's date
    let { data, error } = await supabase
      .from(PRACTICE_GAMES_TABLE)
      .select('id, start_title, goal_title, solution_history, date')
      .eq('date', today)
      .order('created_at', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching practice games:', error);
      throw error;
    }

    // If no games for today, fall back to games without dates (legacy games)
    if (!data || data.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from(PRACTICE_GAMES_TABLE)
        .select('id, start_title, goal_title, solution_history, date')
        .is('date', null)
        .order('created_at', { ascending: true })
        .limit(5);

      if (fallbackError) {
        console.error('Error fetching fallback practice games:', fallbackError);
        throw fallbackError;
      }

      data = fallbackData;
    }

    // If still no games, try getting any games (for backward compatibility)
    if (!data || data.length === 0) {
      const { data: anyData, error: anyError } = await supabase
        .from(PRACTICE_GAMES_TABLE)
        .select('id, start_title, goal_title, solution_history, date')
        .order('created_at', { ascending: true })
        .limit(5);

      if (anyError) {
        console.error('Error fetching any practice games:', anyError);
        throw anyError;
      }

      data = anyData;
    }

    if (!data || data.length === 0) {
      console.warn('No practice games found in database');
      return [];
    }

    // Parse solution_history if it's a string, or create minimal path if NULL
    return data.map(game => {
      let solutionHistory = [];
      
      if (game.solution_history) {
        if (Array.isArray(game.solution_history)) {
          solutionHistory = game.solution_history;
        } else if (typeof game.solution_history === 'string') {
          try {
            solutionHistory = JSON.parse(game.solution_history);
          } catch {
            solutionHistory = [];
          }
        }
      }
      
      // If solution_history is NULL or empty, create minimal path [start, goal]
      if (!solutionHistory || solutionHistory.length === 0) {
        solutionHistory = [game.start_title, game.goal_title];
      }
      
      return {
        ...game,
        solution_history: solutionHistory,
      };
    });
  } catch (err) {
    console.error('Failed to fetch practice games:', err);
    return [];
  }
}

/**
 * Check if user has completed or viewed solution for a specific practice game
 * @param {string} username - User's username
 * @param {string} startTitle - Start article title
 * @param {string} goalTitle - Goal article title
 * @returns {Promise<'completed' | 'solution_viewed' | 'available'>}
 */
export async function checkZenModeGameStatus(username, startTitle, goalTitle) {
  if (!username) {
    return 'available';
  }

  try {
    const { data, error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('completed, solution_viewed')
      .eq('username', username)
      .eq('start_title', startTitle)
      .eq('goal_title', goalTitle)
      .eq('is_zen_mode', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no record found, game is available
      if (error.code === 'PGRST116') {
        return 'available';
      }
      console.error('Error checking Zen Mode game status:', error);
      return 'available';
    }

    if (!data) {
      return 'available';
    }

    // Check if completed
    if (data.completed) {
      return 'completed';
    }

    // Check if solution was viewed
    if (data.solution_viewed) {
      return 'solution_viewed';
    }

    return 'available';
  } catch (err) {
    console.error('Failed to check Zen Mode game status:', err);
    return 'available';
  }
}

/**
 * Get list of practice game IDs that user has completed or viewed solution for
 * @param {string} username - User's username
 * @returns {Promise<Set<string>>} - Set of practice game IDs
 */
export async function getCompletedZenModeGames(username) {
  if (!username) {
    return new Set();
  }

  try {
    const { data, error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('start_title, goal_title')
      .eq('username', username)
      .eq('is_zen_mode', true)
      .or('completed.eq.true,solution_viewed.eq.true');

    if (error) {
      console.error('Error fetching completed Zen Mode games:', error);
      return new Set();
    }

    if (!data || data.length === 0) {
      return new Set();
    }

    // Create a set of game identifiers (start_title + goal_title)
    // We'll match these against practice games to find completed ones
    return new Set(data.map(game => `${game.start_title}|||${game.goal_title}`));
  } catch (err) {
    console.error('Failed to get completed Zen Mode games:', err);
    return new Set();
  }
}

/**
 * Mark solution as viewed for a Zen Mode game
 * @param {string} gameSessionId - Game session ID from game_analytics
 * @returns {Promise<boolean>} - Success status
 */
export async function markZenModeSolutionViewed(gameSessionId) {
  if (!gameSessionId) {
    return false;
  }

  try {
    const { error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .update({
        solution_viewed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', gameSessionId);

    if (error) {
      console.error('Error marking Zen Mode solution as viewed:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to mark Zen Mode solution as viewed:', err);
    return false;
  }
}

/**
 * Check completion status for all practice games
 * @param {string} username - User's username
 * @param {Array<{id: string, start_title: string, goal_title: string}>} practiceGames - Array of practice games
 * @returns {Promise<Map<string, 'completed' | 'solution_viewed' | 'available'>>} - Map of game ID to status
 */
export async function checkAllZenModeGameStatuses(username, practiceGames) {
  const statusMap = new Map();

  if (!username || !practiceGames || practiceGames.length === 0) {
    // If no username or games, mark all as available
    practiceGames?.forEach(game => {
      statusMap.set(game.id, 'available');
    });
    return statusMap;
  }

  // Get all completed games at once
  const completedGames = await getCompletedZenModeGames(username);

  // Check each practice game
  for (const game of practiceGames) {
    const gameKey = `${game.start_title}|||${game.goal_title}`;
    
    if (completedGames.has(gameKey)) {
      // Check if it's completed or just solution viewed
      const status = await checkZenModeGameStatus(username, game.start_title, game.goal_title);
      statusMap.set(game.id, status);
    } else {
      statusMap.set(game.id, 'available');
    }
  }

  return statusMap;
}

/**
 * Get the count of completed Zen Mode games from local storage
 * @returns {number} - Count of completed games
 */
export function getZenModeCompletedCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const count = localStorage.getItem(ZEN_MODE_COMPLETED_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (e) {
    console.error('Error reading Zen Mode completed count from localStorage:', e);
    return 0;
  }
}

/**
 * Set the count of completed Zen Mode games in local storage
 * @param {number} count - Count of completed games
 */
export function setZenModeCompletedCount(count) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ZEN_MODE_COMPLETED_COUNT_KEY, count.toString());
  } catch (e) {
    console.error('Error saving Zen Mode completed count to localStorage:', e);
  }
}

/**
 * Increment the count of completed Zen Mode games in local storage
 */
export function incrementZenModeCompletedCount() {
  const currentCount = getZenModeCompletedCount();
  setZenModeCompletedCount(currentCount + 1);
}

/**
 * Update the completed count based on game statuses
 * @param {Map<string, 'completed' | 'solution_viewed' | 'available'>} gameStatuses - Map of game statuses
 * @param {number} totalGames - Total number of Zen Mode games
 */
export function updateZenModeCompletedCount(gameStatuses, totalGames) {
  if (!gameStatuses || gameStatuses.size === 0) {
    setZenModeCompletedCount(0);
    return;
  }

  let completedCount = 0;
  for (const [gameId, status] of gameStatuses.entries()) {
    if (status === 'completed' || status === 'solution_viewed') {
      completedCount++;
    }
  }

  // Ensure count doesn't exceed total games
  const finalCount = Math.min(completedCount, totalGames);
  setZenModeCompletedCount(finalCount);
}

/**
 * Check if all Zen Mode games are completed based on local storage
 * @param {number} totalGames - Total number of Zen Mode games (default: 5)
 * @returns {boolean} - True if all games are completed
 */
export function areAllZenModeGamesCompleted(totalGames = 5) {
  const completedCount = getZenModeCompletedCount();
  return completedCount >= totalGames;
}

