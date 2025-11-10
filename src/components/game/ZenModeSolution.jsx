import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, History, Eye, Flag, Target } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

function prettyTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * ZenModeSolution Component
 * Displays the solution path after user forfeits or completes a Zen Mode game
 */
export function ZenModeSolution({ 
  gameData, 
  isCompleted,
  onClose 
}) {
  const { theme } = useTheme();

  if (!gameData) {
    return null;
  }

  const { start_title, goal_title, solution_history } = gameData;
  const solutionPath = Array.isArray(solution_history) ? solution_history : [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <CardHeader className={`relative p-3 sm:p-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40'
            : theme === 'classic'
            ? 'bg-purple-100'
            : 'bg-gradient-to-r from-purple-100 to-blue-100'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2 pr-8 sm:pr-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <History className={`h-4 w-4 sm:h-5 sm:w-5 ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
              }`} />
              <CardTitle className={`text-base sm:text-lg ${
                theme === 'dark' ? 'text-white' : 'text-purple-900'
              }`}>
                {isCompleted ? 'Game Completed!' : 'Solution'}
              </CardTitle>
            </div>
            {isCompleted ? (
              <span className={`text-xs px-2 py-1 rounded ${
                theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
              }`}>
                ✓ Completed
              </span>
            ) : (
              <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                theme === 'dark' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                <Eye className="h-3 w-3" />
                Solution Viewed
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 ${
              theme === 'dark' ? 'text-white hover:bg-white/20' : 'hover:bg-black/10'
            } h-7 w-7 sm:h-8 sm:w-8 min-w-[44px] min-h-[44px]`}
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {/* Game Info */}
          <div className={`p-2 sm:p-3 rounded-lg border-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700'
              : theme === 'classic'
              ? 'bg-white border-black'
              : 'bg-white border-slate-300'
          }`}>
            <div className="space-y-2">
              <div>
                <div className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                  theme === 'dark' ? 'text-blue-300' : theme === 'classic' ? 'text-black' : 'text-blue-700'
                }`}>
                  <Flag className="h-3 w-3" />
                  Start Article
                </div>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {start_title}
                </div>
              </div>
              <div>
                <div className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                  theme === 'dark' ? 'text-yellow-300' : theme === 'classic' ? 'text-black' : 'text-yellow-700'
                }`}>
                  <Target className="h-3 w-3" />
                  Goal Article
                </div>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {goal_title}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className={`p-2 sm:p-3 rounded-lg border ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : theme === 'classic'
              ? 'bg-slate-50 border-slate-400'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-700'
            }`}>
              {isCompleted 
                ? '🎉 Congratulations! You completed this practice game. This game cannot be replayed.'
                : 'You forfeited and viewed the solution. This game cannot be replayed.'}
            </p>
          </div>

          {/* Solution Path */}
          {solutionPath.length > 0 && (
            <div className={`p-2 sm:p-3 rounded-lg border-2 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700'
                : theme === 'classic'
                ? 'bg-white border-black'
                : 'bg-white border-slate-300'
            }`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <History className={`h-3.5 w-3.5 ${
                  theme === 'dark' ? 'text-slate-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
                }`} />
                <h3 className={`font-semibold text-xs sm:text-sm ${
                  theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                }`}>
                  Solution Path ({solutionPath.length - 1} steps)
                </h3>
              </div>
              
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
              }`}>
                Note: There can be many different ways to traverse between two articles. This is one example path.
              </p>

              <div className={`space-y-1.5 ${
                theme === 'dark' ? 'bg-black/30' : theme === 'classic' ? 'bg-gray-50' : 'bg-slate-50'
              } p-2 sm:p-3 rounded-lg`}>
                {solutionPath.map((article, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : theme === 'classic'
                          ? 'bg-blue-600 text-white border-2 border-black'
                          : 'bg-blue-500 text-white'
                        : index === solutionPath.length - 1
                        ? theme === 'dark'
                          ? 'bg-yellow-600 text-white'
                          : theme === 'classic'
                          ? 'bg-yellow-500 text-white border-2 border-black'
                          : 'bg-yellow-500 text-white'
                        : theme === 'dark'
                        ? 'bg-slate-700 text-white'
                        : theme === 'classic'
                        ? 'bg-gray-200 text-black border-2 border-black'
                        : 'bg-slate-200 text-slate-900'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className={`font-medium text-xs sm:text-sm break-words ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {article}
                        </div>
                        {index === 0 && (
                          <Flag className={`h-3 w-3 flex-shrink-0 ${
                            theme === 'dark' ? 'text-blue-400' : theme === 'classic' ? 'text-blue-600' : 'text-blue-600'
                          }`} />
                        )}
                        {index === solutionPath.length - 1 && (
                          <Target className={`h-3 w-3 flex-shrink-0 ${
                            theme === 'dark' ? 'text-yellow-400' : theme === 'classic' ? 'text-yellow-600' : 'text-yellow-600'
                          }`} />
                        )}
                      </div>
                      {index === 0 && (
                        <div className={`text-xs mt-0.5 ${
                          theme === 'dark' ? 'text-blue-300' : theme === 'classic' ? 'text-black' : 'text-blue-600'
                        }`}>
                          Start
                        </div>
                      )}
                      {index === solutionPath.length - 1 && (
                        <div className={`text-xs mt-0.5 font-semibold ${
                          theme === 'dark' ? 'text-green-400' : theme === 'classic' ? 'text-black' : 'text-green-600'
                        }`}>
                          Goal reached! 🎉
                        </div>
                      )}
                    </div>
                    {index < solutionPath.length - 1 && (
                      <div className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Solution Path Available */}
          {solutionPath.length === 0 && (
            <div className={`p-2 sm:p-3 rounded-lg border-2 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700'
                : theme === 'classic'
                ? 'bg-white border-black'
                : 'bg-white border-slate-300'
            }`}>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
              }`}>
                Solution path not available.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-1">
            <Button
              variant="outline"
              onClick={onClose}
              className="min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

