import { useState } from "react";
import Grid from "./components/Grid";
import Header from "./components/Header";
import usePeopleFilter from "./hooks/usePeopleFilter";
import { PEOPLE } from "./data/people";
import Footer from "./components/Footer";

export default function App() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filtered = usePeopleFilter(PEOPLE, query, sortBy);

  return (
    <div
      className="relative h-dvh min-h-screen flex flex-col overflow-hidden
      bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40
      dark:from-gray-950 dark:via-indigo-950/40 dark:to-purple-950/40"
    >
      {/* Magical decorative background layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Misty gradients */}
        <div className="absolute -top-1/4 left-0 w-[40rem] h-[40rem] rounded-full bg-indigo-200/20 dark:bg-indigo-800/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] rounded-full bg-purple-200/20 dark:bg-purple-800/20 blur-3xl" />

        {/* Magical symbols */}
        <div className="absolute top-20 left-12 text-gray-400/30 dark:text-gray-600/30 text-4xl">
          ✦
        </div>
        <div className="absolute bottom-40 right-20 text-gray-400/30 dark:text-gray-600/30 text-3xl">
          ✷
        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-400/20 dark:text-gray-700/20 text-5xl">
          ⚡
        </div>
        <div className="absolute bottom-12 left-1/3 text-gray-400/25 dark:text-gray-700/25 text-2xl">
          ☾
        </div>
      </div>

      <Header
        query={query}
        setQuery={setQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <main
        id="app-scroll"
        className="scroll-hidden flex-1 min-h-0 overflow-y-auto pt-20
          scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-200 scrollbar-corner-transparent
          hover:scrollbar-thumb-indigo-600"
      >
        <Grid filtered={filtered} />
        <Footer />
      </main>
    </div>
  );
}
