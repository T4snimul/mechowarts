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
        "fixed inset-x-0 top-0 z-40",
        "transition-all duration-300",
        scrolled ? "py-2 px-4" : "py-3",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto max-w-7xl px-4",
          "backdrop-blur-md bg-white/65",
          "transition-all duration-300",
          scrolled
            ? "ring-1 ring-black/5 dark:ring-white/10 rounded-xl shadow-lg bg-white/70"
            : "",
          "dark:bg-gray-900/60 dark:shadow-black/20",
        ].join(" ")}
      >
        <div className="flex items-center py-2 justify-between gap-3">
          {/* Logo */}
          <div className="h-12 w-36 overflow-hidden">
            <img
              src={logo}
              alt="MTE-24 logo"
              className="block h-full w-full object-cover object-center dark:invert dark:brightness-90 dark:contrast-75"
            />
          </div>

          {/* Search + Sort + Dark mode toggle */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search members
              </label>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, roll, blood group, hometown, phone..."
                className="w-full rounded-2xl border border-gray-300 bg-white/90 px-4 py-2 pl-10 text-sm shadow-sm outline-none
                           focus-visible:ring-2 focus-visible:ring-indigo-500
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <svg
                className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
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
                className="appearance-none pr-8 rounded-2xl border border-gray-300 bg-white/90 px-3 py-2 text-sm shadow-sm outline-none
                           focus-visible:ring-2 focus-visible:ring-indigo-500
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="name">Sort: Name</option>
                <option value="roll">Sort: Roll</option>
              </select>
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

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm font-medium shadow-sm
                         hover:bg-gray-100 active:scale-95 transition
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                         dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              title="Toggle theme"
            >
              <span className="dark:hidden">🌙</span>
              <span className="hidden dark:inline">☀️</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
