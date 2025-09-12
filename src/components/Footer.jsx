export default function Footer() {
  return (
    <footer className="relative border-t border-gray-300/30 dark:border-gray-700/50 bg-gradient-to-b from-white/70 to-gray-100/40 dark:from-gray-900/70 dark:to-gray-950/60">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center">
        <p className="text-sm font-medium tracking-widest text-gray-700 dark:text-gray-300 uppercase">
          ⚡ Mischief Managed ⚡
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Made with <span className="text-rose-500">❤️</span> by{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            MTE-24
          </span>{" "}
          &copy; 2025
        </p>
      </div>

      {/* Decorative subtle stars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-8 text-gray-400/30 dark:text-gray-600/30 text-xl">
          ✶
        </div>
        <div className="absolute bottom-6 right-12 text-gray-400/30 dark:text-gray-600/30 text-lg">
          ✦
        </div>
        <div className="absolute top-1/2 left-1/3 text-gray-400/20 dark:text-gray-600/20 text-2xl">
          ✷
        </div>
      </div>
    </footer>
  );
}
