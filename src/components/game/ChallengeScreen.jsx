import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { prettyTime } from "@/lib/timeUtils";

/**
 * ChallengeScreen Component
 * Displays the challenge acceptance modal when a user receives a challenge
 * Memoized for performance optimization - prevents unnecessary re-renders
 */
export const ChallengeScreen = React.memo(function ChallengeScreen({
  showChallengeScreen,
  challengeData,
  onDecline,
  onAccept,
}) {
  const { theme } = useTheme();

  if (!showChallengeScreen || !challengeData) return null;

  const handleDecline = (e) => {
    e.stopPropagation();
    onDecline();
  };

  const handleAccept = async (e) => {
    e.stopPropagation();
    await onAccept();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <CardHeader className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-4 sm:p-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8" />
            <CardTitle className="text-2xl sm:text-3xl">Challenge Accepted!</CardTitle>
          </div>
          <p className="text-center mt-1 sm:mt-2 text-white/90 text-sm sm:text-base">
            {challengeData.username} has challenged you to a duel!
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 min-w-[44px] min-h-[44px] z-10"
            onClick={handleDecline}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Challenge Info */}
          <div className={`p-4 sm:p-6 rounded-lg border-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-600'
              : theme === 'classic'
              ? 'bg-white border-black'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'
          }`}>
            <h3 className={`font-semibold text-lg sm:text-xl mb-3 sm:mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Beat This Score!
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className={`text-center p-2 sm:p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : theme === 'classic' ? 'bg-slate-100 border border-slate-300' : 'bg-slate-50'
              }`}>
                <div className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {challengeData.moves}
                </div>
                <div className={`text-xs sm:text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Moves
                </div>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : theme === 'classic' ? 'bg-slate-100 border border-slate-300' : 'bg-slate-50'
              }`}>
                <div className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {prettyTime(challengeData.time * 1000)}
                </div>
                <div className={`text-xs sm:text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Time
                </div>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-600'
                  : theme === 'classic'
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-500'
                  : 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300'
              }`}>
                <div className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-yellow-200' : 'text-slate-900'
                }`}>
                  {challengeData.score}
                </div>
                <div className={`text-xs sm:text-sm mt-1 ${
                  theme === 'dark' ? 'text-yellow-300' : 'text-slate-600'
                }`}>
                  Score
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Articles */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className={`font-semibold text-base sm:text-lg ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Your Challenge:
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-blue-900/30 border-blue-600'
                  : theme === 'classic'
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-blue-50 border-blue-300'
              }`}>
                <div className={`text-xs sm:text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  Start Article
                </div>
                <div className={`text-sm sm:text-base font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {challengeData.start}
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowRight className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                }`} />
              </div>
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-green-900/30 border-green-600'
                  : theme === 'classic'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className={`text-xs sm:text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-green-300' : 'text-green-700'
                }`}>
                  End Article
                </div>
                <div className={`text-sm sm:text-base font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {challengeData.end}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className={`p-3 sm:p-4 rounded-lg border ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : theme === 'classic'
              ? 'bg-slate-50 border-slate-400'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
            }`}>
              Navigate from <strong>{challengeData.start}</strong> to <strong>{challengeData.end}</strong> in fewer moves or less time to beat {challengeData.username}'s score of <strong>{challengeData.score}</strong>!
            </p>
          </div>
        </CardContent>
        <div className="border-t p-4 sm:p-6 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="min-h-[44px]"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white min-h-[44px]"
          >
            Accept Challenge
          </Button>
        </div>
      </Card>
    </div>
  );
});

