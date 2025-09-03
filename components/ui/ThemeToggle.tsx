'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-5 w-5" />;
      case 'dark':
        return <MoonIcon className="h-5 w-5" />;
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system mode';
      default:
        return 'Switch to light mode';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-700 dark:text-gray-200
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
        dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900
        group
      "
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {getIcon()}
      </span>
      
      {/* Tooltip */}
      <span className="
        absolute -bottom-12 left-1/2 transform -translate-x-1/2
        px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        pointer-events-none z-50
        dark:bg-gray-700 dark:text-gray-200
      ">
        {getTooltip()}
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 
          w-0 h-0 border-l-4 border-r-4 border-b-4 
          border-transparent border-b-gray-900 dark:border-b-gray-700
        "></span>
      </span>
    </button>
  );
}
