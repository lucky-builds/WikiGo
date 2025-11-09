// Admin functions for managing daily challenges

import { supabase, DAILY_CHALLENGES_TABLE } from './supabase';

/**
 * Insert a single daily challenge
 * @param {Object} challenge - Challenge object
 * @param {string} challenge.date - Date in YYYY-MM-DD format
 * @param {string} challenge.start_title - Start article title
 * @param {string} challenge.goal_title - Goal article title
 * @param {string} challenge.hint - Optional hint
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
export async function insertDailyChallenge({ date, start_title, goal_title, hint = null }) {
  try {
    const { data, error } = await supabase
      .from(DAILY_CHALLENGES_TABLE)
      .insert([
        {
          date,
          start_title,
          goal_title,
          hint,
        },
      ])
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate date error
      if (error.code === '23505') {
        return { success: false, error: `A challenge already exists for date ${date}` };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error inserting daily challenge:', error);
    return { success: false, error: error.message || 'Failed to insert challenge' };
  }
}

/**
 * Insert multiple daily challenges (bulk)
 * @param {Array<Object>} challenges - Array of challenge objects
 * @returns {Promise<{success: boolean, errors?: Array<{index: number, error: string}>, inserted: number}>}
 */
export async function insertDailyChallengesBulk(challenges) {
  try {
    const { data, error } = await supabase
      .from(DAILY_CHALLENGES_TABLE)
      .insert(challenges)
      .select();

    if (error) {
      // Try to parse which ones failed
      const errors = [];
      if (error.code === '23505') {
        // Duplicate key error - try inserting one by one to find duplicates
        let inserted = 0;
        for (let i = 0; i < challenges.length; i++) {
          const result = await insertDailyChallenge(challenges[i]);
          if (result.success) {
            inserted++;
          } else {
            errors.push({ index: i, error: result.error });
          }
        }
        return { success: errors.length === 0, errors, inserted };
      }
      return { success: false, errors: [{ index: -1, error: error.message }], inserted: 0 };
    }

    return { success: true, inserted: data?.length || 0, errors: [] };
  } catch (error) {
    console.error('Error inserting daily challenges bulk:', error);
    return { success: false, errors: [{ index: -1, error: error.message || 'Failed to insert challenges' }], inserted: 0 };
  }
}

