
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { toast } from 'sonner';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  const handleToggle = () => {
    toggleTheme();
    // Only show toast in development
    if (process.env.NODE_ENV === 'development') {
      toast.info(`Theme switched to ${theme === 'light' ? 'dark' : 'light'} mode`, {
        duration: 1500,
      });
    }
  };
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Switch 
            checked={theme === 'dark'}
            onCheckedChange={handleToggle}
            aria-label="Toggle dark mode"
          />
          <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <p className="text-sm">Toggle dark mode</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ThemeToggle;
