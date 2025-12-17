import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 text-center">
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/40 rounded-2xl p-8 shadow-xl">
        <div className="text-7xl mb-4">🧭</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The path you seek has vanished into thin air. Let’s take you back.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium transition-colors"
          aria-label="Go back home"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
