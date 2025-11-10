import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, X, PlayCircle, Trophy, Calendar, Settings } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * SettingsPanel Component
 * A panel/drawer that contains all settings and navigation options
 * Shows as a hamburger menu on mobile, settings button on desktop
 */
export function SettingsPanel({
  showSettings,
  onOpen,
  onClose,
  onShowOnboarding,
  onShowScoring,
  onStartDailyChallenge,
  dailyChallenge,
}) {
  const { theme } = useTheme();

  return (
    <>
      {/* Settings Button - Desktop shows text with icon, Mobile shows hamburger icon */}
      <Button
        variant="ghost"
        onClick={onOpen}
        className="h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm min-w-[44px] sm:min-w-0"
        title="Settings"
      >
        <Menu className="h-4 w-4 sm:h-5 sm:w-5 sm:hidden" />
        <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 hidden sm:inline" />
        <span className="hidden sm:inline">Settings</span>
      </Button>

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <Card 
            className={`w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="relative p-4 sm:p-6 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  Settings
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
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {/* Learn How To Play */}
              <Button
                variant="ghost"
                onClick={() => {
                  onShowOnboarding();
                  onClose();
                }}
                className="w-full justify-start h-auto py-3 px-4"
                title="Show instructions"
              >
                <PlayCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-left">Learn How To Play</span>
              </Button>

              {/* Scoring Methodology */}
              <Button
                variant="ghost"
                onClick={() => {
                  onShowScoring();
                  onClose();
                }}
                className="w-full justify-start h-auto py-3 px-4"
                title="View scoring methodology"
              >
                <Trophy className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-left">Scoring Methodology</span>
              </Button>

              {/* Theme Switcher */}
              <div className="py-3 px-4 border-t border-b">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
                  }`}>
                    Theme
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <ThemeSwitcher />
                </div>
              </div>

              {/* Daily Challenge - Only show when not in daily challenge mode */}
              {!dailyChallenge && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onStartDailyChallenge();
                    onClose();
                  }}
                  className="w-full justify-start h-auto py-3 px-4"
                >
                  <Calendar className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-left">Daily Challenge</span>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

