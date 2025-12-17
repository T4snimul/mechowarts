import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiHome, FiUsers, FiCalendar, FiBook, FiClock,
  FiMessageCircle, FiMail, FiUser, FiLogOut, FiLogIn,
  FiSun, FiMoon, FiArrowRight
} from 'react-icons/fi';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
  category: 'navigation' | 'action' | 'theme' | 'user';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  // Define all available commands
  const commands = useMemo<CommandItem[]>(() => {
    const baseCommands: CommandItem[] = [
      // Navigation
      {
        id: 'home',
        label: 'Go to Home',
        description: 'Navigate to the landing page',
        icon: <FiHome className="w-4 h-4" />,
        action: () => navigate('/'),
        keywords: ['home', 'landing', 'main', 'start'],
        category: 'navigation',
      },
      {
        id: 'great-hall',
        label: 'Go to Great Hall',
        description: 'View all students directory',
        icon: <FiUsers className="w-4 h-4" />,
        action: () => navigate('/great-hall'),
        keywords: ['students', 'directory', 'people', 'wizards', 'hall'],
        category: 'navigation',
      },
      {
        id: 'calendar',
        label: 'Go to Calendar',
        description: 'View and manage your schedule',
        icon: <FiCalendar className="w-4 h-4" />,
        action: () => navigate('/calendar'),
        keywords: ['calendar', 'schedule', 'events', 'time', 'turner'],
        category: 'navigation',
      },
      {
        id: 'library',
        label: 'Go to Library',
        description: 'Access study materials',
        icon: <FiBook className="w-4 h-4" />,
        action: () => navigate('/library'),
        keywords: ['library', 'materials', 'books', 'study', 'resources'],
        category: 'navigation',
      },
      {
        id: 'pomodoro',
        label: 'Go to Pomodoro Timer',
        description: 'Focus timer for studying',
        icon: <FiClock className="w-4 h-4" />,
        action: () => navigate('/pomodoro'),
        keywords: ['pomodoro', 'timer', 'focus', 'study', 'work'],
        category: 'navigation',
      },
      {
        id: 'pensieve',
        label: 'Go to Pensieve',
        description: 'Forum and discussions',
        icon: <FiMessageCircle className="w-4 h-4" />,
        action: () => navigate('/pensieve'),
        keywords: ['pensieve', 'forum', 'discussions', 'posts', 'community'],
        category: 'navigation',
      },
      {
        id: 'owlery',
        label: 'Go to Owlery',
        description: 'Chat and messages',
        icon: <FiMail className="w-4 h-4" />,
        action: () => navigate('/owlery'),
        keywords: ['owlery', 'chat', 'messages', 'mail', 'communication'],
        category: 'navigation',
      },
      // Theme actions
      {
        id: 'toggle-theme',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        description: 'Toggle between light and dark theme',
        icon: theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />,
        action: toggleTheme,
        keywords: ['theme', 'dark', 'light', 'mode', 'toggle', 'switch'],
        category: 'theme',
      },
    ];

    // Add user-specific commands
    if (isAuthenticated) {
      baseCommands.push(
        {
          id: 'profile',
          label: 'Go to Profile',
          description: 'View and edit your profile',
          icon: <FiUser className="w-4 h-4" />,
          action: () => navigate('/profile'),
          keywords: ['profile', 'account', 'settings', 'user', 'me'],
          category: 'user',
        },
        {
          id: 'logout',
          label: 'Sign Out',
          description: 'Log out of your account',
          icon: <FiLogOut className="w-4 h-4" />,
          action: () => {
            logout();
            navigate('/');
          },
          keywords: ['logout', 'sign out', 'exit', 'leave'],
          category: 'user',
        }
      );
    } else {
      baseCommands.push({
        id: 'login',
        label: 'Sign In',
        description: 'Log in to your account',
        icon: <FiLogIn className="w-4 h-4" />,
        action: () => navigate('/login'),
        keywords: ['login', 'sign in', 'enter', 'authenticate'],
        category: 'user',
      });
    }

    return baseCommands;
  }, [navigate, theme, toggleTheme, isAuthenticated, logout]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query) return commands;

    const lowerQuery = query.toLowerCase();
    return commands.filter(cmd => {
      const matchesLabel = cmd.label.toLowerCase().includes(lowerQuery);
      const matchesDescription = cmd.description?.toLowerCase().includes(lowerQuery);
      const matchesKeywords = cmd.keywords?.some(k => k.toLowerCase().includes(lowerQuery));
      return matchesLabel || matchesDescription || matchesKeywords;
    });
  }, [commands, query]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      action: [],
      theme: [],
      user: [],
    };

    filteredCommands.forEach(cmd => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector('[data-selected="true"]');
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const executeCommand = useCallback((command: CommandItem) => {
    command.action();
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const totalItems = filteredCommands.length;
    if (totalItems === 0) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'j': // Vim-style down
        if (e.key === 'j' && e.target instanceof HTMLInputElement && (e.target as HTMLInputElement).value) break;
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
      case 'k': // Vim-style up
        if (e.key === 'k' && e.target instanceof HTMLInputElement && (e.target as HTMLInputElement).value) break;
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'g': // Vim-style go to top (gg)
        if (e.target instanceof HTMLInputElement && (e.target as HTMLInputElement).value) break;
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'G': // Vim-style go to bottom
        if (e.target instanceof HTMLInputElement && (e.target as HTMLInputElement).value) break;
        e.preventDefault();
        setSelectedIndex(totalItems - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [filteredCommands, selectedIndex, executeCommand, onClose]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // This is handled by the parent component
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation': return 'Navigation';
      case 'action': return 'Actions';
      case 'theme': return 'Appearance';
      case 'user': return 'Account';
      default: return category;
    }
  };

  let globalIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <FiSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div
                ref={listRef}
                className="max-h-[60vh] overflow-y-auto py-2"
              >
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No commands found for "{query}"
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, items]) => {
                    if (items.length === 0) return null;

                    return (
                      <div key={category}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {getCategoryLabel(category)}
                        </div>
                        {items.map((command) => {
                          globalIndex++;
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={command.id}
                              data-selected={isSelected}
                              onClick={() => executeCommand(command)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected
                                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                            >
                              <span className={`flex-shrink-0 ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                                {command.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{command.label}</div>
                                {command.description && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {command.description}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <FiArrowRight className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd>
                  to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">esc</kbd>
                  to close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage command palette state
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open/toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}
