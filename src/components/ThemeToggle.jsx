export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    root.style.colorScheme = isDark ? "dark" : "light";
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="ml-2 inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm font-medium shadow-sm
                 hover:bg-gray-100 active:scale-95 transition
                 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      <span className="dark:hidden">🌙</span>
      <span className="hidden dark:inline">☀️</span>
    </button>
  );
}
