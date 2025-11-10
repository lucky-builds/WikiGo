import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { GameModeTiles } from './GameModeTiles';

export function HeroSection({ onStartRandomGame, dailyChallenge, dailyChallengeHint, isDailyChallengeCompleted, onStartDailyChallenge, onStartZenMode, zenMode, username, onChangeUsername }) {
  const { theme } = useTheme();

  return (
    <div className={`text-center py-2 sm:py-4 space-y-2 sm:space-y-3 ${
      theme === 'dark' ? 'text-white' : 'text-slate-900'
    }`}>
      {/* Main Tagline */}
      <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        {zenMode ? (
          <>
            🧘 Practice Mode<br className="hidden sm:block" />
            <span className={`text-lg sm:text-xl md:text-2xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              No leaderboard impact. Solutions available.
            </span>
          </>
        ) : (
          <>
            Connect two random Wikipedia topics<br className="hidden sm:block" />
            <span className={`text-lg sm:text-xl md:text-2xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              using logic and curiosity.
            </span>
          </>
        )}
      </h2>

      {/* Daily Challenge Hint */}
      {dailyChallenge && dailyChallengeHint && (
        <div className="max-w-2xl mx-auto px-4">
          <Card className={`shadow-md ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700/50'
              : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
          }`}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`text-sm sm:text-base font-semibold mb-1.5 ${
                    theme === 'dark' ? 'text-purple-200' : 'text-purple-900'
                  }`}>
                    Daily Challenge Hint
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed ${
                    theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
                  }`}>
                    {dailyChallengeHint}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Mode Tiles */}
      <GameModeTiles
        onStartRandomGame={onStartRandomGame}
        dailyChallenge={dailyChallenge}
        isDailyChallengeCompleted={isDailyChallengeCompleted}
        onStartDailyChallenge={onStartDailyChallenge}
        onStartZenMode={onStartZenMode}
        minimized={false}
      />
    </div>
  );
}
