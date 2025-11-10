import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flag, Target, CheckCircle2, Eye, Lock, Loader2, ArrowRight, PlayCircle, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * ZenModeSelection Component
 * Displays all 5 practice games with completion status
 * Allows user to select an available game to start
 */
export function ZenModeSelection({ 
  practiceGames, 
  gameStatuses, 
  gameSummaries = {},
  loading, 
  onSelectGame,
  onClose 
}) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <Card className={`shadow-xl border-2 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500'
          : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-400'
      }`}>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className={`h-8 w-8 animate-spin ${
            theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
          }`} />
        </CardContent>
      </Card>
    );
  }

  if (!practiceGames || practiceGames.length === 0) {
    return (
      <Card className={`shadow-xl border-2 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500'
          : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-400'
      }`}>
        <CardHeader className="p-4 sm:p-5">
          <CardTitle className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-purple-900'
          }`}>
            🧘 Zen Mode
          </CardTitle>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
          }`}>
            No practice games available. Please check back later.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`shadow-xl border-2 relative z-0 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-blue-900/30 border-purple-500'
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border-purple-400'
    }`}>
      <CardHeader className="p-3 sm:p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-purple-900'
          }`}>
            <span className="text-xl">🧘</span>
            Zen Mode - Practice
          </CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`h-8 w-8 min-w-[36px] min-h-[36px] ${
                theme === 'dark' ? 'text-white hover:bg-white/20' : 'hover:bg-black/10'
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
          theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
        }`}>
          Practice with 5 pre-defined challenges. <strong>No leaderboard impact.</strong> Forfeit to view solutions.
        </p>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <div className="space-y-2 sm:space-y-3">
          {practiceGames.map((game, index) => {
            const status = gameStatuses?.get(game.id) || 'available';
            const isAvailable = status === 'available';
            const isCompleted = status === 'completed';
            const isSolutionViewed = status === 'solution_viewed';
            const summaries = gameSummaries[game.id] || {};
            const startSummary = summaries.startSummary;
            const goalSummary = summaries.goalSummary;

            return (
              <Card
                key={game.id}
                className={`transition-all duration-200 ${
                  isAvailable
                    ? theme === 'dark'
                      ? 'border-purple-500/60 hover:border-purple-400 hover:shadow-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800/70'
                      : 'border-purple-400 hover:border-purple-500 cursor-pointer hover:shadow-xl bg-white hover:bg-purple-50/50'
                    : theme === 'dark'
                    ? 'border-gray-700/50 opacity-60 bg-slate-800/30'
                    : 'border-gray-300 opacity-60 bg-gray-50'
                }`}
                onClick={() => isAvailable && onSelectGame && onSelectGame(game)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold px-2 py-0.5 ${
                        isCompleted
                          ? theme === 'dark'
                            ? 'border-green-500/60 bg-green-900/30 text-green-300'
                            : 'border-green-600 bg-green-50 text-green-700'
                          : isSolutionViewed
                          ? theme === 'dark'
                            ? 'border-amber-500/60 bg-amber-900/30 text-amber-300'
                            : 'border-amber-600 bg-amber-50 text-amber-700'
                          : theme === 'dark'
                          ? 'border-purple-500/60 bg-purple-900/30 text-purple-300'
                          : 'border-purple-600 bg-purple-50 text-purple-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </>
                      ) : isSolutionViewed ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Viewed
                        </>
                      ) : (
                        <>
                          <Flag className="h-3 w-3 mr-1" />
                          Available
                        </>
                      )}
                    </Badge>
                    {!isAvailable && (
                      <Lock className={`h-4 w-4 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Start Article */}
                    <div className={`p-2 sm:p-2.5 rounded border ${
                      theme === 'dark'
                        ? 'bg-blue-900/20 border-blue-700/50'
                        : 'bg-blue-50/80 border-blue-200'
                    }`}>
                      <div className="flex gap-2 sm:gap-3">
                        {startSummary?.thumbnail && (
                          <img 
                            src={startSummary.thumbnail} 
                            alt={startSummary.title} 
                            className="h-12 w-12 sm:h-14 sm:w-14 rounded object-cover flex-shrink-0 border shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs sm:text-sm font-semibold mb-0.5 flex items-center gap-1 ${
                            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                          }`}>
                            <Flag className="h-3 w-3" />
                            Start
                          </div>
                          <div className={`text-sm sm:text-base font-bold break-words leading-tight ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {game.start_title}
                          </div>
                          {startSummary?.description && (
                            <div className={`text-xs mt-0.5 line-clamp-1 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                            }`}>
                              {startSummary.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center py-0.5">
                      <ArrowRight className={`h-4 w-4 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                    </div>

                    {/* Goal Article */}
                    <div className={`p-2 sm:p-2.5 rounded border ${
                      theme === 'dark'
                        ? 'bg-yellow-900/20 border-yellow-700/50'
                        : 'bg-yellow-50/80 border-yellow-200'
                    }`}>
                      <div className="flex gap-2 sm:gap-3">
                        {goalSummary?.thumbnail && (
                          <img 
                            src={goalSummary.thumbnail} 
                            alt={goalSummary.title} 
                            className="h-12 w-12 sm:h-14 sm:w-14 rounded object-cover flex-shrink-0 border shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs sm:text-sm font-semibold mb-0.5 flex items-center gap-1 ${
                            theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
                          }`}>
                            <Target className="h-3 w-3" />
                            Goal
                          </div>
                          <div className={`text-sm sm:text-base font-bold break-words leading-tight ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {game.goal_title}
                          </div>
                          {goalSummary?.description && (
                            <div className={`text-xs mt-0.5 line-clamp-1 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                            }`}>
                              {goalSummary.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isAvailable && (
                    <Button
                      className={`w-full mt-3 h-9 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGame && onSelectGame(game);
                      }}
                    >
                      <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                      Start Game
                    </Button>
                  )}
                  {!isAvailable && (
                    <div className={`mt-3 text-center text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {isCompleted ? 'Completed' : 'Solution viewed'}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

