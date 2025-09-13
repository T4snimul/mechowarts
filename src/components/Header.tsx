import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
}

export function Header({
  query,
  setQuery,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const scroller = document.getElementById("main-content") || window;
    const getY = () =>
      scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop;

    const onScroll = () => setScrolled(getY() > 2);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "py-2 px-3" : "py-3",
      ].join(" ")}
    >
      <div
        className={[
          "relative mx-auto max-w-5xl px-8 py-4",
          // glass bar with rounded corners
          "backdrop-blur-md rounded-2xl",
          // border + lift on scroll
          scrolled
            ? "bg-white/80 dark:bg-gray-900/90 ring-1 ring-gray-200/50 dark:ring-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
            : "bg-white/60 dark:bg-gray-900/80",
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
        <div className="relative flex items-center justify-between gap-4 py-1">
          {/* Logo */}
          <div className="h-8 w-36 overflow-hidden flex-shrink-0">
            <img
              src="https://static.wikia.nocookie.net/harrypotter/images/f/f7/Hogwarts_Crest_Thumb.jpg"
              alt="MechoWarts School of Witchcraft and Wizardry - Navigate to home"
              className="block h-full w-full object-cover object-center dark:invert-[.9] dark:brightness-90 dark:contrast-75"
              role="img"
            />
          </div>

          {/* Search + Theme */}
          <div className="flex items-center justify-end gap-3">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <label htmlFor="search" className="sr-only">
                Search members
              </label>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, roll, blood, hometown, phone..."
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
                  onClick={() => setQuery('')}
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

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="ml-1 inline-flex h-9 items-center justify-center gap-2 rounded-2xl border border-gray-300/70 bg-white/90 px-3 text-sm font-medium shadow-sm transition text-gray-800 dark:text-gray-100
                         hover:bg-white active:scale-95
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                         dark:border-gray-600/50 dark:bg-gray-800/90 dark:hover:bg-gray-700/90 dark:focus-visible:ring-purple-400 dark:focus-visible:ring-offset-gray-900"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {/* moon/sun as vectors for crispness */}
              <svg
                className="dark:hidden h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* moon */}
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg
                className="hidden dark:block h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* sun */}
                <path d="M6.76 4.84 5.34 3.42 3.92 4.84l1.42 1.42 1.42-1.42zm10.48 0 1.42-1.42 1.42 1.42-1.42 1.42-1.42-1.42zM12 2h0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm9-6h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2zM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm1.76 7.16-1.42 1.42-1.42-1.42 1.42-1.42 1.42 1.42zM20.66 18.58l-1.42 1.42-1.42-1.42 1.42-1.42 1.42 1.42zM12 19a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Legacy export for backward compatibility
export default Header;
