import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Timer, Flag, Target, Shuffle, PlayCircle, CheckCircle2, Loader2, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatCountdown } from "@/lib/timeUtils";
import { hasSubmittedToday } from "@/lib/username";
import { getDailyChallengeGradient, getDateString, CATEGORIES } from "@/lib/gameConstants";
import { YesterdaysTopPlayers } from "@/components/YesterdaysTopPlayers";

/**
 * GameSetup Component
 * Handles the setup UI for both Daily Challenge and Random Game modes
 * Memoized for performance optimization - prevents unnecessary re-renders
 */
export const GameSetup = React.memo(function GameSetup({
  dailyChallenge,
  startTitle,
  goalTitle,
  startSummary,
  goalSummary,
  startCategory,
  goalCategory,
  won,
  startingGame,
  gameActive,
  timeUntilReset,
  loadingStartRandom,
  loadingGoalRandom,
  onStartTitleChange,
  onGoalTitleChange,
  onStartCategoryChange,
  onGoalCategoryChange,
  onStartGame,
  onSwitchToRandomGame,
  onSetDailyChallenge,
  onResetGame,
  onShowLeaderboard,
  onLeaderboardRefresh,
  onSetError,
  fetchRandomTitle,
  fetchRandomTitleFromCategory,
}) {
  const { theme } = useTheme();

  const handleRandomStart = async () => {
    if (loadingStartRandom || dailyChallenge) return;
    onSetError("");
    try {
      const title = startCategory 
        ? await fetchRandomTitleFromCategory(startCategory)
        : await fetchRandomTitle();
      if (title) {
        onStartTitleChange(title);
      } else {
        onSetError("Could not find a valid start article. The article may be a redirect or have no links. Try again or select a different category.");
      }
    } catch (e) {
      onSetError("Failed to fetch random article. Please try again.");
    }
  };

  const handleRandomGoal = async () => {
    if (loadingGoalRandom || dailyChallenge) return;
    onSetError("");
    try {
      const title = goalCategory 
        ? await fetchRandomTitleFromCategory(goalCategory)
        : await fetchRandomTitle();
      if (title) {
        onGoalTitleChange(title);
      } else {
        onSetError("Could not find a valid goal article. The article may be a redirect or have no links. Try again or select a different category.");
      }
    } catch (e) {
      onSetError("Failed to fetch random article. Please try again.");
    }
  };

  return (
    <>
      {/* Daily Challenge - Card of the Day */}
      {dailyChallenge && (
        <Card className={`shadow-xl border-2 ${getDailyChallengeGradient(theme).card}`}>
          <CardHeader className={`p-4 sm:p-5 ${getDailyChallengeGradient(theme).header}`}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <CardTitle className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-blue-900' : 'text-slate-900'
              }`}>
                <Calendar className={`h-6 w-6 sm:h-7 sm:w-7 ${
                  theme === 'dark' ? 'text-blue-300' : theme === 'classic' ? 'text-blue-600' : 'text-blue-600'
                }`} />
                🧩 Daily Challenge
              </CardTitle>
              <Badge variant="default" className="bg-blue-600 dark:bg-blue-500">
                <Trophy className="h-3 w-3 mr-1" />
                Compete Globally
              </Badge>
            </div>
            {startTitle && goalTitle && (
              <div className={`text-base sm:text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-blue-900' : 'text-slate-900'
              }`}>
                🎯 Connect: <span className="font-bold">{startTitle}</span> → <span className="font-bold">{goalTitle}</span>
              </div>
            )}
            {dailyChallenge && (
              <p className={`text-xs sm:text-sm mt-2 flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-blue-800' : 'text-slate-600'
              }`}>
                <Timer className="h-3 w-3" />
                <span>Challenge resets in: <span className="font-semibold">{formatCountdown(timeUntilReset)}</span></span>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="space-y-4">
              {/* Completion Status */}
              {(hasSubmittedToday(getDateString()) || won) ? (
                <>
                  <div className={`p-4 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500'
                      : theme === 'classic'
                      ? 'bg-green-50 border-green-600 border-4'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                  }`}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={`h-6 w-6 flex-shrink-0 mt-0.5 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${
                          theme === 'dark' ? 'text-green-200' : 'text-green-900'
                        }`}>
                          🎉 You nailed today's challenge!
                        </h3>
                        <p className={`text-sm mb-4 ${
                          theme === 'dark' ? 'text-green-300' : 'text-green-800'
                        }`}>
                          Come back tomorrow for a new one — or test your skills below 👇
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            onClick={() => {
                              onShowLeaderboard();
                              onLeaderboardRefresh();
                            }}
                            className={`${
                              theme === 'dark'
                                ? 'border-green-500 text-green-300 hover:bg-green-900/40'
                                : theme === 'classic'
                                ? 'border-green-600 text-green-900 hover:bg-green-100'
                                : 'border-green-400 text-green-800 hover:bg-green-100'
                            }`}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            See how your path stacks up 🚀
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Random Game Promotion */}
                  <div className={`p-4 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500'
                      : theme === 'classic'
                      ? 'border-purple-600 bg-purple-50 border-4'
                      : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-400'
                  }`}>
                    <div className="text-center space-y-3">
                      <div className="flex justify-center">
                        <Shuffle className={`h-10 w-10 ${
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                      </div>
                      <h3 className={`font-bold text-lg ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-900'
                      }`}>
                        🔀 Play Random WikiGo
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
                      }`}>
                        Connect two surprise topics — no two paths are the same.
                      </p>
                      <Button
                        onClick={onSwitchToRandomGame}
                        className={`w-full sm:w-auto ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        }`}
                      >
                        <Shuffle className="h-4 w-4 mr-2" />
                        Start Random Game
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Challenge Description */}
                  <div className={`p-4 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-800/50'
                      : theme === 'classic'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}>
                    <p className={`text-sm mb-4 leading-relaxed ${
                      theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
                    }`}>
                      Today's challenge uses fixed start and goal articles that are the same for everyone. 
                      Try to complete it in as few moves as possible!
                    </p>
                    
                    {/* Start Article */}
                    {startTitle && (
                      <div className={`mb-4 p-4 rounded-lg border shadow-sm ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-gray-900/50'
                          : theme === 'classic'
                          ? 'border-black bg-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        <div className="flex items-start gap-4">
                          {startSummary?.thumbnail && (
                            <img 
                              src={startSummary.thumbnail} 
                              alt={startSummary.title} 
                              className={`h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover flex-shrink-0 border-2 shadow-md ${
                                theme === 'dark' ? 'border-gray-600' : theme === 'classic' ? 'border-black' : 'border-slate-300'
                              }`}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Flag className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                theme === 'dark' ? 'text-blue-400' : theme === 'classic' ? 'text-black' : 'text-blue-600'
                              }`} />
                              <span className={`text-xs sm:text-sm font-semibold ${
                                theme === 'dark' ? 'text-blue-300' : theme === 'classic' ? 'text-black' : 'text-blue-700'
                              }`}>
                                START ARTICLE
                              </span>
                            </div>
                            <h3 className={`font-bold text-lg sm:text-xl mb-2 break-words leading-tight ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              {startTitle}
                            </h3>
                            {startSummary?.description && (
                              <p className={`text-sm mb-2 leading-relaxed ${
                                theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                              }`}>
                                {startSummary.description}
                              </p>
                            )}
                            {startSummary?.extract && (
                              <p className={`text-xs line-clamp-2 leading-relaxed ${
                                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {startSummary.extract}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Goal Article */}
                    {goalTitle && (
                      <div className={`p-4 rounded-lg border-2 shadow-sm ${
                        theme === 'dark'
                          ? 'border-yellow-600 bg-yellow-900/20'
                          : theme === 'classic'
                          ? 'border-black bg-yellow-50 border-4'
                          : 'border-yellow-400 bg-yellow-50'
                      }`}>
                        <div className="flex items-start gap-4">
                          {goalSummary?.thumbnail && (
                            <img 
                              src={goalSummary.thumbnail} 
                              alt={goalSummary.title} 
                              className={`h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover flex-shrink-0 border-2 shadow-md ${
                                theme === 'dark' ? 'border-yellow-600' : theme === 'classic' ? 'border-black' : 'border-yellow-400'
                              }`}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                theme === 'dark' ? 'text-yellow-400' : theme === 'classic' ? 'text-black' : 'text-yellow-600'
                              }`} />
                              <span className={`text-xs sm:text-sm font-semibold ${
                                theme === 'dark' ? 'text-yellow-300' : theme === 'classic' ? 'text-black' : 'text-yellow-700'
                              }`}>
                                GOAL ARTICLE
                              </span>
                            </div>
                            <h3 className={`font-bold text-lg sm:text-xl mb-2 break-words leading-tight ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              {goalTitle}
                            </h3>
                            {goalSummary?.description && (
                              <p className={`text-sm mb-2 leading-relaxed ${
                                theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                              }`}>
                                {goalSummary.description}
                              </p>
                            )}
                            {goalSummary?.extract && (
                              <p className={`text-xs line-clamp-2 leading-relaxed ${
                                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {goalSummary.extract}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 flex-wrap">
                      <Button
                        onClick={onStartGame}
                        disabled={startingGame}
                        className={`flex-1 sm:flex-none ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white'
                            : theme === 'classic'
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-2 border-black'
                            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-blue-500/50'
                        }`}
                      >
                        {startingGame ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Start Challenge
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onShowLeaderboard();
                          onLeaderboardRefresh();
                        }}
                        className="flex-1 sm:flex-none"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        View Leaderboard
                      </Button>
                    </div>
                  </div>
                  
                  {/* Yesterday's Top Players */}
                  <YesterdaysTopPlayers />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Random Game - Enhanced Section */}
      {!dailyChallenge && (
        <>
          {/* Prominent Daily Challenge CTA */}
          <Card className={`shadow-lg border-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500'
              : theme === 'classic'
              ? 'border-blue-600 bg-blue-50'
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400'
          }`}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`text-lg sm:text-xl font-bold mb-1 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-blue-900' : 'text-blue-900'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                    }`} />
                    🧩 Daily Challenge Awaits!
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-blue-800' : 'text-blue-700'
                  }`}>
                    Compete globally with today's fixed challenge. Same start and goal for everyone!
                  </p>
                </div>
                <Button
                  onClick={() => {
                    onSetDailyChallenge(true);
                    onResetGame();
                  }}
                  className={`flex-shrink-0 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white'
                      : theme === 'classic'
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-2 border-black'
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-blue-500/50'
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Go to Daily Challenge
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-xl border-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500'
              : theme === 'classic'
              ? 'border-purple-600 bg-purple-50'
              : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-400'
          }`}>
            <CardHeader className={`p-4 sm:p-5 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-800/40 to-blue-800/40'
                : theme === 'classic'
                ? 'bg-purple-100'
                : 'bg-gradient-to-r from-purple-100 to-blue-100'
            }`}>
              <CardTitle className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-purple-900' : 'text-purple-900'
              }`}>
                <Shuffle className={`h-6 w-6 sm:h-7 sm:w-7 ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                }`} />
                🔀 Play Random WikiGo
              </CardTitle>
              <p className={`text-sm mt-2 ${
                theme === 'dark' ? 'text-purple-200' : theme === 'classic' ? 'text-purple-800' : 'text-purple-700'
              }`}>
                Connect two surprise topics — no two paths are the same.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-slate-700 font-semibold' : 'text-slate-600'
                  }`}>
                    Start article
                  </label>
                  <div className="space-y-2">
                    <select
                      value={startCategory}
                      onChange={(e) => onStartCategoryChange(e.target.value)}
                      className={`flex h-10 sm:h-11 w-full rounded-md border px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 classic:ring-offset-white classic:focus-visible:ring-black classic:border-black classic:bg-white classic:text-black classic:border-2 ${
                        theme === 'dark'
                          ? "border-gray-800 bg-gray-900"
                          : theme === 'classic'
                          ? "border-slate-400 bg-white"
                          : "border-slate-200 bg-white"
                      }`}
                      disabled={gameActive || dailyChallenge}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1.5 sm:gap-2">
                      <Input 
                        placeholder="e.g., Alan Turing" 
                        value={startTitle} 
                        onChange={(e) => onStartTitleChange(e.target.value)}
                        disabled={gameActive || dailyChallenge}
                        className="h-10 sm:h-11 text-sm flex-1 min-w-0"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleRandomStart}
                        disabled={gameActive || loadingStartRandom || dailyChallenge}
                        className="h-10 sm:h-11 min-w-[44px] sm:min-w-[48px] px-2 sm:px-3 flex-shrink-0"
                      >
                        {loadingStartRandom ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Shuffle className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {startSummary && !gameActive && (
                    <div className={`mt-3 p-3 rounded-lg border space-y-2 ${
                      theme === 'dark'
                        ? 'border-slate-700 bg-slate-800'
                        : theme === 'classic'
                        ? 'border-slate-400 bg-slate-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex gap-3">
                        {startSummary.thumbnail && (
                          <img src={startSummary.thumbnail} alt={startSummary.title} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm ${
                            theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                          }`}>
                            {startSummary.title}
                          </div>
                          {startSummary.description && (
                            <div className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
                            }`}>
                              {startSummary.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {startSummary.extract && (
                        <p className={`text-xs line-clamp-3 ${
                          theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-black' : 'text-slate-700'
                        }`}>
                          {startSummary.extract}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-slate-700 font-semibold' : 'text-slate-600'
                  }`}>
                    Goal article
                  </label>
                  <div className="space-y-2">
                    <select
                      value={goalCategory}
                      onChange={(e) => onGoalCategoryChange(e.target.value)}
                      className={`flex h-10 sm:h-11 w-full rounded-md border px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 classic:ring-offset-white classic:focus-visible:ring-black classic:border-black classic:bg-white classic:text-black classic:border-2 ${
                        theme === 'dark'
                          ? "border-gray-800 bg-gray-900"
                          : theme === 'classic'
                          ? "border-slate-400 bg-white"
                          : "border-slate-200 bg-white"
                      }`}
                      disabled={gameActive || dailyChallenge}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1.5 sm:gap-2">
                      <Input 
                        placeholder="e.g., Black Hole" 
                        value={goalTitle} 
                        onChange={(e) => onGoalTitleChange(e.target.value)}
                        disabled={gameActive || dailyChallenge}
                        className="h-10 sm:h-11 text-sm flex-1 min-w-0"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleRandomGoal}
                        disabled={gameActive || loadingGoalRandom || dailyChallenge}
                        className="h-10 sm:h-11 min-w-[44px] sm:min-w-[48px] px-2 sm:px-3 flex-shrink-0"
                      >
                        {loadingGoalRandom ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Flag className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {goalSummary && !gameActive && (
                    <div className={`mt-3 p-3 rounded-lg border space-y-2 ${
                      theme === 'dark'
                        ? 'border-slate-700 bg-slate-800'
                        : theme === 'classic'
                        ? 'border-slate-400 bg-slate-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex gap-3">
                        {goalSummary.thumbnail && (
                          <img src={goalSummary.thumbnail} alt={goalSummary.title} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm ${
                            theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                          }`}>
                            {goalSummary.title}
                          </div>
                          {goalSummary.description && (
                            <div className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'
                            }`}>
                              {goalSummary.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {goalSummary.extract && (
                        <p className={`text-xs line-clamp-3 ${
                          theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-black' : 'text-slate-700'
                        }`}>
                          {goalSummary.extract}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Start Game Button */}
              {!gameActive && (
                <div className="mt-4 sm:mt-6">
                  <Button 
                    onClick={onStartGame}
                    disabled={startingGame}
                    className={`w-full sm:w-auto sm:max-w-md mx-auto sm:mx-0 h-14 sm:h-12 px-6 text-base sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white'
                        : theme === 'classic'
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-2 border-black'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-blue-500/50'
                    }`}
                  >
                    {startingGame ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
                        Start Random Game
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
});

