// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";

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

function getHouseClasses(house) {
  switch (house) {
    case "Gryffindor":
      return {
        ring: "from-rose-500/25 via-amber-400/20 to-rose-500/25",
        tint: "bg-rose-500/10",
        chip: "bg-rose-500/25 text-rose-400 ring-rose-400/40 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-400/30",
        name: "text-rose-700 dark:text-rose-200",
        roll: "dark:bg-rose-600 bg-rose-300/90 dark:text-rose-100 text-rose-900",
      };
    case "Slytherin":
      return {
        ring: "from-emerald-500/25 via-teal-400/20 to-emerald-500/25",
        tint: "bg-emerald-500/10",
        chip: "bg-emerald-500/25 text-emerald-400 ring-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/30",
        name: "text-emerald-700 dark:text-emerald-200",
        roll: "dark:bg-emerald-600 bg-emerald-300/90 dark:text-emerald-100 text-emerald-900",
      };
    case "Ravenclaw":
      return {
        ring: "from-sky-500/25 via-indigo-400/20 to-sky-500/25",
        tint: "bg-sky-500/10",
        chip: "bg-sky-500/25 text-sky-400 ring-sky-400/40 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/30",
        name: "text-indigo-700 dark:text-sky-200",
        roll: "dark:bg-indigo-600 bg-indigo-300/90 dark:text-indigo-100 text-indigo-900",
      };
    case "Hufflepuff":
      return {
        ring: "from-amber-500/25 via-yellow-400/20 to-amber-500/25",
        tint: "bg-amber-500/10",
        chip: "bg-amber-400/25 text-amber-400 ring-amber-400/40 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/30",
        name: "text-amber-700 dark:text-amber-200",
        roll: "dark:bg-amber-600 bg-amber-300/90 dark:text-amber-100 text-amber-900",
      };
    default:
      return {
        ring: "from-indigo-500/20 via-fuchsia-500/15 to-cyan-500/20",
        tint: "bg-indigo-500/10",
        chip: "bg-slate-200 text-slate-900 ring-slate-300/80 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-600",
        name: "text-slate-900 dark:text-slate-100",
        roll: "dark:bg-slate-600 bg-slate-300/90 dark:text-slate-100 text-slate-900",
      };
  }
}

export default function ProfileCard({ person, index }) {
  const { house, houseRoll, status } = person;
  const telHref = `tel:${(person.phone || "").replace(/[\s-]/g, "")}`;
  const { ring, tint, chip, name: nameColor, roll } = getHouseClasses(house);
  const [copied, setCopied] = useState(false);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(person.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 1.5s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group relative h-[32rem] rounded-[2rem] overflow-hidden bg-white/90 shadow-lg ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10"
    >
      {/* Glow on hover */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[2rem] p-[2px] bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${ring}`}
      />

      {/* Background image */}
      <img
        src={person.avatar}
        alt={person.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Tint */}
      <div className={`absolute inset-0 ${tint} mix-blend-soft-light`} />

      {/* Default gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0 dark:from-black/65 dark:via-black/20" />

      {/* Roll number badge (top-left) */}
      <div className="absolute left-0 top-0 z-20">
        <span
          className={`inline-block rounded-br-full ${roll} px-6 py-1.5
                 text-sm font-bold shadow-md`}
        >
          {person.roll}
        </span>
      </div>

      {/* Default chips + name */}
      <div className="absolute bottom-5 left-5 right-5 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        <div
          className={`inline-flex max-w-full items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-base font-semibold ring-1 ring-black/5 backdrop-blur-md dark:bg-white/10 dark:ring-white/10 ${nameColor}`}
        >
          <span className="truncate">{person.name}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {house && (
            <span
              className={`rounded-full px-2.5 py-1 font-medium ring-1 ${chip}`}
            >
              {houseRoll ? `${house} — ${houseRoll}` : house}
            </span>
          )}
          {status && (
            <span className="rounded-full bg-emerald-500/25 px-2.5 py-1 font-medium text-emerald-400 ring-1 ring-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/30">
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Hover panel - auto height */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full rounded-t-[2rem] bg-white/95 p-5 shadow-[0_-10px_28px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:translate-y-0 dark:bg-slate-900/95">
        <h3 className={`text-lg font-semibold ${nameColor}`}>{person.name}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {house ? `${house} ${houseRoll ? `– ${houseRoll}` : ""}` : ""}
        </p>

        {/* Info blocks */}
        <div className="mt-5 grid grid-cols-1 gap-3">
          {/* Hometown */}
          <div
            className="flex items-center gap-3 rounded-2xl border border-indigo-200/70 bg-indigo-50/70 p-3 shadow-sm backdrop-blur-sm
                  dark:border-indigo-500/40 dark:bg-indigo-500/10"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600
                    dark:bg-indigo-500/20 dark:text-indigo-300"
            >
              {/* Pin icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                Hometown
              </p>
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                {person.hometown}
              </p>
            </div>
          </div>

          {/* Blood group */}
          <div
            className="flex items-center gap-3 rounded-2xl border border-rose-200/70 bg-rose-50/70 p-3 shadow-sm backdrop-blur-sm
                  dark:border-rose-500/40 dark:bg-rose-500/10"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600
                    dark:bg-rose-500/20 dark:text-rose-300"
            >
              {/* Droplet icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path d="M12 2s6 6.2 6 10.2A6 6 0 1 1 6 12.2C6 8.2 12 2 12 2Z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-rose-500 dark:text-rose-300">
                Blood
              </p>
              <p className="text-sm font-bold text-rose-900 dark:text-rose-200">
                {person.bloodGroup}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div
            className="flex items-center gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-3 shadow-sm backdrop-blur-sm
                  dark:border-emerald-500/40 dark:bg-emerald-500/10"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600
                    dark:bg-emerald-500/20 dark:text-emerald-300"
            >
              {/* Phone icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.9 19.9 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.12.9.32 1.8.6 2.6a2 2 0 0 1-.46 2.1L7.1 8.6a16 16 0 0 0 6.27 6.27l1.17-1.15a2 2 0 0 1 2.11-.45c.85.27 1.73.47 2.63.59A2 2 0 0 1 22 16.9Z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-emerald-500 dark:text-emerald-300">
                Phone
              </p>
              <button
                type="button"
                onClick={copyPhone}
                className="relative cursor-copy text-sm font-semibold text-emerald-900 underline-offset-2 hover:underline dark:text-emerald-200"
                title="Click to copy"
              >
                {copied ? "Copied!" : person.phone}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <a
            href={telHref}
            className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-emerald-500 dark:text-white dark:text-slate-900"
          >
            <IconPhone className="h-4 w-4 mr-1" /> Call
          </a>
          <a
            href={person.fb}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300"
          >
            <IconFacebook className="h-4 w-4 mr-1" /> Facebook
          </a>
        </div>
      </div>
    </motion.article>
  );
}
