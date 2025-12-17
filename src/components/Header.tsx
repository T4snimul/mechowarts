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
  const [scrolled, setScrolled] = useState(false);
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
    const scroller = document.getElementById("main-content") || window;
    const getY = () =>
      scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop;

    const onScroll = () => setScrolled(getY() > 2);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

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

      <div className="p-3 space-y-2">
        {/* Settings toggles inline */}
        <label className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 8v8M8 12h8" />
            </svg>
            Animations
          </span>
          <input
            type="checkbox"
            checked={enableAnimations}
            onChange={(e) => setEnableAnimations(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        <button
          onClick={() => {
            setEnableBackgroundEffects(!enableBackgroundEffects);
            closeMenu();
          }}
          className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.2 14.7 8l5.8.8-4.3 4.1 1 6-5.2-3-5.2 3 1-6L3.5 8.8 9.3 8l2.7-5.8Z" />
            </svg>
            Magical background
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{enableBackgroundEffects ? 'On' : 'Off'}</span>
        </button>

        {/* Divider */}
        <div className="my-1 h-px bg-gray-200/70 dark:bg-gray-700/60" />

        <label className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16v16H4z" />
            </svg>
            Reduced motion
          </span>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        <label className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16M4 12h16M4 20h16" />
            </svg>
            High contrast
          </span>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        {/* Divider */}
        <div className="my-1 h-px bg-gray-200/70 dark:bg-gray-700/60" />

        {isAuthenticated ? (
          <>
            {/* My Profile Link */}
            <Link
              to="/profile"
              onClick={() => closeMenu()}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                My Profile
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Edit</span>
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/30"
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3h9z" />
                </svg>
                Logout
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Exit</span>
            </button>
          </>
        ) : (
          <Button
            onClick={() => {
              setAuthModalOpen(true);
              closeMenu();
            }}
            variant="outline"
            className="w-full justify-between px-3 py-2.5"
            size="sm"
          >
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Sign in
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Auth</span>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "py-2" : "py-2.5",
      ].join(" ")}
    >
      {/* Desktop/Tablet Header - Rounded with margins */}
      <div
        className={[
          "hidden sm:block relative mx-auto px-4 sm:px-6 md:px-8 py-2 rounded-xl sm:mx-2 md:mx-4 lg:mx-6",
          // glass bar with rounded corners
          "backdrop-blur-md",
          // border + lift on scroll
          scrolled
            ? "bg-white/80 dark:bg-gray-900/90 ring-1 ring-purple-200/50 dark:ring-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
            : "bg-white/60 dark:bg-gray-900/80 ring-1 ring-purple-200/40 dark:ring-purple-500/20",
          "transition-all duration-300",
        ].join(" ")}
      >
        {/* Decorative subtle glyphs (background only) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 left-8 text-gray-500/30 dark:text-gray-400/20 text-2xl select-none">

          </div>
          <div className="absolute bottom-0 right-10 text-gray-500/30 dark:text-gray-400/20 text-xl select-none">

          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-gray-500/20 dark:text-gray-500/15 text-4xl select-none">

          </div>
        </div>

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

      {/* Mobile Header - Full width, flat */}
      <div className="sm:hidden relative w-full px-4 py-2 bg-white/80 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md">
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
