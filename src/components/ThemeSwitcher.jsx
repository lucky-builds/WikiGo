import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, BookOpen } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'classic', label: 'Classic', icon: BookOpen },
  ];

  return (
    <div className="flex items-center gap-2 p-1 rounded-lg border border-slate-200 bg-white dark:bg-gray-900 dark:border-gray-800 classic:bg-white classic:border-slate-400">
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value)}
          className={`flex items-center gap-1.5 ${
            theme === value
              ? 'bg-slate-900 text-white dark:bg-gray-800 dark:text-gray-100 classic:bg-blue-600 classic:text-white'
              : 'text-slate-600 dark:text-gray-300 classic:text-slate-700 hover:bg-slate-100 dark:hover:bg-gray-800 classic:hover:bg-blue-50'
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}

