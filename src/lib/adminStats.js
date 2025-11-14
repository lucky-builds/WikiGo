// Admin statistics and analytics data fetching utilities

import { supabase, GAME_ANALYTICS_TABLE, LEADERBOARD_TABLE, DAILY_CHALLENGES_TABLE } from './supabase';

/**
 * Get unique usernames count
 */
async function getUniqueUsersCount() {
  try {
    const { data, error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('username');
    
    if (error) return { count: 0 };
    
    const usernames = new Set((data || []).map(row => row.username));
    return { count: usernames.size };
  } catch (error) {
    console.error('Error getting unique users:', error);
    return { count: 0 };
  }
}

/**
 * Fetch overview statistics across all tables
 * @returns {Promise<Object>} Overview stats object
 */
export async function fetchOverviewStats() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch all stats in parallel
    const [
      totalGamesStarted,
      totalGamesCompleted,
      uniqueUsers,
      todayCompletions,
      todayAvgScore,
    ] = await Promise.all([
      // Total games started
      supabase
        .from(GAME_ANALYTICS_TABLE)
        .select('id', { count: 'exact', head: true }),
      
      // Total games completed
      supabase
        .from(GAME_ANALYTICS_TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('completed', true),
      
      // Unique users - fetch all and count unique
      getUniqueUsersCount(),
      
      // Today's daily challenge completions
      supabase
        .from(LEADERBOARD_TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('date', today),
      
      // Today's average score
      supabase
        .from(LEADERBOARD_TABLE)
        .select('score')
        .eq('date', today),
    ]);

    const startedCount = totalGamesStarted.count || 0;
    const completedCount = totalGamesCompleted.count || 0;
    const completionRate = startedCount > 0 ? ((completedCount / startedCount) * 100).toFixed(1) : 0;
    const activeUsers = uniqueUsers.count || 0;
    const todayCompletionsCount = todayCompletions.count || 0;
    
    // Calculate today's average score
    let todayAvg = 0;
    if (todayAvgScore.data && todayAvgScore.data.length > 0) {
      const sum = todayAvgScore.data.reduce((acc, row) => acc + (row.score || 0), 0);
      todayAvg = Math.round(sum / todayAvgScore.data.length);
    }

    return {
      totalGamesStarted: startedCount,
      totalGamesCompleted: completedCount,
      completionRate: parseFloat(completionRate),
      activeUsers: activeUsers,
      todayCompletions: todayCompletionsCount,
      todayAvgScore: todayAvg,
    };
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return {
      totalGamesStarted: 0,
      totalGamesCompleted: 0,
      completionRate: 0,
      activeUsers: 0,
      todayCompletions: 0,
      todayAvgScore: 0,
    };
  }
}

/**
 * Fetch daily challenge statistics
 * @param {Object} dateRange - { start: string, end: string } in YYYY-MM-DD format
 * @returns {Promise<Object>} Daily challenge stats
 */
export async function fetchDailyChallengeStats(dateRange = null) {
  try {
    let query = supabase
      .from(DAILY_CHALLENGES_TABLE)
      .select('*')
      .order('date', { ascending: false });

    if (dateRange && dateRange.start && dateRange.end) {
      query = query.gte('date', dateRange.start).lte('date', dateRange.end);
    }

    const { data: challenges, error } = await query;

    if (error) throw error;

    // For each challenge, get completion stats from leaderboard
    const challengesWithStats = await Promise.all(
      (challenges || []).map(async (challenge) => {
        const { data: completions, count } = await supabase
          .from(LEADERBOARD_TABLE)
          .select('score, moves, time_ms', { count: 'exact' })
          .eq('date', challenge.date);

        const completionCount = count || 0;
        let avgMoves = 0;
        let avgTime = 0;
        let avgScore = 0;
        let bestScore = 0;

        if (completions && completions.length > 0) {
          avgMoves = Math.round(
            completions.reduce((sum, c) => sum + (c.moves || 0), 0) / completionCount
          );
          avgTime = Math.round(
            completions.reduce((sum, c) => sum + (c.time_ms || 0), 0) / completionCount / 1000
          ); // Convert from milliseconds to seconds
          avgScore = Math.round(
            completions.reduce((sum, c) => sum + (c.score || 0), 0) / completionCount
          );
          bestScore = Math.max(...completions.map(c => c.score || 0));
        }

        return {
          ...challenge,
          completionCount,
          avgMoves,
          avgTime,
          avgScore,
          bestScore,
        };
      })
    );

    return challengesWithStats;
  } catch (error) {
    console.error('Error fetching daily challenge stats:', error);
    return [];
  }
}

/**
 * Fetch user activity statistics
 * @param {Object} dateRange - { start: string, end: string } in YYYY-MM-DD format
 * @returns {Promise<Object>} User activity stats
 */
export async function fetchUserActivityStats(dateRange = null) {
  try {
    let query = supabase.from(GAME_ANALYTICS_TABLE).select('*');

    if (dateRange && dateRange.start && dateRange.end) {
      query = query.gte('started_at', dateRange.start).lte('started_at', dateRange.end);
    }

    const { data: games, error } = await query;

    if (error) throw error;

    // Group by username
    const userStats = {};
    (games || []).forEach((game) => {
      const username = game.username || 'anonymous';
      if (!userStats[username]) {
        userStats[username] = {
          username,
          gamesStarted: 0,
          gamesCompleted: 0,
          totalScore: 0,
          totalMoves: 0,
          totalTime: 0,
        };
      }
      userStats[username].gamesStarted++;
      if (game.completed) {
        userStats[username].gamesCompleted++;
        userStats[username].totalScore += game.score || 0;
        userStats[username].totalMoves += game.moves || 0;
        userStats[username].totalTime += game.time_ms || 0;
      }
    });

    // Calculate averages and completion rates
    const userActivity = Object.values(userStats).map((user) => ({
      ...user,
      completionRate: user.gamesStarted > 0
        ? ((user.gamesCompleted / user.gamesStarted) * 100).toFixed(1)
        : 0,
      avgScore: user.gamesCompleted > 0
        ? Math.round(user.totalScore / user.gamesCompleted)
        : 0,
      avgMoves: user.gamesCompleted > 0
        ? Math.round(user.totalMoves / user.gamesCompleted)
        : 0,
      avgTime: user.gamesCompleted > 0
        ? Math.round(user.totalTime / user.gamesCompleted / 1000) // Convert from milliseconds to seconds
        : 0,
    }));

    // Sort by games started
    userActivity.sort((a, b) => b.gamesStarted - a.gamesStarted);

    return userActivity;
  } catch (error) {
    console.error('Error fetching user activity stats:', error);
    return [];
  }
}

/**
 * Fetch leaderboard statistics
 * @param {Object} dateRange - { start: string, end: string } in YYYY-MM-DD format
 * @returns {Promise<Object>} Leaderboard stats
 */
export async function fetchLeaderboardStats(dateRange = null) {
  try {
    let query = supabase
      .from(LEADERBOARD_TABLE)
      .select('*')
      .order('score', { ascending: false });

    if (dateRange && dateRange.start && dateRange.end) {
      query = query.gte('date', dateRange.start).lte('date', dateRange.end);
    }

    const { data: entries, error } = await query;

    if (error) throw error;

    if (!entries || entries.length === 0) {
      return {
        entries: [],
        totalSubmissions: 0,
        avgScore: 0,
        avgMoves: 0,
        avgTime: 0,
        scoreDistribution: [],
      };
    }

    const totalSubmissions = entries.length;
    const avgScore = Math.round(
      entries.reduce((sum, e) => sum + (e.score || 0), 0) / totalSubmissions
    );
    const avgMoves = Math.round(
      entries.reduce((sum, e) => sum + (e.moves || 0), 0) / totalSubmissions
    );
    const avgTime = Math.round(
      entries.reduce((sum, e) => sum + (e.time_ms || 0), 0) / totalSubmissions / 1000
    ); // Convert from milliseconds to seconds

    // Score distribution (bins of 100)
    const scoreBins = {};
    entries.forEach((entry) => {
      const bin = Math.floor((entry.score || 0) / 100) * 100;
      scoreBins[bin] = (scoreBins[bin] || 0) + 1;
    });

    const scoreDistribution = Object.entries(scoreBins)
      .map(([score, count]) => ({ score: parseInt(score), count }))
      .sort((a, b) => a.score - b.score);

    return {
      entries,
      totalSubmissions,
      avgScore,
      avgMoves,
      avgTime,
      scoreDistribution,
    };
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    return {
      entries: [],
      totalSubmissions: 0,
      avgScore: 0,
      avgMoves: 0,
      avgTime: 0,
      scoreDistribution: [],
    };
  }
}

/**
 * Fetch game performance statistics
 * @param {Object} dateRange - { start: string, end: string } in YYYY-MM-DD format
 * @returns {Promise<Object>} Game performance stats
 */
export async function fetchGamePerformanceStats(dateRange = null) {
  try {
    let query = supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('*')
      .eq('completed', true);

    if (dateRange && dateRange.start && dateRange.end) {
      query = query.gte('completed_at', dateRange.start).lte('completed_at', dateRange.end);
    }

    const { data: completedGames, error } = await query;

    if (error) throw error;

    if (!completedGames || completedGames.length === 0) {
      return {
        avgMoves: 0,
        avgTime: 0,
        popularStartArticles: [],
        popularGoalArticles: [],
        categoryStats: {},
      };
    }

    // Calculate averages
    const avgMoves = Math.round(
      completedGames.reduce((sum, g) => sum + (g.moves || 0), 0) / completedGames.length
    );
    const avgTime = Math.round(
      completedGames.reduce((sum, g) => sum + (g.time_ms || 0), 0) / completedGames.length / 1000
    ); // Convert from milliseconds to seconds

    // Popular start articles
    const startArticleCounts = {};
    completedGames.forEach((game) => {
      const title = game.start_title;
      startArticleCounts[title] = (startArticleCounts[title] || 0) + 1;
    });
    const popularStartArticles = Object.entries(startArticleCounts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Popular goal articles
    const goalArticleCounts = {};
    completedGames.forEach((game) => {
      const title = game.goal_title;
      goalArticleCounts[title] = (goalArticleCounts[title] || 0) + 1;
    });
    const popularGoalArticles = Object.entries(goalArticleCounts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Category stats
    const categoryStats = {};
    completedGames.forEach((game) => {
      if (game.start_category) {
        categoryStats[game.start_category] = (categoryStats[game.start_category] || 0) + 1;
      }
      if (game.goal_category) {
        categoryStats[game.goal_category] = (categoryStats[game.goal_category] || 0) + 1;
      }
    });

    return {
      avgMoves,
      avgTime,
      popularStartArticles,
      popularGoalArticles,
      categoryStats,
    };
  } catch (error) {
    console.error('Error fetching game performance stats:', error);
    return {
      avgMoves: 0,
      avgTime: 0,
      popularStartArticles: [],
      popularGoalArticles: [],
      categoryStats: {},
    };
  }
}

/**
 * Fetch time-based trends
 * @param {string} period - 'daily', 'weekly', or 'monthly'
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} Time-based trend data
 */
export async function fetchTimeBasedTrends(period = 'daily', days = 30) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: games, error } = await supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('started_at, completed_at, completed, score, moves, time_ms')
      .gte('started_at', startDate.toISOString())
      .lte('started_at', endDate.toISOString());

    if (error) throw error;

    // Group by period
    const trends = {};
    (games || []).forEach((game) => {
      const date = new Date(game.started_at);
      let key;
      
      if (period === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!trends[key]) {
        trends[key] = {
          date: key,
          gamesStarted: 0,
          gamesCompleted: 0,
          totalScore: 0,
          totalMoves: 0,
          totalTime: 0,
        };
      }

      trends[key].gamesStarted++;
      if (game.completed) {
        trends[key].gamesCompleted++;
        trends[key].totalScore += game.score || 0;
        trends[key].totalMoves += game.moves || 0;
        trends[key].totalTime += game.time_ms || 0;
      }
    });

    // Calculate averages and completion rates
    const trendData = Object.values(trends)
      .map((trend) => ({
        ...trend,
        completionRate: trend.gamesStarted > 0
          ? ((trend.gamesCompleted / trend.gamesStarted) * 100).toFixed(1)
          : 0,
        avgScore: trend.gamesCompleted > 0
          ? Math.round(trend.totalScore / trend.gamesCompleted)
          : 0,
        avgMoves: trend.gamesCompleted > 0
          ? Math.round(trend.totalMoves / trend.gamesCompleted)
          : 0,
        avgTime: trend.gamesCompleted > 0
          ? Math.round(trend.totalTime / trend.gamesCompleted / 1000) // Convert from milliseconds to seconds
          : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return trendData;
  } catch (error) {
    console.error('Error fetching time-based trends:', error);
    return [];
  }
}

/**
 * Fetch latest game analytics matches
 * @param {number} limit - Number of matches to fetch (default: 10)
 * @param {string} filter - 'all', 'completed', or 'incomplete'
 * @param {string} gameTypeFilter - 'all', 'daily', 'zen', or 'random'
 * @returns {Promise<Array>} Latest game analytics
 */
export async function fetchLatestGameMatches(limit = 10, filter = 'all', gameTypeFilter = 'all') {
  try {
    // For random filter, fetch more results to account for client-side filtering
    const fetchLimit = gameTypeFilter === 'random' ? limit * 3 : limit;
    
    let query = supabase
      .from(GAME_ANALYTICS_TABLE)
      .select('*')
      .order('started_at', { ascending: false })
      .limit(fetchLimit);

    // Filter by completion status
    if (filter === 'completed') {
      query = query.eq('completed', true);
    } else if (filter === 'incomplete') {
      query = query.eq('completed', false);
    }

    // Filter by game type
    if (gameTypeFilter === 'daily') {
      query = query.eq('is_daily_challenge', true);
    } else if (gameTypeFilter === 'zen') {
      query = query.eq('is_zen_mode', true);
    }
    // Note: For 'random', we don't filter at query level since we need AND logic
    // We'll filter client-side after fetching

    const { data, error } = await query;

    if (error) throw error;

    let results = data || [];

    // Client-side filter for random games (neither daily nor zen)
    if (gameTypeFilter === 'random') {
      results = results.filter(
        (game) => 
          (!game.is_daily_challenge || game.is_daily_challenge === false) &&
          (!game.is_zen_mode || game.is_zen_mode === false)
      );
      // Re-sort after filtering since we may have fetched more than needed
      results.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
      // Limit to requested amount after filtering
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error('Error fetching latest game matches:', error);
    return [];
  }
}

