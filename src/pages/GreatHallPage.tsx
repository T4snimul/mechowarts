import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { GreatHall } from '@/components/GreatHall';
import { ProfileGrid } from '@/components/Grid';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { MagicalBackground } from '@/components/ui/MagicalBackground';
import { Pagination, PageSizeSelector } from '@/components/ui/Pagination';
import { usePeopleFilter } from '@/hooks/usePeopleFilter';
import { usePagination } from '@/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAppData } from '@/contexts/AppDataContext';
import type { SortBy, Person } from '@/types';

export function GreatHallPage() {
  const { people, isLoading } = useAppData();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('roll');
  const [houseFilter, setHouseFilter] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const navigate = useNavigate();

  const filteredPeople = usePeopleFilter(people, query, sortBy, houseFilter, bloodGroupFilter);

  const resetFilters = () => {
    setQuery('');
    setSortBy('roll');
    setHouseFilter('');
    setBloodGroupFilter('');
    pagination.goToPage(1);
  };

  const pagination = usePagination<Person>({
    totalItems: filteredPeople.length,
    itemsPerPage: 12,
    initialPage: 1,
  });

  const paginatedPeople = pagination.paginateItems(filteredPeople);

  const handleOpenPerson = (person: Person) => {
    navigate(`/wizard/${person.id}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Magical Background */}
      <MagicalBackground />

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Magical decorative background layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Misty gradients */}
        <div className="absolute -top-1/4 left-0 w-[44rem] h-[44rem] rounded-full bg-indigo-200/20 dark:bg-indigo-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[38rem] h-[38rem] rounded-full bg-purple-200/20 dark:bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Magical symbols */}
        <div className="absolute top-20 left-12 text-gray-500/40 dark:text-gray-500/20 text-5xl animate-pulse-slow">
          ✦
        </div>
        <div className="absolute bottom-40 right-20 text-gray-500/40 dark:text-gray-500/25 text-4xl animate-pulse-slow" style={{ animationDelay: '1s' }}>
          ✧
        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-500/30 dark:text-gray-500/20 text-6xl animate-pulse-slow" style={{ animationDelay: '3s' }}>
          ✦
        </div>
        <div className="absolute bottom-12 left-1/3 text-gray-500/35 dark:text-gray-500/25 text-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}>
          ✧
        </div>
      </div>

      {/* Header */}
      <Header
        query={query}
        setQuery={setQuery}
      />

      {/* Main content */}
      <main
        id="main-content"
        className="scroll-hidden flex-1 min-h-0 overflow-y-auto pt-20 pb-8"
      >
        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* The Great Hall Section */}
            <GreatHall
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={people.length}
              filteredCount={filteredPeople.length}
              houseFilter={houseFilter}
              setHouseFilter={setHouseFilter}
              bloodGroupFilter={bloodGroupFilter}
              setBloodGroupFilter={setBloodGroupFilter}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              onPageSizeChange={pagination.setPageSize}
            />

            {/* Card Grid */}
            <section className="px-4 sm:px-6 lg:px-8 py-4 max-w-[1600px] mx-auto w-full">
              {filteredPeople.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    No wizards found matching your criteria
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <>
                  <ProfileGrid
                    people={paginatedPeople}
                    onOpenPerson={handleOpenPerson}
                  />

                  {/* Pagination Controls */}
                  {filteredPeople.length > pagination.pageSize && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4">
                      <PageSizeSelector
                        pageSize={pagination.pageSize}
                        onPageSizeChange={pagination.setPageSize}
                      />
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.goToPage}
                        canGoNext={pagination.currentPage < pagination.totalPages}
                        canGoPrev={pagination.currentPage > 1}
                      />
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating action buttons */}
      <ScrollToTop />
    </div>
  );
}
