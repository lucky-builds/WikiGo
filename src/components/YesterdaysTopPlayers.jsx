import React, { useEffect, useState } from 'react';
import { Medal, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase, LEADERBOARD_TABLE } from '@/lib/supabase';
import { getYesterdayDateString } from '@/lib/challengeUtils';

function prettyTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function YesterdaysTopPlayers() {
  const { theme } = useTheme();
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const yesterday = getYesterdayDateString();

  useEffect(() => {
    fetchTopPlayers();
  }, []);

  async function fetchTopPlayers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(LEADERBOARD_TABLE)
        .select('username, score, moves, time_ms')
        .eq('date', yesterday)
        .order('score', { ascending: false })
        .limit(3);

      if (error) throw error;
      setTopPlayers(data || []);
    } catch (err) {
      console.error('Error fetching yesterday\'s top players:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || topPlayers.length === 0) {
    return null;
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-orange-600" />;
    return null;
  };

  return (
    <div className={`mt-4 p-3 sm:p-4 rounded-lg border ${
      theme === 'dark'
        ? 'bg-gray-800/50 border-gray-700'
        : theme === 'classic'
        ? 'bg-white border-black'
        : 'bg-slate-50 border-slate-200'
    }`}>
      <h4 className={`text-xs sm:text-sm font-semibold mb-2 ${
        theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-700'
      }`}>
        Yesterday's Top Performers 🏆
      </h4>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {topPlayers.map((player, index) => {
          const rank = index + 1;
          return (
            <div
              key={index}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 text-gray-200'
                  : theme === 'classic'
                  ? 'bg-white border border-black text-black'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {getRankIcon(rank)}
              <span className="font-medium">{player.username}</span>
              <span className={`${
                theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-500'
              }`}>
                {player.score} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

