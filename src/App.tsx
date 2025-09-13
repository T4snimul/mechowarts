import { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { GreatHall } from '@/components/GreatHall';
import { ProfileGrid } from '@/components/Grid';
import { Footer } from '@/components/Footer';
import { usePeopleFilter } from '@/hooks/usePeopleFilter';
import { PEOPLE } from '@/data/people';
import type { SortBy } from '@/types';

function AppContent() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('roll');
  const [houseFilter, setHouseFilter] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');

  const filteredPeople = usePeopleFilter(PEOPLE, query, sortBy, houseFilter, bloodGroupFilter);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Magical decorative background layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Misty gradients */}
        <div className="absolute -top-1/4 left-0 w-[44rem] h-[44rem] rounded-full bg-indigo-200/20 dark:bg-indigo-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[38rem] h-[38rem] rounded-full bg-purple-200/20 dark:bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Magical symbols */}
        <div className="absolute top-20 left-12 text-gray-500/40 dark:text-gray-500/20 text-5xl animate-pulse-slow">
          ✦
        </div>
        <div className="absolute bottom-40 right-20 text-gray-500/40 dark:text-gray-500/25 text-4xl animate-pulse-slow" style={{ animationDelay: '1s' }}>
          ✷
        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-500/30 dark:text-gray-500/20 text-6xl animate-pulse-slow" style={{ animationDelay: '3s' }}>
          ⚡
        </div>
        <div className="absolute bottom-12 left-1/3 text-gray-500/35 dark:text-gray-500/25 text-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}>
          ☾
        </div>
      </div>

      {/* Header */}
      <Header
        query={query}
        setQuery={setQuery}
      />

      {/* Main content */}
      <main
        id="app-scroll"
        className="scroll-hidden flex-1 min-h-0 overflow-y-auto pt-24 pb-12"
      >
        {/* The Great Hall Section */}
        <GreatHall
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={PEOPLE.length}
          filteredCount={filteredPeople.length}
          houseFilter={houseFilter}
          setHouseFilter={setHouseFilter}
          bloodGroupFilter={bloodGroupFilter}
          setBloodGroupFilter={setBloodGroupFilter}
        />

        {/* Grid Section */}
        <div className="mx-auto max-w-5xl px-6">
          <ProfileGrid people={filteredPeople} query={query} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider initialPeople={PEOPLE}>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
