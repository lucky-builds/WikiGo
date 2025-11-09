import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, History, Trophy, Users, Clock, Move, PlayCircle, Flag, Target } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDateForDisplay } from '@/lib/challengeUtils';

function prettyTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function YesterdaySolution({ challengeData, onClose, onReplay }) {
  const { theme } = useTheme();

  if (!challengeData || !challengeData.challenge || !challengeData.bestSolution) {
    return null;
  }

  const { challenge, stats, bestSolution } = challengeData;
  const solutionPath = bestSolution.history || [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <CardHeader className={`relative p-3 sm:p-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-amber-900/40 to-orange-900/40'
            : theme === 'classic'
            ? 'bg-amber-100'
            : 'bg-gradient-to-r from-amber-100 to-orange-100'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2 pr-8 sm:pr-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <History className={`h-4 w-4 sm:h-5 sm:w-5 ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
              }`} />
              <CardTitle className={`text-base sm:text-lg ${
                theme === 'dark' ? 'text-white' : 'text-amber-900'
              }`}>
                Yesterday's Solution
              </CardTitle>
            </div>
            <Badge variant="default" className={`text-xs ${
              theme === 'dark' ? 'bg-amber-600 dark:bg-amber-500' : 'bg-amber-600'
            }`}>
              {formatDateForDisplay(challenge.date)}
            </Badge>
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
          {/* Statistics */}
          <div className={`p-2 sm:p-3 rounded-lg border-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700'
              : theme === 'classic'
              ? 'bg-white border-black'
              : 'bg-white border-slate-300'
          }`}>
            <h3 className={`font-semibold text-xs sm:text-sm mb-2 ${
              theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
            }`}>
              Statistics
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded ${
                theme === 'dark' ? 'bg-slate-800/50' : theme === 'classic' ? 'bg-gray-100' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className={`h-3.5 w-3.5 ${
                    theme === 'dark' ? 'text-blue-400' : theme === 'classic' ? 'text-black' : 'text-blue-600'
                  }`} />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
                  }`}>
                    Completed
                  </span>
                </div>
                <p className={`text-base sm:text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                }`}>
                  {stats.completionCount}
                </p>
              </div>
              <div className={`p-1.5 sm:p-2 rounded ${
                theme === 'dark' ? 'bg-slate-800/50' : theme === 'classic' ? 'bg-gray-100' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Move className={`h-3.5 w-3.5 ${
                    theme === 'dark' ? 'text-green-400' : theme === 'classic' ? 'text-black' : 'text-green-600'
                  }`} />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
                  }`}>
                    Avg Moves
                  </span>
                </div>
                <p className={`text-base sm:text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                }`}>
                  {stats.averageMoves}
                </p>
              </div>
              <div className={`p-1.5 sm:p-2 rounded ${
                theme === 'dark' ? 'bg-slate-800/50' : theme === 'classic' ? 'bg-gray-100' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Clock className={`h-3.5 w-3.5 ${
                    theme === 'dark' ? 'text-purple-400' : theme === 'classic' ? 'text-black' : 'text-purple-600'
                  }`} />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
                  }`}>
                    Avg Time
                  </span>
                </div>
                <p className={`text-base sm:text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                }`}>
                  {prettyTime(stats.averageTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Best Solution Stats */}
          <div className={`p-2 sm:p-3 rounded-lg border-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-600'
              : theme === 'classic'
              ? 'bg-yellow-50 border-black'
              : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Trophy className={`h-4 w-4 ${
                  theme === 'dark' ? 'text-yellow-400' : theme === 'classic' ? 'text-black' : 'text-yellow-600'
                }`} />
                <h3 className={`font-semibold text-xs sm:text-sm ${
                  theme === 'dark' ? 'text-yellow-200' : theme === 'classic' ? 'text-black' : 'text-yellow-900'
                }`}>
                  Best Solution
                </h3>
              </div>
              {bestSolution.username && bestSolution.username !== 'Unknown' && (
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-yellow-300' : theme === 'classic' ? 'text-black' : 'text-yellow-800'
                }`}>
                  by <strong>{bestSolution.username}</strong>
                </div>
              )}
            </div>
            
            <div className={`flex items-center gap-2 sm:gap-3 flex-wrap ${
              theme === 'dark' ? 'text-yellow-300' : theme === 'classic' ? 'text-black' : 'text-yellow-800'
            }`}>
              {bestSolution.moves > 0 && (
                <div className="flex items-center gap-1">
                  <Move className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    <strong>{bestSolution.moves}</strong> moves
                  </span>
                </div>
              )}
              {bestSolution.timeMs > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    <strong>{prettyTime(bestSolution.timeMs)}</strong>
                  </span>
                </div>
              )}
              {bestSolution.score > 0 && (
                <div className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    Score: <strong>{bestSolution.score}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Example Solution Path */}
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
                  Example Solution Path ({solutionPath.length-1} steps)
                </h3>
              </div>
              
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
              }`}>
                Note: There can be many different ways to traverse between two articles. This is just one example path.
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
                Solution path not available. The path history may not have been saved for this solution.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button
              onClick={onReplay}
              className={`flex-1 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
              }`}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Replay Challenge
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

