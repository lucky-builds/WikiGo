import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Eye } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDateForDisplay } from '@/lib/challengeUtils';

export function YesterdayChallenge({ challengeData: propChallengeData, onViewSolution }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(!propChallengeData);
  const [challengeData, setChallengeData] = useState(propChallengeData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If prop data is provided, use it; otherwise fetch
    if (propChallengeData) {
      setChallengeData(propChallengeData);
      setLoading(false);
    } else {
      loadYesterdayChallenge();
    }
  }, [propChallengeData]);

  async function loadYesterdayChallenge() {
    try {
      setLoading(true);
      setError(null);
      
      const { fetchYesterdayChallengeData } = await import('@/lib/challengeUtils');
      const data = await fetchYesterdayChallengeData();
      
      if (!data.challenge) {
        // No challenge found for yesterday - that's okay
        setChallengeData(null);
        setLoading(false);
        return;
      }
      
      setChallengeData(data);
    } catch (err) {
      console.error('Error loading yesterday challenge:', err);
      setError('Failed to load yesterday\'s challenge');
    } finally {
      setLoading(false);
    }
  }

  // Don't render if loading or no challenge data
  if (loading) {
    return null; // Don't show loading state - keep it minimal
  }

  if (error || !challengeData || !challengeData.challenge) {
    // Don't show anything if there's no challenge - it's not an error
    return null;
  }

  const { challenge, stats } = challengeData;

  return (
    <Card className={`shadow-sm border ${
      theme === 'dark' 
        ? 'border-amber-700/50 bg-amber-950/20' 
        : theme === 'classic'
        ? 'border-black bg-amber-50'
        : 'border-amber-300 bg-amber-50/50'
    }`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <History className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
              theme === 'dark' ? 'text-amber-400' : theme === 'classic' ? 'text-black' : 'text-amber-600'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs sm:text-sm font-medium ${
                  theme === 'dark' ? 'text-amber-200' : theme === 'classic' ? 'text-black' : 'text-amber-900'
                }`}>
                  Yesterday's Challenge
                </span>
                <Badge variant="outline" className={`text-xs py-0 px-1.5 h-5 ${
                  theme === 'dark' 
                    ? 'border-amber-600/50 text-amber-300 bg-amber-900/30' 
                    : theme === 'classic'
                    ? 'border-black text-black'
                    : 'border-amber-400 text-amber-700 bg-amber-100'
                }`}>
                  {formatDateForDisplay(challenge.date)}
                </Badge>
              </div>
              {stats.completionCount > 0 && (
                <p className={`text-xs mt-0.5 ${
                  theme === 'dark' ? 'text-amber-300/80' : theme === 'classic' ? 'text-black' : 'text-amber-700'
                }`}>
                  {stats.completionCount} {stats.completionCount === 1 ? 'player' : 'players'} completed
                </p>
              )}
            </div>
          </div>
          {stats.completionCount > 0 && (
            <Button
              onClick={() => onViewSolution && onViewSolution(challengeData)}
              variant="outline"
              size="sm"
              className={`flex-shrink-0 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 ${
                theme === 'dark'
                  ? 'border-amber-600/50 text-amber-300 hover:bg-amber-900/40 hover:text-amber-200'
                  : theme === 'classic'
                  ? 'border-black text-black hover:bg-black hover:text-white'
                  : 'border-amber-400 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
              <span className="hidden sm:inline">View Solution</span>
              <span className="sm:hidden">View</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

