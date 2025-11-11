import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { GameModeTiles } from './GameModeTiles';

export function HeroSection({ onStartRandomGame, dailyChallenge, dailyChallengeHint, isDailyChallengeCompleted, onStartDailyChallenge, onStartZenMode, zenMode, username, onChangeUsername, isAllZenModeCompleted = false }) {
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
            Navigate from one Wikipedia article to another<br className="hidden sm:block" />
            <span className={`text-lg sm:text-xl md:text-2xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              using only article links. Find the shortest path in the fewest moves.
            </span>
          </>
        )}
      </h2>

      {/* Animated Path Example */}
      {!zenMode && (
        <div className="max-w-5xl mx-auto px-4 py-2">
          <PathExample theme={theme} />
        </div>
      )}

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
        isAllZenModeCompleted={isAllZenModeCompleted}
        minimized={false}
      />
    </div>
  );
}

// Animated Path Example Component
function PathExample({ theme }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const pathSteps = [
    {
      title: "Alan Turing",
      description: "Mathematician & Computer Scientist",
      icon: BookOpen,
      isStart: true,
    },
    {
      title: "Computer Science",
      description: "Found in Alan Turing article",
      icon: BookOpen,
    },
    {
      title: "Artificial Intelligence",
      description: "Found in Computer Science article",
      icon: BookOpen,
    },
    {
      title: "Machine Learning",
      description: "Goal reached! ✓",
      icon: CheckCircle2,
      isGoal: true,
    },
  ];

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= pathSteps.length - 1) {
          return 0; // Reset to start
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isAnimating, pathSteps.length]);

  return (
    <div className="w-full">
      {/* Mobile: Compact dots representation */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {pathSteps.map((step, index) => {
            const isActive = activeStep >= index;
            const isCurrent = activeStep === index;
            const isLast = index === pathSteps.length - 1;

            return (
              <React.Fragment key={index}>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      isCurrent
                        ? theme === 'dark'
                          ? 'bg-blue-400 scale-125'
                          : 'bg-blue-500 scale-125'
                        : isActive
                        ? theme === 'dark'
                          ? 'bg-blue-600'
                          : 'bg-blue-400'
                        : theme === 'dark'
                        ? 'bg-slate-600 opacity-40'
                        : 'bg-slate-400 opacity-40'
                    } ${step.isGoal ? 'ring-2 ring-green-400' : ''}`}
                  />
                  {!isLast && (
                    <div
                      className={`w-6 h-0.5 transition-all duration-500 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-blue-600'
                            : 'bg-blue-400'
                          : theme === 'dark'
                          ? 'bg-slate-600 opacity-40'
                          : 'bg-slate-400 opacity-40'
                      }`}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="text-center">
          <span
            className={`text-[10px] ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {pathSteps[activeStep]?.title}
            </span>
            {' → '}
            <span className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {pathSteps[pathSteps.length - 1]?.title}
            </span>
            {' • '}
            <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {activeStep} / {pathSteps.length - 1} moves
            </span>
          </span>
        </div>
      </div>

      {/* Desktop: Full horizontal cards */}
      <div className="hidden sm:flex items-center justify-center gap-2 md:gap-3">
        {pathSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep >= index;
          const isCurrent = activeStep === index;
          const isLast = index === pathSteps.length - 1;

          return (
            <React.Fragment key={index}>
              {/* Article Card - Compact Horizontal */}
              <div
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-500 flex-shrink-0 ${
                  isCurrent
                    ? theme === 'dark'
                      ? 'bg-blue-600/30 border-blue-400 shadow-md shadow-blue-500/30'
                      : 'bg-blue-100 border-blue-400 shadow-md shadow-blue-300/30'
                    : isActive
                    ? theme === 'dark'
                      ? 'bg-slate-800/70 border-slate-600'
                      : 'bg-white border-slate-300'
                    : theme === 'dark'
                    ? 'bg-slate-900/50 border-slate-700 opacity-60'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                } ${
                  step.isGoal
                    ? theme === 'dark'
                      ? 'ring-1 ring-green-500/50'
                      : 'ring-1 ring-green-400/50'
                    : ''
                }`}
              >
                {/* Pulsing glow effect for current step */}
                {isCurrent && (
                  <div
                    className={`absolute inset-0 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-blue-500/20'
                        : 'bg-blue-400/20'
                    } animate-pulse`}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2 min-w-0">
                  <div
                    className={`flex-shrink-0 p-1.5 rounded-full ${
                      step.isGoal
                        ? theme === 'dark'
                          ? 'bg-green-600/30'
                          : 'bg-green-100'
                        : isCurrent
                        ? theme === 'dark'
                          ? 'bg-blue-600/30'
                          : 'bg-blue-100'
                        : theme === 'dark'
                        ? 'bg-slate-700/50'
                        : 'bg-slate-200'
                    } transition-all duration-500`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        step.isGoal
                          ? theme === 'dark'
                            ? 'text-green-400'
                            : 'text-green-600'
                          : isCurrent
                          ? theme === 'dark'
                            ? 'text-blue-400'
                            : 'text-blue-600'
                          : theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-semibold truncate ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </div>
                    {step.isStart && (
                      <div
                        className={`text-[10px] mt-0.5 ${
                          theme === 'dark'
                            ? 'text-blue-300'
                            : 'text-blue-600'
                        }`}
                      >
                        Start
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrow between cards */}
              {!isLast && (
                <ArrowRight
                  className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 transition-all duration-500 ${
                    isCurrent
                      ? theme === 'dark'
                        ? 'text-blue-400 animate-bounce'
                        : 'text-blue-500 animate-bounce'
                      : activeStep > index
                      ? theme === 'dark'
                        ? 'text-blue-400'
                        : 'text-blue-500'
                      : theme === 'dark'
                      ? 'text-slate-600'
                      : 'text-slate-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Moves counter - Desktop only */}
      <div className="hidden sm:block mt-2 text-center">
        <span
          className={`text-xs ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Example: <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{activeStep} / {pathSteps.length - 1} moves</span>
        </span>
      </div>
    </div>
  );
}
