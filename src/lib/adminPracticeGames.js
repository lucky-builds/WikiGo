// Admin functions for managing practice games (Zen Mode)

import { supabase, PRACTICE_GAMES_TABLE } from './supabase';

/**
 * Insert a single practice game
 * @param {Object} game - Game object
 * @param {string} game.start_title - Start article title
 * @param {string} game.goal_title - Goal article title
 * @param {Array<string>} game.solution_history - Array of article titles representing the solution path
 * @param {string} game.date - Optional date in YYYY-MM-DD format (if null, game is always available)
 * @returns {Promise<{success: boolean, error?: string, id?: string}>}
 */
export async function insertPracticeGame({ start_title, goal_title, solution_history, date = null }) {
  try {
    // If solution_history is empty or invalid, create a minimal one with just start and goal
    if (!solution_history || !Array.isArray(solution_history) || solution_history.length === 0) {
      solution_history = [start_title, goal_title];
    } else {
      // Ensure solution_history starts with start_title and ends with goal_title
      // Remove duplicates while preserving order
      const cleanHistory = [];
      if (solution_history[0] !== start_title) {
        cleanHistory.push(start_title);
      }
      
      solution_history.forEach(title => {
        if (title && title.trim() && !cleanHistory.includes(title.trim())) {
          cleanHistory.push(title.trim());
        }
      });
      
      if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1] !== goal_title) {
        // Remove goal_title if it's already in the middle
        const filtered = cleanHistory.filter(t => t !== goal_title);
        filtered.push(goal_title);
        solution_history = filtered;
      } else {
        solution_history = cleanHistory;
      }
    }

    const { data, error } = await supabase
      .from(PRACTICE_GAMES_TABLE)
      .insert([
        {
          start_title,
          goal_title,
          solution_history: solution_history.length > 0 ? solution_history : [start_title, goal_title],
          date: date || null,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting practice game:', error);
      return { success: false, error: error.message || 'Failed to insert practice game' };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error inserting practice game:', error);
    return { success: false, error: error.message || 'Failed to insert practice game' };
  }
}

/**
 * Insert multiple practice games (bulk)
 * @param {Array<Object>} games - Array of game objects
 * @returns {Promise<{success: boolean, errors?: Array<{index: number, error: string}>, inserted: number}>}
 */
export async function insertPracticeGamesBulk(games) {
  try {
    // Validate and prepare games
    const validGames = games.map(game => {
      let { solution_history } = game;
      
      // Ensure solution_history is an array
      if (!solution_history || !Array.isArray(solution_history)) {
        if (typeof solution_history === 'string' && solution_history.trim()) {
          try {
            solution_history = JSON.parse(solution_history);
          } catch {
            solution_history = solution_history.split(',').map(s => s.trim()).filter(Boolean);
          }
        } else {
          solution_history = [];
        }
      }

      // If solution_history is empty, create a minimal one with just start and goal
      if (solution_history.length === 0) {
        solution_history = [game.start_title, game.goal_title];
      } else {
        // Ensure solution_history starts with start_title and ends with goal_title
        // Remove duplicates while preserving order
        const cleanHistory = [];
        if (solution_history[0] !== game.start_title) {
          cleanHistory.push(game.start_title);
        }
        
        solution_history.forEach(title => {
          if (title && title.trim() && !cleanHistory.includes(title.trim())) {
            cleanHistory.push(title.trim());
          }
        });
        
        if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1] !== game.goal_title) {
          // Remove goal_title if it's already in the middle
          const filtered = cleanHistory.filter(t => t !== game.goal_title);
          filtered.push(game.goal_title);
          solution_history = filtered;
        } else {
          solution_history = cleanHistory;
        }
      }

      return {
        start_title: game.start_title,
        goal_title: game.goal_title,
        solution_history,
        date: game.date || null,
      };
    });

    const { data, error } = await supabase
      .from(PRACTICE_GAMES_TABLE)
      .insert(validGames)
      .select();

    if (error) {
      // Try inserting one by one to find which ones failed
      const errors = [];
      let inserted = 0;
      for (let i = 0; i < validGames.length; i++) {
        const result = await insertPracticeGame(validGames[i]);
        if (result.success) {
          inserted++;
        } else {
          errors.push({ index: i, error: result.error });
        }
      }
      return { success: errors.length === 0, errors, inserted };
    }

    return { success: true, inserted: data?.length || 0, errors: [] };
  } catch (error) {
    console.error('Error inserting practice games bulk:', error);
    return { success: false, errors: [{ index: -1, error: error.message || 'Failed to insert practice games' }], inserted: 0 };
  }
}

