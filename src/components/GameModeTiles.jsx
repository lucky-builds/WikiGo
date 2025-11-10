import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

export function GameModeTiles({ 
  onStartRandomGame, 
  dailyChallenge, 
  isDailyChallengeCompleted, 
  onStartDailyChallenge, 
  onStartZenMode,
  minimized = false 
}) {
  const { theme } = useTheme();

  const tileHeight = minimized ? 'h-24 sm:h-32' : 'h-64 sm:h-80 md:h-96';
  const textSize = minimized ? 'text-sm sm:text-base' : 'text-2xl sm:text-3xl md:text-4xl';
  const subtitleSize = minimized ? 'text-xs' : 'text-sm sm:text-base md:text-lg';
  const padding = minimized ? 'p-3 sm:p-4' : 'p-6 sm:p-8';

  return (
    <div className="w-full mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {/* Daily Challenge Tile */}
        {dailyChallenge && !isDailyChallengeCompleted && onStartDailyChallenge && (
          <Card
            onClick={onStartDailyChallenge}
            className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden group ${
              theme === 'dark'
                ? 'border-4 border-purple-500/50 shadow-purple-500/20 hover:border-purple-400 hover:shadow-purple-500/40'
                : 'border-4 border-purple-500/50 shadow-purple-500/20 hover:border-purple-400 hover:shadow-purple-500/40'
            }`}
          >
            <CardContent className="p-0">
              <div className={`relative w-full ${tileHeight} overflow-hidden`}>
                <img 
                  src="/DailyMode.png" 
                  alt="Daily Challenge" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className={`absolute bottom-0 left-0 right-0 ${padding}`}>
                  <h3 className={`${textSize} font-black mb-1 sm:mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-white`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(147,51,234,0.5)' }}>
                    Daily Challenge
                  </h3>
                  {!minimized && (
                    <p className={`${subtitleSize} font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] text-purple-100`} style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                      Compete globally with today's challenge
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Zen Mode Tile */}
        {onStartZenMode && (
          <Card
            onClick={onStartZenMode}
            className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden group ${
              theme === 'dark'
                ? 'border-4 border-emerald-500/50 shadow-emerald-500/20 hover:border-emerald-400 hover:shadow-emerald-500/40'
                : 'border-4 border-emerald-500/50 shadow-emerald-500/20 hover:border-emerald-400 hover:shadow-emerald-500/40'
            }`}
          >
            <CardContent className="p-0">
              <div className={`relative w-full ${tileHeight} overflow-hidden`}>
                <img 
                  src="/ZenMode.jpg" 
                  alt="Zen Mode" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className={`absolute bottom-0 left-0 right-0 ${padding}`}>
                  <h3 className={`${textSize} font-black mb-1 sm:mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-white`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(16,185,129,0.5)' }}>
                    Zen Mode
                  </h3>
                  {!minimized && (
                    <p className={`${subtitleSize} font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] text-emerald-100`} style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                      Practice without leaderboard impact
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Random Game Tile */}
        {onStartRandomGame && (
          <Card
            onClick={onStartRandomGame}
            className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden group ${
              theme === 'dark'
                ? 'border-4 border-slate-500/50 shadow-slate-500/20 hover:border-slate-400 hover:shadow-slate-500/40 bg-gray-900/50'
                : 'border-4 border-slate-500/50 shadow-slate-500/20 hover:border-slate-400 hover:shadow-slate-500/40 bg-white/95'
            }`}
          >
            <CardContent className="p-0">
              <div className={`relative w-full ${tileHeight} overflow-hidden`}>
                <img 
                  src="/RandomMode.png" 
                  alt="Random Game" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className={`absolute inset-0 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-t from-black/90 via-black/50 to-black/20'
                    : 'bg-gradient-to-t from-black/80 via-black/40 to-black/10'
                }`} />
                <div className={`absolute bottom-0 left-0 right-0 ${padding}`}>
                  <h3 className={`${textSize} font-black mb-1 sm:mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${
                    theme === 'dark' ? 'text-white' : 'text-white'
                  }`} style={{ textShadow: theme === 'dark' ? '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(148,163,184,0.5)' : '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(148,163,184,0.5)' }}>
                    Random Game
                  </h3>
                  {!minimized && (
                    <p className={`${subtitleSize} font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-100'
                    }`} style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                      Start a random challenge anytime
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

