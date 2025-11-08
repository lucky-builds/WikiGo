import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, PlayCircle, BookOpen, Trophy, CheckCircle2, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Onboarding Component
 * Multi-step onboarding flow for new users
 * Memoized for performance optimization - prevents unnecessary re-renders
 */
export const Onboarding = React.memo(function Onboarding({
  showOnboarding,
  onboardingStep,
  setOnboardingStep,
  onClose,
}) {
  const { theme } = useTheme();

  if (!showOnboarding) return null;

  const handleClose = () => {
    localStorage.setItem('wikiGo-onboarding-seen', 'true');
    onClose();
  };

  const handlePrevious = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    } else {
      handleClose();
    }
  };

  const handleNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <CardHeader className="relative p-4 sm:p-6 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
              Welcome to WikiGo!
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step === onboardingStep
                    ? theme === 'dark'
                      ? 'bg-blue-500'
                      : theme === 'classic'
                      ? 'bg-black'
                      : 'bg-blue-600'
                    : step < onboardingStep
                    ? theme === 'dark'
                      ? 'bg-blue-700'
                      : theme === 'classic'
                      ? 'bg-black'
                      : 'bg-blue-300'
                    : theme === 'dark'
                    ? 'bg-gray-700'
                    : theme === 'classic'
                    ? 'bg-gray-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Step 0: Gameplay */}
          {onboardingStep === 0 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-blue-900/30' : theme === 'classic' ? 'bg-white border-black' : 'bg-blue-100'
                }`}>
                  <PlayCircle className={`h-6 w-6 sm:h-8 sm:w-8 ${
                    theme === 'dark' ? 'text-blue-400' : theme === 'classic' ? 'text-black' : 'text-blue-600'
                  }`} />
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                }`}>
                  How to Play
                </h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <p className={`text-sm sm:text-base leading-relaxed ${
                  theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-black' : 'text-slate-700'
                }`}>
                  Navigate from a <strong>start article</strong> to a <strong>goal article</strong> using only the links found within Wikipedia articles. Your goal is to reach your destination in the <strong>fewest moves</strong> and <strong>fastest time</strong> possible.
                </p>
                
                <div className="space-y-2 sm:space-y-3">
                  <h4 className={`font-semibold text-base sm:text-lg mt-4 ${
                    theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                  }`}>
                    Quick Steps:
                  </h4>
                  <ol className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                    {[
                      "Set your start and goal articles using the Setup section",
                      "Click Start to begin your journey",
                      "Click on any blue link in the article to navigate",
                      "Use the Available Links panel to find links quickly",
                      "Reach the goal article to win!"
                    ].map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm border-2 ${
                          theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : theme === 'classic'
                            ? 'bg-black text-white border-black'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className={`flex-1 pt-0.5 ${
                          theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-black' : 'text-slate-700'
                        }`}>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Example Journey */}
          {onboardingStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-purple-900/30' : theme === 'classic' ? 'bg-white border-black' : 'bg-purple-100'
                }`}>
                  <BookOpen className={`h-6 w-6 sm:h-8 sm:w-8 ${
                    theme === 'dark' ? 'text-purple-400' : theme === 'classic' ? 'text-black' : 'text-purple-600'
                  }`} />
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                }`}>
                  Example Journey
                </h3>
              </div>
              
              <p className={`text-sm sm:text-base leading-relaxed ${
                theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-black' : 'text-slate-700'
              }`}>
                Here's an example of how you might navigate from one article to another:
              </p>
              
              <div className={`p-4 sm:p-5 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700/50'
                  : theme === 'classic'
                  ? 'bg-white border-black'
                  : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
              }`}>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { num: 1, title: "Start: Alan Turing", desc: "Mathematician and computer scientist" },
                    { num: 2, title: "Click link: Computer Science", desc: "Found in Alan Turing article" },
                    { num: 3, title: "Click link: Artificial Intelligence", desc: "Found in Computer Science article" },
                    { num: 4, title: "Goal: Machine Learning", desc: "Found in Artificial Intelligence article ✓", isGoal: true }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                        item.isGoal
                          ? theme === 'dark'
                            ? 'bg-green-900/30 border-2 border-green-600'
                            : theme === 'classic'
                            ? 'bg-white border-black border-4'
                            : 'bg-green-50 border-2 border-green-300'
                          : theme === 'dark'
                          ? 'bg-slate-800/50 border border-slate-700'
                          : theme === 'classic'
                          ? 'bg-white border-black'
                          : 'bg-white border border-slate-200'
                      }`}>
                        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base border-2 ${
                          item.isGoal
                            ? theme === 'dark'
                              ? 'bg-green-600 text-white'
                              : theme === 'classic'
                              ? 'bg-black text-white border-black'
                              : 'bg-green-100 text-green-700'
                            : theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : theme === 'classic'
                            ? 'bg-black text-white border-black'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.isGoal ? <CheckCircle2 className={`h-5 w-5 sm:h-6 sm:w-6 ${theme === 'classic' ? 'text-white' : ''}`} /> : item.num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm sm:text-base ${
                            item.isGoal
                              ? theme === 'dark' ? 'text-green-200' : theme === 'classic' ? 'text-black' : 'text-green-900'
                              : theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                          }`}>
                            {item.title}
                          </div>
                          <div className={`text-xs sm:text-sm mt-0.5 ${
                            item.isGoal
                              ? theme === 'dark' ? 'text-green-300' : theme === 'classic' ? 'text-black' : 'text-green-700'
                              : theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-500'
                          }`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      {idx < 3 && (
                        <div className="flex justify-center my-2">
                          <ArrowRight className={`h-5 w-5 sm:h-6 sm:w-6 ${
                            theme === 'dark' ? 'text-gray-500' : theme === 'classic' ? 'text-black' : 'text-slate-400'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className={`text-xs sm:text-sm italic mt-4 pt-4 border-t ${
                  theme === 'dark' ? 'border-slate-700 text-gray-400' : theme === 'classic' ? 'border-black text-black' : 'border-slate-200 text-slate-600'
                }`}>
                  <strong>Tip:</strong> In this example, we used 3 moves. Try to find even shorter paths!
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Scoring */}
          {onboardingStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-yellow-900/30' : theme === 'classic' ? 'bg-white border-black' : 'bg-yellow-100'
                }`}>
                  <Trophy className={`h-6 w-6 sm:h-8 sm:w-8 ${
                    theme === 'dark' ? 'text-yellow-400' : theme === 'classic' ? 'text-black' : 'text-yellow-600'
                  }`} />
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'
                }`}>
                  Scoring System
                </h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <p className={`text-sm sm:text-base leading-relaxed ${
                  theme === 'dark' ? 'text-gray-200' : theme === 'classic' ? 'text-black' : 'text-slate-700'
                }`}>
                  Your score rewards efficiency—fewer moves and faster time mean higher scores!
                </p>
                
                <div className={`p-4 sm:p-5 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : theme === 'classic'
                    ? 'bg-white border-black'
                    : 'bg-blue-50/50 border-blue-200'
                }`}>
                  <div className={`font-mono text-base sm:text-lg font-semibold mb-3 text-center ${
                    theme === 'dark' ? 'text-blue-300' : theme === 'classic' ? 'text-black' : 'text-blue-700'
                  }`}>
                    Score = 1000 − (10 × moves) − (1 × seconds)
                  </div>
                  <div className="space-y-2 text-sm sm:text-base">
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
                
                <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-yellow-900/20 border border-yellow-800/50'
                    : theme === 'classic'
                    ? 'bg-white border-black'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-yellow-200' : theme === 'classic' ? 'text-black' : 'text-yellow-900'
                  }`}>
                    <strong>💡 Pro Tip:</strong> Plan your path before clicking! Use link structure intuition—jump to broad categories, then narrow in. Beat your personal best by optimizing both moves and time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <div className="border-t p-4 sm:p-6 flex items-center justify-between gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center gap-2"
          >
            {onboardingStep > 0 ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </>
            ) : (
              'Skip'
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full ${
                  step === onboardingStep
                    ? theme === 'dark' ? 'bg-blue-500' : theme === 'classic' ? 'bg-black' : 'bg-blue-600'
                    : theme === 'dark' ? 'bg-gray-600' : theme === 'classic' ? 'bg-gray-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {onboardingStep < 2 ? (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
});

