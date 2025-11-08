import React from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Shuffle, User, Edit2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function HeroSection({ onStartRandomGame, dailyChallenge, username, onChangeUsername }) {
  const { theme } = useTheme();

  return (
    <div className={`text-center py-6 sm:py-8 space-y-4 ${
      theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
    }`}>
      {/* Username Display */}
      {username && (
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : theme === 'classic'
              ? 'bg-white border-2 border-black'
              : 'bg-white/80 border border-slate-200'
          }`}>
            <User className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
              theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
            }`} />
            <span className={`text-xs sm:text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-black' : 'text-slate-700'
            }`}>
              {username}
            </span>
            {onChangeUsername && (
              <button
                onClick={onChangeUsername}
                className={`ml-1 p-1 rounded hover:opacity-70 transition-opacity ${
                  theme === 'dark' ? 'hover:bg-gray-700' : theme === 'classic' ? 'hover:bg-gray-100' : 'hover:bg-slate-100'
                }`}
                title="Change username"
              >
                <Edit2 className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                  theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-500'
                }`} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Animated Icon */}
      <div className="flex justify-center mb-2">
        <div className={`relative ${
          theme === 'dark' ? 'text-blue-400' : theme === 'classic' ? 'text-black' : 'text-blue-600'
        }`}>
          <Link2 className="h-12 w-12 sm:h-16 sm:w-16 animate-pulse" />
        </div>
      </div>

      {/* Main Tagline */}
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight ${
        theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black font-serif' : 'text-slate-900'
      }`}>
        Connect two random Wikipedia topics<br className="hidden sm:block" />
        <span className={`text-xl sm:text-2xl md:text-3xl ${
          theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
        }`}>
          using logic and curiosity.
        </span>
      </h2>

      {/* Subtitle */}
      {dailyChallenge && (
        <p className={`text-base sm:text-lg ${
          theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
        }`}>
          Today's Daily Challenge awaits 👇
        </p>
      )}

      {/* Optional Random Game CTA */}
      {dailyChallenge && (
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={onStartRandomGame}
            className={`text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-6 ${
              theme === 'dark'
                ? 'border-purple-600/50 text-purple-300 hover:bg-purple-900/40'
                : theme === 'classic'
                ? 'border-black text-black hover:bg-black hover:text-white'
                : 'border-purple-400 text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Or Start Random Game
          </Button>
        </div>
      )}
    </div>
  );
}

