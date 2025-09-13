import { useEffect, useState } from "react";
import logo from "../../assets/logo-full.png";

export default function Header({ query, setQuery, sortBy, setSortBy }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scroller = document.getElementById("app-scroll") || window;
    const getY = () =>
      scroller === window ? window.scrollY : scroller.scrollTop;

    const onScroll = () => setScrolled(getY() > 2);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    root.style.colorScheme = isDark ? "dark" : "light";
  }

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "py-2 px-3" : "py-3",
      ].join(" ")}
    >
      <div
        className={[
          "relative mx-auto max-w-7xl px-4",
          // glass bar
          "backdrop-blur-md",
          // border + lift on scroll
          scrolled
            ? "bg-white/60 dark:bg-gray-900/60 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            : "",
          "transition-all duration-300",
        ].join(" ")}
      >
        {/* Decorative subtle glyphs (background only) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-6 left-8 text-gray-400/20 dark:text-gray-600/20 text-2xl select-none">
            ✦
          </div>
          <div className="absolute bottom-0 right-10 text-gray-400/20 dark:text-gray-600/20 text-xl select-none">
            ✷
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-gray-400/10 dark:text-gray-600/10 text-4xl select-none">
            ⚡
          </div>
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-between gap-3 py-3">
          {/* Logo */}
          <div className="h-8 w-36 overflow-hidden">
            <img
              src={logo}
              alt="MTE-24 logo"
              className="block h-full w-full object-cover object-center dark:invert-[.9] dark:brightness-90 dark:contrast-75"
            />
          </div>

          {/* Search + Sort + Theme */}
          <div className="flex flex-1 items-center justify-end gap-2">
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
                className="w-full rounded-2xl border border-gray-300/70 bg-white/85 px-4 py-2 pl-11 text-sm shadow-sm
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                           dark:border-gray-700/70 dark:bg-gray-800/85 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:ring-offset-gray-900"
              />
              {/* search icon */}
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
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
            </div>

            {/* Sort */}
            <div className="relative">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-2xl border border-gray-300/70 bg-white/85 px-3 py-2 pr-8 text-sm shadow-sm
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                           dark:border-gray-700/70 dark:bg-gray-800/85 dark:text-gray-100 dark:focus-visible:ring-offset-gray-900"
              >
                <option value="name">Sort: Name</option>
                <option value="roll">Sort: Roll</option>
              </select>
              {/* chevron */}
              <svg
                className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {/* Theme toggle (SVG icons, solid focus ring, no default ring) */}
            <button
              onClick={toggleTheme}
              className="ml-1 inline-flex h-9 items-center justify-center gap-2 rounded-2xl border border-gray-300/70 bg-white/80 px-3 text-sm font-medium shadow-sm transition
                         hover:bg-white active:scale-95
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                         dark:border-gray-700/70 dark:bg-gray-800/80 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
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

        {/* Subtle rune divider (no gold, just masked gradient) */}
        <div
          className={[
            "mx-auto mb-1 h-px max-w-7xl",
            "bg-gradient-to-r from-transparent via-gray-400/30 to-transparent",
            "dark:via-gray-600/30",
          ].join(" ")}
        />
      </div>
    </header>
  );
}
