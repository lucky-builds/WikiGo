import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Loader2, Calendar } from 'lucide-react';
import { supabase, LEADERBOARD_TABLE } from '@/lib/supabase';
import { getStoredUsername } from '@/lib/username';
import { useTheme } from '@/contexts/ThemeContext';

function prettyTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function Leaderboard({ onRefresh }) {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUsername = getStoredUsername();
  const today = getDateString();

  useEffect(() => {
    fetchLeaderboard();
  }, [onRefresh]);

  async function fetchLeaderboard() {
    try {
      setLoading(true);
      setError(null);

      // Fetch top 20 scores for today
      const { data: topScores, error: topError } = await supabase
        .from(LEADERBOARD_TABLE)
        .select('*')
        .eq('date', today)
        .order('score', { ascending: false })
        .limit(20);

      if (topError) throw topError;

      setLeaderboard(topScores || []);

      // If user has a username, find their rank
      if (currentUsername) {
        const { data: userScore, error: userError } = await supabase
          .from(LEADERBOARD_TABLE)
          .select('score')
          .eq('date', today)
          .eq('username', currentUsername)
          .order('score', { ascending: false })
          .limit(1)
          .single();

        if (!userError && userScore) {
          // Count how many users have a higher score
          const { count } = await supabase
            .from(LEADERBOARD_TABLE)
            .select('*', { count: 'exact', head: true })
            .eq('date', today)
            .gt('score', userScore.score);

          setUserRank((count || 0) + 1);
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600 font-bold';
    if (rank === 2) return 'text-gray-500 font-bold';
    if (rank === 3) return 'text-orange-600 font-bold';
    return '';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Trophy className={`h-5 w-5 sm:h-6 sm:w-6 ${theme === 'classic' ? 'text-black' : ''}`} />
          Daily Challenge Leaderboard
        </CardTitle>
        <div className={`text-xs sm:text-sm mt-1 flex items-center gap-1 ${
          theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-500'
        }`}>
          <Calendar className="h-3 w-3" />
          <span>Today's Top Players</span>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className={`h-8 w-8 animate-spin ${
              theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-400'
            }`} />
          </div>
        ) : error ? (
          <div className={`text-center py-8 text-sm ${
            theme === 'dark' ? 'text-red-400' : theme === 'classic' ? 'text-black' : 'text-red-600'
          }`}>
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className={`text-center py-8 text-sm ${
            theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-500'
          }`}>
            No scores yet today. Be the first to complete the Daily Challenge!
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isUserEntry = entry.username === currentUsername;
              
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg border-2 transition-colors ${
                    isUserEntry
                      ? theme === 'dark'
                        ? 'bg-blue-900/30 border-blue-600'
                        : theme === 'classic'
                        ? 'bg-white border-black border-4'
                        : 'bg-blue-50 border-blue-300'
                      : theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700'
                      : theme === 'classic'
                      ? 'bg-white border-black'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-[40px]">
                    {getRankIcon(rank)}
                    <span className={`text-sm sm:text-base font-semibold w-6 ${
                      getRankColor(rank) || (theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-700')
                    }`}>
                      {rank}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm sm:text-base flex items-center gap-2 ${
                      isUserEntry
                        ? theme === 'dark' ? 'text-blue-200' : theme === 'classic' ? 'text-black font-bold' : 'text-blue-900'
                        : theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                    }`}>
                      {entry.username}
                      {isUserEntry && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          theme === 'dark'
                            ? 'bg-blue-700 text-blue-100'
                            : theme === 'classic'
                            ? 'bg-black text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          You
                        </span>
                      )}
                    </div>
                    <div className={`text-xs sm:text-sm mt-0.5 flex items-center gap-3 flex-wrap ${
                      theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-600'
                    }`}>
                      <span>Score: <strong>{entry.score}</strong></span>
                      <span>Moves: <strong>{entry.moves}</strong></span>
                      <span>Time: <strong>{prettyTime(entry.time_ms)}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {userRank && userRank > 20 && (
              <div className={`mt-4 pt-4 border-t text-center text-sm ${
                theme === 'dark' ? 'border-slate-700 text-gray-400' : theme === 'classic' ? 'border-black text-black' : 'border-slate-200 text-slate-600'
              }`}>
                Your rank: <strong className={theme === 'classic' ? 'text-black' : ''}>#{userRank}</strong>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

