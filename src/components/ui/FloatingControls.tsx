import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { FiSun, FiMoon, FiHome, FiSettings, FiX, FiCommand } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingControlsProps {
  showHome?: boolean;
  onOpenCommandPalette?: () => void;
}

export function FloatingControls({ showHome = true, onOpenCommandPalette }: FloatingControlsProps) {
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex flex-col gap-2 mb-2"
          >
            {/* Command Palette Button */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                title="Command Palette (Ctrl+K)"
              >
                <FiCommand className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Home Button */}
            {showHome && !isHome && (
              <Link
                to="/"
                className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                title="Go Home"
              >
                <FiHome className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`p-4 rounded-full shadow-lg backdrop-blur-sm border transition-all hover:scale-105 ${expanded
            ? 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            : 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400/50 dark:border-indigo-500/50'
          }`}
        title={expanded ? 'Close menu' : 'Open controls'}
      >
        {expanded ? (
          <FiX className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        ) : (
          <FiSettings className={`w-5 h-5 ${expanded ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`} />
        )}
      </button>
    </div>
  );
}
