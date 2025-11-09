// Admin Dashboard Component

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import {
  fetchOverviewStats,
  fetchDailyChallengeStats,
  fetchUserActivityStats,
  fetchLeaderboardStats,
  fetchGamePerformanceStats,
  fetchTimeBasedTrends,
} from '@/lib/adminStats';
import {
  StatCard,
  AdminLineChart,
  AdminBarChart,
  AdminPieChart,
  AdminScatterChart,
} from '@/components/admin/AdminCharts';
import {
  DailyChallengesTable,
  TopUsersTable,
  LeaderboardTable,
  PopularArticlesTable,
  CategoryStatsTable,
} from '@/components/admin/AdminTables';
import {
  Gamepad2,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Calendar,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatTime(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AdminDashboard() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [trendPeriod, setTrendPeriod] = useState('daily');

  // Overview stats
  const [overviewStats, setOverviewStats] = useState(null);
  
  // Daily challenge stats
  const [dailyChallengeStats, setDailyChallengeStats] = useState([]);
  const [dailyChallengeLoading, setDailyChallengeLoading] = useState(false);
  
  // User activity stats
  const [userActivityStats, setUserActivityStats] = useState([]);
  const [userActivityLoading, setUserActivityLoading] = useState(false);
  
  // Leaderboard stats
  const [leaderboardStats, setLeaderboardStats] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  
  // Game performance stats
  const [gamePerformanceStats, setGamePerformanceStats] = useState(null);
  const [gamePerformanceLoading, setGamePerformanceLoading] = useState(false);
  
  // Time-based trends
  const [trendsData, setTrendsData] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(false);

  const loadAllData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Load overview stats
      const overview = await fetchOverviewStats();
      setOverviewStats(overview);

      // Load other stats in parallel
      await Promise.all([
        loadDailyChallengeStats(),
        loadUserActivityStats(),
        loadLeaderboardStats(),
        loadGamePerformanceStats(),
        loadTrendsData(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadDailyChallengeStats = async () => {
    setDailyChallengeLoading(true);
    try {
      const stats = await fetchDailyChallengeStats(dateRange);
      setDailyChallengeStats(stats);
    } catch (error) {
      console.error('Error loading daily challenge stats:', error);
    } finally {
      setDailyChallengeLoading(false);
    }
  };

  const loadUserActivityStats = async () => {
    setUserActivityLoading(true);
    try {
      const stats = await fetchUserActivityStats(dateRange);
      setUserActivityStats(stats);
    } catch (error) {
      console.error('Error loading user activity stats:', error);
    } finally {
      setUserActivityLoading(false);
    }
  };

  const loadLeaderboardStats = async () => {
    setLeaderboardLoading(true);
    try {
      const stats = await fetchLeaderboardStats(dateRange);
      setLeaderboardStats(stats);
    } catch (error) {
      console.error('Error loading leaderboard stats:', error);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const loadGamePerformanceStats = async () => {
    setGamePerformanceLoading(true);
    try {
      const stats = await fetchGamePerformanceStats(dateRange);
      setGamePerformanceStats(stats);
    } catch (error) {
      console.error('Error loading game performance stats:', error);
    } finally {
      setGamePerformanceLoading(false);
    }
  };

  const loadTrendsData = async () => {
    setTrendsLoading(true);
    try {
      const trends = await fetchTimeBasedTrends(trendPeriod, 30);
      setTrendsData(trends);
    } catch (error) {
      console.error('Error loading trends data:', error);
    } finally {
      setTrendsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      loadDailyChallengeStats();
      loadUserActivityStats();
      loadLeaderboardStats();
      loadGamePerformanceStats();
    }
  }, [dateRange]);

  useEffect(() => {
    loadTrendsData();
  }, [trendPeriod]);

  // Prepare chart data
  const dailyChallengeChartData = dailyChallengeStats.map((challenge) => ({
    date: challenge.date,
    completions: challenge.completionCount || 0,
    avgMoves: challenge.avgMoves || 0,
    avgTime: challenge.avgTime || 0,
  }));

  const userActivityChartData = userActivityStats.slice(0, 10).map((user) => ({
    username: user.username,
    started: user.gamesStarted,
    completed: user.gamesCompleted,
  }));

  const scoreDistributionData = leaderboardStats?.scoreDistribution || [];

  const topLeaderboardEntries = leaderboardStats?.entries?.slice(0, 20) || [];

  const categoryPieData = gamePerformanceStats?.categoryStats
    ? Object.entries(gamePerformanceStats.categoryStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    : [];

  const trendsChartData = trendsData.map((trend) => ({
    date: trend.date,
    gamesStarted: trend.gamesStarted,
    gamesCompleted: trend.gamesCompleted,
    completionRate: parseFloat(trend.completionRate),
    avgScore: trend.avgScore,
  }));

  const movesVsTimeData = leaderboardStats?.entries
    ?.slice(0, 100)
    .map((entry) => ({
      moves: entry.moves || 0,
      time: entry.time_ms || 0,
    })) || [];

  if (loading) {
    return (
      <div className={`min-h-screen p-4 md:p-6 ${
        theme === 'dark' ? 'bg-slate-900' : theme === 'classic' ? 'bg-white' : 'bg-slate-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className={`h-12 w-12 animate-spin mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-400'
              }`} />
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${
      theme === 'dark' ? 'bg-slate-900' : theme === 'classic' ? 'bg-white' : 'bg-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
            }`}>
              Admin Dashboard
            </h1>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-600'
            }`}>
              Game statistics and analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => loadAllData(true)}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Games Started"
            value={overviewStats?.totalGamesStarted || 0}
            icon={Gamepad2}
            loading={loading}
          />
          <StatCard
            title="Games Completed"
            value={overviewStats?.totalGamesCompleted || 0}
            icon={Target}
            loading={loading}
          />
          <StatCard
            title="Completion Rate"
            value={`${overviewStats?.completionRate || 0}%`}
            icon={TrendingUp}
            loading={loading}
          />
          <StatCard
            title="Active Users"
            value={overviewStats?.activeUsers || 0}
            icon={Users}
            loading={loading}
          />
          <StatCard
            title="Today's Completions"
            value={overviewStats?.todayCompletions || 0}
            icon={Calendar}
            loading={loading}
          />
          <StatCard
            title="Today's Avg Score"
            value={overviewStats?.todayAvgScore || 0}
            icon={Trophy}
            loading={loading}
          />
        </div>

        {/* Daily Challenge Analytics */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
          }`}>
            Daily Challenge Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AdminLineChart
              data={dailyChallengeChartData}
              dataKey="completions"
              title="Daily Challenge Completions Over Time"
              loading={dailyChallengeLoading}
            />
            <AdminLineChart
              data={dailyChallengeChartData}
              dataKey="avgMoves"
              title="Average Moves Per Challenge"
              loading={dailyChallengeLoading}
            />
          </div>
          <DailyChallengesTable data={dailyChallengeStats} loading={dailyChallengeLoading} />
        </div>

        {/* User Activity */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
          }`}>
            User Activity
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AdminBarChart
              data={userActivityChartData}
              dataKey="started"
              title="Top Users: Games Started vs Completed"
              xAxisKey="username"
              loading={userActivityLoading}
              multipleBars={[
                { dataKey: 'started', name: 'Started', color: '#3b82f6' },
                { dataKey: 'completed', name: 'Completed', color: '#10b981' },
              ]}
            />
            <AdminLineChart
              data={trendsChartData}
              dataKey="gamesStarted"
              title="Games Started Over Time"
              loading={trendsLoading}
              multipleLines={[
                { dataKey: 'gamesStarted', name: 'Started', color: '#3b82f6' },
                { dataKey: 'gamesCompleted', name: 'Completed', color: '#10b981' },
              ]}
            />
          </div>
          <TopUsersTable data={userActivityStats.slice(0, 50)} loading={userActivityLoading} />
        </div>

        {/* Leaderboard Analytics */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
          }`}>
            Leaderboard Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AdminBarChart
              data={scoreDistributionData}
              dataKey="count"
              title="Score Distribution"
              xAxisKey="score"
              loading={leaderboardLoading}
            />
            <AdminScatterChart
              data={movesVsTimeData}
              xKey="moves"
              yKey="time"
              title="Moves vs Time Correlation"
              loading={leaderboardLoading}
            />
          </div>
          <LeaderboardTable data={topLeaderboardEntries} loading={leaderboardLoading} />
        </div>

        {/* Game Performance */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
          }`}>
            Game Performance
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {gamePerformanceStats && (
              <>
                <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
                  <CardHeader className="p-4">
                    <CardTitle className={`text-base font-semibold ${
                      theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                    }`}>
                      Average Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className={`flex justify-between ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        <span>Average Moves:</span>
                        <span className="font-semibold">{gamePerformanceStats.avgMoves || 0}</span>
                      </div>
                      <div className={`flex justify-between ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        <span>Average Time:</span>
                        <span className="font-semibold">
                          {gamePerformanceStats.avgTime ? formatTime(gamePerformanceStats.avgTime) : '0:00'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <AdminPieChart
                  data={categoryPieData}
                  dataKey="value"
                  nameKey="name"
                  title="Category Usage"
                  loading={gamePerformanceLoading}
                />
              </>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PopularArticlesTable
              data={gamePerformanceStats?.popularStartArticles || []}
              loading={gamePerformanceLoading}
              type="start"
            />
            <PopularArticlesTable
              data={gamePerformanceStats?.popularGoalArticles || []}
              loading={gamePerformanceLoading}
              type="goal"
            />
          </div>
          <CategoryStatsTable
            data={gamePerformanceStats?.categoryStats || {}}
            loading={gamePerformanceLoading}
          />
        </div>

        {/* Time-based Trends */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
            }`}>
              Time-based Trends
            </h2>
            <div className="flex gap-2">
              <Button
                variant={trendPeriod === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTrendPeriod('daily')}
              >
                Daily
              </Button>
              <Button
                variant={trendPeriod === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTrendPeriod('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={trendPeriod === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTrendPeriod('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AdminLineChart
              data={trendsChartData}
              dataKey="completionRate"
              title={`Completion Rate (${trendPeriod})`}
              loading={trendsLoading}
            />
            <AdminLineChart
              data={trendsChartData}
              dataKey="avgScore"
              title={`Average Score (${trendPeriod})`}
              loading={trendsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

