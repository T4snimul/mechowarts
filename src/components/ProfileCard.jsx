import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/* Inline icons (no deps) */
function IconPhone(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M22 16.9v2a2 2 0 0 1-2.2 2 19.9 19.9 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.12.9.32 1.8.6 2.6a2 2 0 0 1-.46 2.1L7.1 8.6a16 16 0 0 0 6.27 6.27l1.17-1.15a2 2 0 0 1 2.11-.45c.85.27 1.73.47 2.63.59A2 2 0 0 1 22 16.9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconFacebook(p) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.36-3.6 3.44-3.6.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.42V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}
function IconMapPin(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
function IconDroplet(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 2s6 6.2 6 10.2A6 6 0 1 1 6 12.2C6 8.2 12 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
function IconShield(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfileCard({ person, index }) {
  // optional: gracefully handle missing new fields
  const house = person.house; // "Gryffindor" | "Slytherin" | ...
  const year = person.year; // e.g., "Year 5"
  const patronus = person.patronus; // e.g., "Otter"
  const status = person.status; // e.g., "Available to donate"

  // house-tinted ring (optional)
  const houseRing =
    house === "Gryffindor"
      ? "ring-red-400/40"
      : house === "Slytherin"
      ? "ring-emerald-400/40"
      : house === "Ravenclaw"
      ? "ring-sky-400/40"
      : house === "Hufflepuff"
      ? "ring-amber-400/40"
      : "ring-indigo-300/30";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="h-full rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/25 via-fuchsia-500/25 to-cyan-500/25 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
        {/* HERO IMAGE (taller) */}
        <div className="relative h-72">
          {/* blur base to avoid any seam; crisp on top */}
          <img
            src={person.avatar}
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-[2px] scale-105 opacity-90"
          />
          <img
            src={person.avatar}
            alt={person.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* vignette for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/15 to-transparent dark:from-black/55 dark:via-black/20" />
          {/* ROLL ribbon (small attention, distinct from name) */}
          <div className="absolute left-0 top-4">
            <span className="rounded-r-xl bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-800 ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/10 dark:text-slate-100 dark:ring-white/10">
              {person.roll}
            </span>
          </div>
          {/* House crest chip (optional) */}
          {house && (
            <div className="absolute right-4 top-4 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-800 backdrop-blur-sm ring-2 dark:bg-white/10 dark:text-slate-100 dark:ring-white/20">
              <span className="inline-flex items-center gap-1">
                <IconShield className="h-3.5 w-3.5" />
                {house}
              </span>
            </div>
          )}
          {/* NAME label (primary attention) */}
          <div className="absolute left-4 bottom-4 right-4">
            <div
              className={`inline-flex items-center gap-2 rounded-2xl bg-white/85 px-4 py-2 text-base font-semibold text-slate-900 backdrop-blur-sm ring-2 ${houseRing} dark:bg-white/10 dark:text-slate-100`}
            >
              {person.name}
              {year && (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
                  • {year}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
          {/* details row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <IconDroplet className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Blood
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {person.bloodGroup}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <IconMapPin className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Hometown
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {person.hometown}
              </div>
            </div>
          </div>

          {/* optional status/patronus line */}
          {(status || patronus) && (
            <div className="mt-2 rounded-xl border border-slate-200/70 bg-white/70 p-3 text-sm text-slate-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              {status && <span className="font-semibold">{status}</span>}
              {status && patronus && <span className="mx-1 opacity-60">•</span>}
              {patronus && (
                <span>
                  Patronus: <span className="font-medium">{patronus}</span>
                </span>
              )}
            </div>
          )}

          {/* ACTIONS pinned to bottom for equal height */}
          <div className="mt-auto grid grid-cols-2 gap-2">
            <a
              href={`tel:${person.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         bg-gradient-to-tr from-indigo-600/95 to-fuchsia-600/95 text-white
                         px-3 py-2 text-xs font-semibold shadow-md transition
                         hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label={`Call ${person.name}`}
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
                         px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur
                         hover:border-indigo-300 hover:text-slate-900 hover:bg-white/80
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
                         dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200
                         dark:hover:border-indigo-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/70"
              aria-label={`Open Facebook profile of ${person.name}`}
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
