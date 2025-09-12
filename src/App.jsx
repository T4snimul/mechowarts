import { useState } from "react";
import Grid from "./components/Grid";
import Header from "./components/Header";
import usePeopleFilter from "./hooks/usePeopleFilter";
import { PEOPLE } from "./data/people";
import Footer from "./components/Footer";

export default function App() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // or "roll"

  const filtered = usePeopleFilter(PEOPLE, query, sortBy);

  return (
    <div className="h-dvh min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden">
      <Header
        query={query}
        setQuery={setQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <main
        id="app-scroll" // <-- so Header can listen here
        className="
    scroll-hidden flex-1 min-h-0 overflow-y-auto pt-20
    scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-200 scrollbar-corner-transparent
    hover:scrollbar-thumb-indigo-600
  "
      >
        <Grid filtered={filtered} />
        <Footer />
      </main>
    </div>
  );
}
