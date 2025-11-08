import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Flag, History, Users, Share2, PlayCircle, CheckCircle2, ChevronUp, ChevronDown, X, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { prettyTime } from "@/lib/timeUtils";

/**
 * GameResults Component
 * Displays the victory screen with stats, score breakdown, and leaderboard submission
 * Memoized for performance optimization - prevents unnecessary re-renders
 */
export const GameResults = React.memo(function GameResults({
  won,
  finalScore,
  moveCount,
  finalTime,
  timer,
  history,
  startTitle,
  goalTitle,
  username,
  isChallengeMode,
  challengeData,
  dailyChallenge,
  showScoreBreakdown,
  setShowScoreBreakdown,
  submittingScore,
  scoreSubmitted,
  setShowLeaderboard,
  setLeaderboardRefreshKey,
  setShowUsernameModal,
  submitToLeaderboard,
  resetGame,
}) {
  const { theme } = useTheme();

  if (!won) return null;

  const handleShareChallenge = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const timeInSeconds = Math.floor(finalTime.current / 1000);
    const challengeUrl = `${baseUrl}?start=${encodeURIComponent(startTitle)}&end=${encodeURIComponent(goalTitle)}&moves=${moveCount}&time=${timeInSeconds}&score=${finalScore}&username=${encodeURIComponent(username)}`;
    
    const shareText = `${username} challenged you to beat their WikiGo score!\n\nCan you navigate from ${startTitle} → ${goalTitle} faster?\n\nScore: ${finalScore} | ${moveCount} moves | ${prettyTime(finalTime.current)}\n\nAccept the challenge →\n\n${challengeUrl}`;
    
    if (navigator.share) {
      navigator.share({ 
        title: "WikiGo Challenge",
        text: shareText
      }).catch(() => {
        // Fallback to clipboard if share is cancelled
        navigator.clipboard.writeText(shareText);
        alert("Challenge message copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Challenge message copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-2 md:p-4 safe-area-inset">
      <div className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl flex flex-col sm:rounded-lg shadow-2xl overflow-hidden">
        <Card className="flex flex-col h-full sm:h-auto overflow-hidden">
          <CardHeader className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white p-3 sm:p-4 md:p-6 flex-shrink-0">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8" />
              <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                {isChallengeMode ? "Challenge Complete!" : "Congratulations!"}
              </CardTitle>
            </div>
            <p className="text-center mt-1 text-yellow-50 text-[11px] sm:text-xs md:text-sm lg:text-base">
              {isChallengeMode 
                ? "You've completed the challenge!" 
                : "You've reached your destination!"}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-4 md:right-4 text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 min-w-[44px] min-h-[44px]"
              onClick={resetGame}
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2.5 sm:p-3 md:p-4 lg:p-6 space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-6 pb-safe">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-4">
              <div className={`text-center p-1 sm:p-1.5 md:p-2 lg:p-3 xl:p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : theme === 'classic' ? 'bg-slate-100 border border-slate-300' : 'bg-slate-50'
              }`}>
                <div className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {moveCount}
                </div>
                <div className={`text-[9px] sm:text-[10px] md:text-xs lg:text-sm mt-0.5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Moves
                </div>
              </div>
              <div className={`text-center p-1 sm:p-1.5 md:p-2 lg:p-3 xl:p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : theme === 'classic' ? 'bg-slate-100 border border-slate-300' : 'bg-slate-50'
              }`}>
                <div className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {prettyTime(finalTime.current)}
                </div>
                <div className={`text-[9px] sm:text-[10px] md:text-xs lg:text-sm mt-0.5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Time
                </div>
              </div>
              <div className={`text-center p-1 sm:p-1.5 md:p-2 lg:p-3 xl:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-600'
                  : theme === 'classic'
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-500'
                  : 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300'
              }`}>
                <div className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ${
                  theme === 'dark' ? 'text-yellow-200' : 'text-slate-900'
                }`}>
                  {finalScore}
                </div>
                <div className={`text-[9px] sm:text-[10px] md:text-xs lg:text-sm mt-0.5 ${
                  theme === 'dark' ? 'text-yellow-300' : 'text-slate-600'
                }`}>
                  Score
                </div>
              </div>
            </div>

            {/* Primary CTA: Challenge Button */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-3">
              <Button
                onClick={handleShareChallenge}
                className={`w-full h-10 sm:h-11 md:h-12 lg:h-14 xl:h-16 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold shadow-lg transition-all hover:scale-105 min-h-[44px] ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white'
                    : theme === 'classic'
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-2 border-black'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white'
                }`}
              >
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-1.5 md:mr-2" />
                Challenge a Friend!
              </Button>
              <p className={`text-center text-[9px] sm:text-[10px] md:text-xs lg:text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Share your victory and challenge someone to beat your score!
              </p>
            </div>

            {/* Challenge Comparison */}
            {isChallengeMode && challengeData && (
              <div className={`p-4 sm:p-6 rounded-lg border-2 ${
                finalScore > challengeData.score
                  ? theme === 'dark'
                    ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-600'
                    : theme === 'classic'
                    ? 'bg-green-50 border-green-600 border-4'
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                  : finalScore === challengeData.score
                  ? theme === 'dark'
                    ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-600'
                    : theme === 'classic'
                    ? 'bg-yellow-50 border-yellow-600 border-4'
                    : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
                  : theme === 'dark'
                  ? 'bg-gradient-to-br from-red-900/30 to-pink-900/30 border-red-600'
                  : theme === 'classic'
                  ? 'bg-red-50 border-red-600 border-4'
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-400'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {finalScore > challengeData.score ? (
                    <Trophy className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                  ) : finalScore === challengeData.score ? (
                    <Target className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                  ) : (
                    <Flag className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`} />
                  )}
                  <h3 className={`font-semibold text-base sm:text-lg ${
                    finalScore > challengeData.score
                      ? theme === 'dark' ? 'text-green-200' : 'text-green-900'
                      : finalScore === challengeData.score
                      ? theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'
                      : theme === 'dark' ? 'text-red-200' : 'text-red-900'
                  }`}>
                    {finalScore > challengeData.score
                      ? `🎉 You Won! You beat ${challengeData.username}!`
                      : finalScore === challengeData.score
                      ? `🤝 It's a Tie! You matched ${challengeData.username}'s score!`
                      : `😔 You Lost! ${challengeData.username} beat you!`}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800/50' : theme === 'classic' ? 'bg-white border border-slate-300' : 'bg-white/50'
                  }`}>
                    <div className={`text-xs sm:text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {challengeData.username}'s Score
                    </div>
                    <div className={`text-2xl sm:text-3xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {challengeData.score}
                    </div>
                    <div className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {challengeData.moves} moves • {prettyTime(challengeData.time * 1000)}
                    </div>
                  </div>
                  <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                    finalScore > challengeData.score
                      ? theme === 'dark'
                        ? 'bg-green-800/50 border-green-500'
                        : theme === 'classic'
                        ? 'bg-green-100 border-green-600'
                        : 'bg-green-100 border-green-400'
                      : theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-600'
                      : theme === 'classic'
                      ? 'bg-white border-slate-400'
                      : 'bg-white/50 border-slate-300'
                  }`}>
                    <div className={`text-xs sm:text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Your Score
                    </div>
                    <div className={`text-2xl sm:text-3xl font-bold ${
                      finalScore > challengeData.score
                        ? theme === 'dark' ? 'text-green-300' : 'text-green-700'
                        : theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {finalScore}
                    </div>
                    <div className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {moveCount} moves • {prettyTime(finalTime.current)}
                    </div>
                  </div>
                </div>
                {finalScore < challengeData.score && (
                  <div className={`mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <p className={`text-xs sm:text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      💪 Don't give up! Try again to beat {challengeData.username}'s score of {challengeData.score}!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Journey Path */}
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <History className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`} />
                <h3 className={`font-semibold text-base sm:text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Your Journey
                </h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                {history.map((article, index) => (
                  <div key={index} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : theme === 'classic'
                      ? 'bg-slate-100 hover:bg-blue-100 border border-slate-300'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-slate-200'
                        : theme === 'classic'
                        ? 'bg-slate-300 text-slate-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-xs sm:text-sm break-words ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {article}
                      </div>
                      {index === 0 && (
                        <div className={`text-xs mt-0.5 sm:mt-1 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-slate-500'
                        }`}>
                          Start
                        </div>
                      )}
                      {index === history.length - 1 && (
                        <div className={`text-xs mt-0.5 sm:mt-1 font-semibold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          Goal reached! 🎉
                        </div>
                      )}
                    </div>
                    {index < history.length - 1 && (
                      <div className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Score Breakdown - Collapsible */}
            <div className={`rounded-lg border ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : theme === 'classic'
                ? 'bg-slate-50 border-slate-400'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                className={`w-full flex items-center justify-between p-3 sm:p-4 text-left hover:opacity-80 transition-opacity ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                <h3 className={`font-semibold text-sm sm:text-base flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  <History className="h-4 w-4" />
                  Score Breakdown
                </h3>
                {showScoreBreakdown ? (
                  <ChevronUp className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                  }`} />
                ) : (
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                  }`} />
                )}
              </button>
              {showScoreBreakdown && (
                <div className={`px-3 sm:px-4 pb-3 sm:pb-4 pt-0 space-y-1.5 sm:space-y-2 text-xs sm:text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
                }`}>
                  {(() => {
                    const timeToUse = finalTime.current > 0 ? finalTime.current : timer;
                    const seconds = Math.floor(timeToUse / 1000);
                    const movesPenalty = 10 * moveCount;
                    const timePenalty = seconds;
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Base score:</span>
                          <span className="font-semibold">1000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Moves penalty (10 × {moveCount}):</span>
                          <span className={`font-semibold ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                          }`}>-{movesPenalty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time penalty (1 × {seconds}s):</span>
                          <span className={`font-semibold ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                          }`}>-{timePenalty}</span>
                        </div>
                        <div className={`border-t pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 flex justify-between ${
                          theme === 'dark' ? 'border-gray-700' : 'border-slate-300'
                        }`}>
                          <span className="font-semibold">Final Score:</span>
                          <span className={`font-bold text-base sm:text-lg ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {finalScore}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Daily Challenge Leaderboard Section */}
            {dailyChallenge && (
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-600'
                  : theme === 'classic'
                  ? 'bg-white border-black'
                  : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    theme === 'dark' ? 'text-blue-300' : theme === 'classic' ? 'text-black' : 'text-blue-600'
                  }`} />
                  <h3 className={`font-semibold text-base sm:text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Daily Challenge Leaderboard
                  </h3>
                </div>
                
                {submittingScore ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className={`h-6 w-6 animate-spin ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`ml-2 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Submitting your score...
                    </span>
                  </div>
                ) : scoreSubmitted ? (
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 p-2 rounded ${
                      theme === 'dark' ? 'bg-green-900/30' : theme === 'classic' ? 'bg-green-50' : 'bg-green-50'
                    }`}>
                      <CheckCircle2 className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-green-200' : 'text-green-900'
                      }`}>
                        Score submitted successfully! Your username: <strong>{username}</strong>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowLeaderboard(true);
                        setLeaderboardRefreshKey(prev => prev + 1);
                      }}
                      className="w-full mt-2"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Leaderboard
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Your score will be saved to the leaderboard. Username: <strong>{username}</strong>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowUsernameModal(true)}
                        className="flex-1"
                      >
                        Change Username
                      </Button>
                      <Button
                        onClick={() => {
                          if (won && dailyChallenge && finalTime.current > 0 && !scoreSubmitted) {
                            submitToLeaderboard();
                          }
                        }}
                        className="flex-1"
                        disabled={submittingScore}
                      >
                        {submittingScore ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Score'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Secondary CTA: Play Again Button */}
            <div className="pt-2">
              <Button 
                variant="outline" 
                className={`w-full h-10 sm:h-11 text-sm sm:text-base ${
                  theme === 'dark'
                    ? 'border-gray-600 hover:bg-gray-800'
                    : theme === 'classic'
                    ? 'border-black hover:bg-slate-100'
                    : 'border-slate-300 hover:bg-slate-100'
                }`}
                onClick={resetGame}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

