import ProfileCard from "./ProfileCard";

export default function Grid({ filtered }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* Auto-fit columns; each card is at least 20rem (~320px) but can grow up to 1fr */}
      <div
        className="
          grid
          gap-x-6 gap-y-10
          [grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]
        "
      >
        {filtered.map((person, i) => (
          <div key={person.id} className="max-w-md">
            <ProfileCard person={person} index={i} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex h-[70vh] flex-col items-center justify-center text-center px-6">
          {/* Orb with sparkles */}
          <div className="relative mb-6">
            <div
              className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30
                      backdrop-blur-sm flex items-center justify-center shadow-lg
                      ring-2 ring-indigo-400/40 dark:from-indigo-400/20 dark:to-fuchsia-400/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-indigo-600 dark:text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            {/* subtle glowing aura */}
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20 dark:bg-indigo-400/15" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Nothing Found
          </h2>

          {/* Subtitle */}
          <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
            The Marauder’s Map shows no results for your search. Try casting a
            different spell ✨
          </p>
        </div>
      )}
    </section>
  );
}
