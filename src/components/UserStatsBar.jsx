import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Puzzle, Trophy, Loader2, User, Edit2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getAllUserStats } from '@/lib/userStats';

export function UserStatsBar({ username, onChangeUsername }) {
  const { theme } = useTheme();
  const [stats, setStats] = useState({ streak: 0, totalCompletions: 0, globalRank: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadStats() {
    try {
      const userStats = await getAllUserStats();
      setStats(userStats);
    } catch (err) {
      console.error('Error loading user stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        <Loader2 className={`h-4 w-4 animate-spin ${
          theme === 'dark' ? 'text-gray-400' : 'text-slate-400'
        }`} />
      </div>
    );
  }

  // Don't show if no stats
  if (stats.streak === 0 && stats.totalCompletions === 0 && !stats.globalRank) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 flex-wrap justify-center py-2 px-2 rounded-lg ${
      theme === 'dark' 
        ? 'bg-gray-900/50' 
        : 'bg-slate-50'
    }`}>
      {stats.streak > 0 && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 text-xs sm:text-sm ${
            theme === 'dark'
              ? 'border-orange-600/50 text-orange-300 bg-orange-900/30'
              : 'border-orange-400 text-orange-700 bg-orange-50'
          }`}
        >
          <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
          {stats.streak}-Day Streak
        </Badge>
      )}
      
      {stats.totalCompletions > 0 && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 text-xs sm:text-sm ${
            theme === 'dark'
              ? 'border-blue-600/50 text-blue-300 bg-blue-900/30'
              : 'border-blue-400 text-blue-700 bg-blue-50'
          }`}
        >
          <Puzzle className="h-3 w-3 sm:h-4 sm:w-4" />
          {stats.totalCompletions} Challenge{stats.totalCompletions !== 1 ? 's' : ''} Completed
        </Badge>
      )}
      
      {stats.globalRank && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 text-xs sm:text-sm ${
            theme === 'dark'
              ? 'border-yellow-600/50 text-yellow-300 bg-yellow-900/30'
              : 'border-yellow-400 text-yellow-700 bg-yellow-50'
          }`}
        >
          <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
          Global Rank #{stats.globalRank}
        </Badge>
      )}
      
      {username && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 text-xs sm:text-sm ${
            theme === 'dark'
              ? 'border-gray-600/50 text-gray-300 bg-gray-800/50'
              : 'border-slate-400 text-slate-700 bg-white'
          }`}
        >
          <User className="h-3 w-3 sm:h-4 sm:w-4" />
          {username}
          {onChangeUsername && (
            <button
              onClick={onChangeUsername}
              className={`ml-1 p-0.5 rounded hover:opacity-70 transition-opacity ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-100'
              }`}
              title="Change username"
            >
              <Edit2 className={`h-3 w-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`} />
            </button>
          )}
        </Badge>
      )}
    </div>
  );
}

