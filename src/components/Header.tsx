import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/ui/NotificationBell';

interface HeaderProps {
  query?: string;
  setQuery?: (query: string) => void;
}

export function Header({
  query = '',
  setQuery,
}: HeaderProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const {
    enableAnimations,
    setEnableAnimations,
    enableBackgroundEffects,
    setEnableBackgroundEffects,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
  } = useSettings();
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const mobileActionsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const navLinkClass = (path: string) => [
    "px-3 py-1.5 rounded-xl text-sm font-medium transition whitespace-nowrap",
    location.pathname === path
      ? "bg-purple-100/70 text-purple-800 ring-1 ring-purple-200/80 dark:bg-purple-900/40 dark:text-purple-100 dark:ring-purple-800/60"
      : "text-gray-700 hover:bg-gray-100/70 dark:text-gray-300 dark:hover:bg-gray-800/70",
  ].join(" ");

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (actionsRef.current && !actionsRef.current.contains(target)) {
        setActionsOpen(false);
      }
      if (mobileActionsRef.current && !mobileActionsRef.current.contains(target)) {
        setMobileActionsOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActionsOpen(false);
        setMobileActionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Theme toggle button component
  const ThemeToggleButton = ({ className = "" }: { className?: string }) => (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-300/70 bg-white/90 text-gray-800 shadow-sm transition hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-100 dark:hover:bg-gray-700/90 dark:focus-visible:ring-purple-400 dark:focus-visible:ring-offset-gray-900 ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );

  const renderMenuContent = (closeMenu: () => void, positionClass = "right-0") => (
    <div className={`absolute ${positionClass} mt-2 w-64 rounded-xl bg-white/95 dark:bg-gray-900/95 shadow-xl ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-md z-50`}>
      <div className="px-4 py-3 border-b border-gray-200/70 dark:border-gray-700/50">
        {isAuthenticated ? (
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name || 'Signed in'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300">Welcome to MechoWarts</p>
        )}
      </div>

      {/* Quick Links Section */}
      <div className="px-2 py-2 border-b border-gray-200/70 dark:border-gray-700/50">
        <p className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Quick Access</p>
        <div className="grid grid-cols-3 gap-1 mt-1">
          <Link
            to="/greathall"
            onClick={() => closeMenu()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">🏰</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Hall</span>
          </Link>
          <Link
            to="/owlery"
            onClick={() => closeMenu()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">🦉</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Owlery</span>
          </Link>
          <Link
            to="/materials"
            onClick={() => closeMenu()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">📚</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Library</span>
          </Link>
          <Link
            to="/calendar"
            onClick={() => closeMenu()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">📅</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Calendar</span>
          </Link>
          <Link
            to="/pomodoro"
            onClick={() => closeMenu()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">⏱️</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Focus</span>
          </Link>
          <Link
            to="/pensieve"
            onClick={() => closeMenu()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">💭</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Memories</span>
          </Link>
        </div>
      </div>

      {/* Visual Settings - Compact */}
      <div className="px-3 py-2 border-b border-gray-200/70 dark:border-gray-700/50">
        <p className="px-0 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Visual</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setEnableAnimations(!enableAnimations)}
            className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-colors ${enableAnimations
                ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'
              }`}
          >
            ✨ Animations
          </button>
          <button
            onClick={() => setEnableBackgroundEffects(!enableBackgroundEffects)}
            className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-colors ${enableBackgroundEffects
                ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'
              }`}
          >
            🌌 Effects
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-colors ${reducedMotion
                ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'
              }`}
          >
            🐢 Reduced
          </button>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-colors ${highContrast
                ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400'
              }`}
          >
            🔲 Contrast
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div className="p-3 space-y-2">
        {isAuthenticated ? (
          <>
            {/* My Profile Link */}
            <Link
              to="/profile"
              onClick={() => closeMenu()}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || 'My Profile'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View & edit profile</p>
              </div>
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign out
            </button>
          </>
        ) : (
          <Button
            onClick={() => {
              setAuthModalOpen(true);
              closeMenu();
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            size="sm"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            Sign in to MechoWarts
          </Button>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="px-3 py-2 border-t border-gray-200/70 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-mono">Ctrl+K</kbd> for command palette
        </p>
      </div>
    </div>
  );

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/70 dark:border-gray-700/50 shadow-sm"
    >
      {/* Desktop/Tablet Header */}
      <div
        className="hidden sm:block relative mx-auto px-4 sm:px-6 md:px-8 py-2.5"
      >
        {/* Content */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 md:gap-4 py-1">
          {/* Logo + Nav */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <Link
              to="/"
              className="group h-9 w-36 md:w-40 overflow-hidden rounded-xl"
              aria-label="Go to home"
            >
              <img
                src="/logo-full.png"
                alt="MechoWarts School of Witchcraft and Wizardry"
                className="block h-full w-full object-cover object-center transition duration-200 group-hover:scale-[1.02] dark:invert-[.9] dark:brightness-90 dark:contrast-75"
                role="img"
              />
            </Link>
            {/* Primary navigation (desktop + tablet) - now shows on sm screens */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link to="/greathall" className={navLinkClass('/greathall')}>Great Hall</Link>
              <Link to="/owlery" className={navLinkClass('/owlery')}>Owlery</Link>
              <Link to="/pomodoro" className={navLinkClass('/pomodoro')}>Focus</Link>
              <Link to="/materials" className={navLinkClass('/materials')}>Library</Link>
              <Link to="/calendar" className={navLinkClass('/calendar')}>Calendar</Link>
              <Link to="/pensieve" className={navLinkClass('/pensieve')}>Memories</Link>
            </nav>
          </div>

          {/* Search + Theme + Menu */}
          <div className="flex items-center justify-end gap-2 md:gap-3 flex-1 flex-wrap">
            {/* Search */}
            <div className={`relative transition-all duration-300 flex-1 min-w-[180px] max-w-full md:max-w-sm ${searchFocused ? '' : ''}`}>
              <label htmlFor="search" className="sr-only">
                Search members
              </label>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery?.(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search name, roll, blood..."
                className="w-full rounded-2xl border border-gray-300/70 bg-white/90 px-4 py-2 pl-11 pr-10 text-sm shadow-sm text-gray-900 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white
                           dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-purple-400 dark:focus:ring-offset-gray-900"
              />
              {/* search icon */}
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              {/* clear button */}
              {query && (
                <button
                  onClick={() => setQuery?.('')}
                  className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <div className={`flex items-center gap-2 transition-all duration-300 ${searchFocused ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              {/* Notification bell */}
              <NotificationBell />

              {/* Theme toggle button - outside menu */}
              <ThemeToggleButton />

              {/* Menu button with profile picture */}
              <div className="relative" ref={actionsRef}>
                <button
                  onClick={() => setActionsOpen(!actionsOpen)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-300/70 bg-white/90 px-2 h-9 text-sm font-medium shadow-sm transition text-gray-800 dark:text-gray-100 hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600/50 dark:bg-gray-800/90 dark:hover:bg-gray-700/90 dark:focus-visible:ring-purple-400 dark:focus-visible:ring-offset-gray-900"
                  aria-haspopup="true"
                  aria-expanded={actionsOpen}
                >
                  {isAuthenticated && user ? (
                    <img
                      src={user.avatar || '/default-avatar.svg'}
                      alt={user.name || 'Profile'}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>
                {actionsOpen && renderMenuContent(() => setActionsOpen(false))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden relative w-full px-4 py-2.5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery?.(e.target.value)}
            className="flex-1 rounded-full border border-gray-300/50 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            aria-label="Search for wizards"
          />
          {/* Notification bell */}
          <NotificationBell />

          {/* Theme toggle button - outside menu */}
          <ThemeToggleButton />

          {/* Menu button with profile picture */}
          <div className="relative" ref={mobileActionsRef}>
            <button
              onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-300/60 bg-white/90 text-gray-800 shadow-sm transition hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-100 dark:hover:bg-gray-700/90 dark:focus-visible:ring-purple-400 dark:focus-visible:ring-offset-gray-900 overflow-hidden"
              aria-haspopup="true"
              aria-expanded={mobileActionsOpen}
              aria-label="Open menu"
            >
              {isAuthenticated && user ? (
                <img
                  src={user.avatar || '/default-avatar.svg'}
                  alt={user.name || 'Profile'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            {mobileActionsOpen && renderMenuContent(() => setMobileActionsOpen(false), "right-0")}
          </div>
        </div>
        {/* Primary navigation (mobile) - centered */}
        <nav className="mt-2 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
          <Link to="/greathall" className={navLinkClass('/greathall')}>Hall</Link>
          <Link to="/owlery" className={navLinkClass('/owlery')}>Owlery</Link>
          <Link to="/pomodoro" className={navLinkClass('/pomodoro')}>Focus</Link>
          <Link to="/materials" className={navLinkClass('/materials')}>Library</Link>
          <Link to="/calendar" className={navLinkClass('/calendar')}>Calendar</Link>
          <Link to="/pensieve" className={navLinkClass('/pensieve')}>Memories</Link>
        </nav>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      {/* Settings panel removed: settings are inline in dropdown */}
    </header>
  );
}

// Legacy export for backward compatibility
export default Header;
