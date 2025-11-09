// Latest Game Matches Table with expandable journey view

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Clock, Target, User, Calendar } from 'lucide-react';
import { fetchLatestGameMatches } from '@/lib/adminStats';

function formatTime(seconds) {
  if (!seconds) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDateTime(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LatestGameMatchesTable() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'
  const [expandedRows, setExpandedRows] = useState(new Set());

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchLatestGameMatches(10, filter);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const parseHistory = (history) => {
    if (!history) return [];
    if (Array.isArray(history)) return history;
    if (typeof history === 'string') {
      try {
        return JSON.parse(history);
      } catch {
        return [];
      }
    }
    return [];
  };

  if (loading && matches.length === 0) {
    return (
      <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <CardHeader className="p-4">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Latest Game Matches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-12">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-gray-400' : 'border-slate-400'}`} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <CardHeader className="p-4 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
          <CardTitle className={`text-lg sm:text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Latest Game Matches
          </CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex-1 sm:flex-none text-sm sm:text-xs min-h-[44px] sm:min-h-0"
            >
              All
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
              className="flex-1 sm:flex-none text-sm sm:text-xs min-h-[44px] sm:min-h-0"
            >
              Completed
            </Button>
            <Button
              variant={filter === 'incomplete' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('incomplete')}
              className="flex-1 sm:flex-none text-sm sm:text-xs min-h-[44px] sm:min-h-0"
            >
              Incomplete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {matches.length === 0 ? (
          <p className={`text-center py-8 text-base sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
            No matches found
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-2">
            {matches.map((match) => {
              const isExpanded = expandedRows.has(match.id);
              const history = parseHistory(match.history);
              const isCompleted = match.completed;

              return (
                <div
                  key={match.id}
                  className={`border rounded-lg overflow-hidden ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {/* Main Row */}
                  <div
                    className={`p-3 sm:p-4 cursor-pointer hover:opacity-80 transition-opacity ${
                      theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => toggleRow(match.id)}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 pt-0.5">
                        {isExpanded ? (
                          <ChevronDown className={`h-5 w-5 sm:h-6 sm:w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
                        ) : (
                          <ChevronRight className={`h-5 w-5 sm:h-6 sm:w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
                        )}
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0 pt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        )}
                      </div>

                      {/* Main Content - Stacked on mobile, side-by-side on desktop */}
                      <div className="flex-1 min-w-0">
                        {/* User & Date - Always visible */}
                        <div className="mb-2 sm:mb-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <div className="flex items-center gap-1.5">
                              <User className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
                              <span className={`text-base sm:text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {match.username}
                              </span>
                            </div>
                            {match.is_daily_challenge && (
                              <span className={`text-xs sm:text-xs px-2 py-1 rounded ${
                                theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                              }`}>
                                Daily Challenge
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className={`h-4 w-4 sm:h-4 sm:w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
                            <span className={`text-sm sm:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                              {formatDateTime(match.started_at)}
                            </span>
                          </div>
                        </div>

                        {/* Game Info - Always visible, better mobile formatting */}
                        <div className={`text-sm sm:text-sm mb-2 sm:mb-0 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                          <div className="break-words">
                            <span className="font-medium">{match.start_title}</span>
                            <span className="mx-1.5 sm:mx-2">→</span>
                            <span className="font-medium">{match.goal_title}</span>
                          </div>
                        </div>

                        {/* Stats - Mobile: Stacked, Desktop: Horizontal */}
                        <div className={`${isCompleted ? 'flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0' : 'mt-1'}`}>
                          {isCompleted ? (
                            <>
                              <div className="flex items-center gap-2 sm:block sm:text-right">
                                <span className={`text-xs sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                  Score:
                                </span>
                                <span className={`text-base sm:text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {match.score || '-'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 sm:block sm:text-right">
                                <span className={`text-xs sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                  Moves:
                                </span>
                                <span className={`text-base sm:text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {match.moves || '-'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 sm:block sm:text-right">
                                <span className={`text-xs sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                  Time:
                                </span>
                                <span className={`text-base sm:text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {formatTime(match.time_ms)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className={`text-sm sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                              Not Completed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Journey View */}
                  {isExpanded && (
                    <div className={`border-t p-4 sm:p-4 ${
                      theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-4 sm:mb-3">
                        <Target className={`h-5 w-5 sm:h-4 sm:w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
                        <h4 className={`text-base sm:text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Journey Path {history.length > 0 && `(${history.length} steps)`}
                        </h4>
                      </div>

                      {history.length > 0 ? (
                        <div className="space-y-3 sm:space-y-2">
                          {history.map((article, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-3 sm:gap-3 p-3 sm:p-2 rounded ${
                                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                              }`}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-sm sm:text-xs font-semibold ${
                                index === 0
                                  ? theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
                                  : index === history.length - 1
                                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                                  : theme === 'dark' ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-base sm:text-sm break-words ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {article}
                                </div>
                                {index === 0 && (
                                  <div className={`text-sm sm:text-xs mt-1 sm:mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    Start
                                  </div>
                                )}
                                {index === history.length - 1 && (
                                  <div className={`text-sm sm:text-xs mt-1 sm:mt-0.5 font-semibold ${
                                    isCompleted
                                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                      : theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                                  }`}>
                                    {isCompleted ? 'Goal Reached! 🎉' : 'Current Position'}
                                  </div>
                                )}
                              </div>
                              {index < history.length - 1 && (
                                <div className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>
                                  <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-base sm:text-sm text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                          No journey history available
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className={`mt-4 sm:mt-4 pt-4 sm:pt-4 border-t ${
                        theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                      }`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 text-base sm:text-sm">
                          <div>
                            <div className={`text-sm sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                              Started At
                            </div>
                            <div className={`mt-1.5 sm:mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {formatDateTime(match.started_at)}
                            </div>
                          </div>
                          {match.completed_at && (
                            <div>
                              <div className={`text-sm sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                Completed At
                              </div>
                              <div className={`mt-1.5 sm:mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {formatDateTime(match.completed_at)}
                              </div>
                            </div>
                          )}
                          {match.start_category && (
                            <div>
                              <div className={`text-sm sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                Start Category
                              </div>
                              <div className={`mt-1.5 sm:mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {match.start_category}
                              </div>
                            </div>
                          )}
                          {match.goal_category && (
                            <div>
                              <div className={`text-sm sm:text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                Goal Category
                              </div>
                              <div className={`mt-1.5 sm:mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {match.goal_category}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

