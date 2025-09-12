// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/* Minimal inline icons */
const IconPhone = (p) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M22 16.9v2a2 2 0 0 1-2.2 2 19.9 19.9 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.12.9.32 1.8.6 2.6a2 2 0 0 1-.46 2.1L7.1 8.6a16 16 0 0 0 6.27 6.27l1.17-1.15a2 2 0 0 1 2.11-.45c.85.27 1.73.47 2.63.59A2 2 0 0 1 22 16.9Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconFacebook = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.36-3.6 3.44-3.6.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.42V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12Z" />
  </svg>
);
const IconMapPin = (p) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);
const IconDroplet = (p) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M12 2s6 6.2 6 10.2A6 6 0 1 1 6 12.2C6 8.2 12 2 12 2Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
  </svg>
);
const IconShield = (p) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProfileCard({ person, index }) {
  const { house, houseRoll, status } = person;

  // subtle house tint for the border glow
  const houseGlow =
    house === "Gryffindor"
      ? "from-rose-500/30 via-amber-400/25 to-rose-500/30"
      : house === "Slytherin"
      ? "from-emerald-500/30 via-teal-400/25 to-emerald-500/30"
      : house === "Ravenclaw"
      ? "from-sky-500/30 via-indigo-400/25 to-sky-500/30"
      : house === "Hufflepuff"
      ? "from-amber-500/30 via-yellow-400/25 to-amber-500/30"
      : "from-indigo-500/25 via-fuchsia-500/20 to-cyan-500/25";

  const telHref = `tel:${(person.phone || "").replace(/[\s-]/g, "")}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group h-full rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20 shadow-lg transition-shadow hover:shadow-2xl"
    >
      {/* subtle glowing ring on hover */}
      <div
        className={`rounded-[calc(theme(borderRadius.3xl)-1px)] p-[1px] bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${houseGlow}`}
      />
      <div className="pointer-events-none absolute" />

      <div className="relative -mt-[calc(theme(borderRadius.3xl)-1px)] flex h-[34rem] flex-col overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white/85 backdrop-blur-md ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
        {/* BIG hero image with zoom-on-hover */}
        <div className="relative h-72 sm:h-80 overflow-hidden">
          <img
            src={person.avatar}
            alt={`${person.name} — photo`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          {/* Vignette to aid readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/15 to-transparent dark:from-black/60 dark:via-black/20" />

          {/* Roll badge (top-left) */}
          <div className="absolute left-3 top-3">
            <span className="rounded-xl bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-800 ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-800/80 dark:text-slate-100 dark:ring-white/10">
              {person.roll}
            </span>
          </div>

          {/* Name overlay (bottom-left) */}
          <div className="absolute left-3 bottom-3 right-3">
            <div className="inline-flex max-w-full items-center gap-2 rounded-2xl bg-white/85 px-4 py-2 text-base font-semibold text-slate-900 backdrop-blur-sm ring-1 ring-black/5 dark:bg-white/10 dark:text-slate-100 dark:ring-white/10">
              <span className="truncate">{person.name}</span>
              {house && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[12px] font-medium text-slate-600 dark:text-slate-300">
                  <span className="opacity-40">•</span>
                  <IconShield className="h-3.5 w-3.5" />
                  {house}
                  {houseRoll ? ` – ${houseRoll}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meta line under the image (for smaller screens & extra info) */}
        <div className="px-5 pt-3 text-[12px] text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {house && (
              <span className="inline-flex items-center gap-1">
                <IconShield className="h-3.5 w-3.5" />
                {house}
                {houseRoll ? ` – ${houseRoll}` : ""}
              </span>
            )}
            {house && <span className="opacity-40">·</span>}
            <span className="inline-flex items-center gap-1">
              <IconMapPin className="h-3.5 w-3.5" />
              {person.hometown}
            </span>
            {status && (
              <>
                <span className="opacity-40">·</span>
                <span className="text-emerald-700 dark:text-emerald-300">
                  {status}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Body blocks */}
        <div className="px-5 pt-3 space-y-2">
          {/* Blood group block */}
          <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <IconDroplet className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Blood Group
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {person.bloodGroup}
              </div>
            </div>
          </div>

          {/* Phone block */}
          <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <IconPhone className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Phone
                </span>
              </div>
              <a
                href={telHref}
                className="text-sm font-semibold text-slate-900 underline-offset-2 hover:underline dark:text-slate-100"
                aria-label={`Call ${person.name}`}
                title={`Call ${person.name}`}
              >
                {person.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Spacer so actions pin to bottom */}
        <div className="flex-1" />

        {/* Actions with better hover (lift + slight scale) */}
        <div className="border-t border-white/70 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white
                         px-3 py-2 text-xs font-semibold shadow-md transition
                         hover:shadow-xl hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <IconPhone className="h-4 w-4" />
              Call
            </a>

            <a
              href={person.fb}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         border border-slate-300/70 bg-white/70 text-slate-800
                         px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition
                         hover:border-indigo-300 hover:bg-white/80 hover:text-slate-900 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
                         dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200
                         dark:hover:border-indigo-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
              title={`Open ${person.name}'s Facebook`}
            >
              <IconFacebook className="h-4 w-4" />
              Facebook
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
