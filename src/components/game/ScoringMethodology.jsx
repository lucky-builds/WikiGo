import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * ScoringMethodology Component
 * Modal displaying scoring information
 */
export const ScoringMethodology = React.memo(function ScoringMethodology({
  showScoringModal,
  onClose,
}) {
  const { theme } = useTheme();

  if (!showScoringModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <CardHeader className="relative p-4 sm:p-6 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
              Scoring Methodology
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h4 className={`font-semibold text-base sm:text-lg mb-1.5 sm:mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                How Scoring Works
              </h4>
              <p className={`text-sm sm:text-base leading-relaxed ${
                theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
              }`}>
                Your score is calculated using a simple formula that rewards efficiency:
              </p>
            </div>
            
            <div className={`p-3 sm:p-4 rounded-lg border-2 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-blue-50/50 border-blue-200'
            }`}>
              <div className={`font-mono text-sm sm:text-base font-semibold mb-2 ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
              }`}>
                Score = 1000 − (10 × moves) − (1 × seconds)
              </div>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span><strong>Base Score:</strong> Start with 1000 points</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span><strong>Move Penalty:</strong> Lose 10 points per move</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span><strong>Time Penalty:</strong> Lose 1 point per second</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className={`font-semibold text-base sm:text-lg mb-1.5 sm:mb-2 mt-3 sm:mt-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Tips for Higher Scores
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Use link structure intuition—jump to broad categories, then narrow in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Fewer moves = higher score. Plan your path before clicking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Faster completion = higher score. Time matters!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Beat your personal best by optimizing both moves and time</span>
                </li>
              </ul>
            </div>
            
            <div className={`mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg border-2 ${
              theme === 'dark'
                ? 'bg-yellow-900/20 border border-yellow-800/50'
                : 'bg-yellow-50/50 border border-yellow-200'
            }`}>
              <p className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'
              }`}>
                <strong>Note:</strong> Minimum score is 0. Scores cannot go negative.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

