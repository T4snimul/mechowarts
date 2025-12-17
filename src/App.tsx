import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppDataProvider, useAppData } from '@/contexts/AppDataContext';
import { Header } from '@/components/Header';
import { GreatHall } from '@/components/GreatHall';
import { ProfileGrid } from '@/components/Grid';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { MagicalBackground } from '@/components/ui/MagicalBackground';
import { Pagination, PageSizeSelector } from '@/components/ui/Pagination';
import { usePeopleFilter } from '@/hooks/usePeopleFilter';
import { usePagination } from '@/hooks';
import { usePeopleFromAPI } from '@/hooks/usePeopleFromAPI';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PEOPLE } from '@/data/people';
import { ToastStack, ToastItem } from '@/components/ui/Toast';
import { UserDetailPage } from '@/components/UserDetailPage';
import type { SortBy, Person } from '@/types';

function HomePage() {
  const { people, isLoading, apiError, refetch } = useAppData();
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

  const pagination = usePagination({
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

        </div>
        <div className="absolute bottom-40 right-20 text-gray-500/40 dark:text-gray-500/25 text-4xl animate-pulse-slow" style={{ animationDelay: '1s' }}>

        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-500/30 dark:text-gray-500/20 text-6xl animate-pulse-slow" style={{ animationDelay: '3s' }}>

        </div>
        <div className="absolute bottom-12 left-1/3 text-gray-500/35 dark:text-gray-500/25 text-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}>

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
        className="scroll-hidden flex-1 min-h-0 overflow-y-auto pt-24 pb-12"
      >
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error state */}
        {apiError && !isLoading && (
          <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded text-amber-800 dark:text-amber-200 space-y-2">
              <p className="font-semibold">⚠ Unable to load from server</p>
              <p className="text-sm">Using cached data. Connect to the backend server for live data.</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={refetch}
                  className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-amber-950 shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-100 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300 dark:focus:ring-amber-300 dark:focus:ring-offset-amber-900"
                >
                  Retry
                </button>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-300 hover:bg-white dark:bg-white/10 dark:text-amber-50 dark:ring-amber-500/60 dark:hover:bg-white/15"
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content when not loading */}
        {!isLoading && (
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

            {/* Grid Section */}
            <div className="mx-auto max-w-5xl px-6">
              <ProfileGrid
                people={paginatedPeople}
                query={query}
                onResetFilters={resetFilters}
                onOpenPerson={handleOpenPerson}
              />

              {/* Pagination Controls */}
              {filteredPeople.length > 0 && (
                <div className="mt-8 mb-6 space-y-3">
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={pagination.goToPage}
                      canGoNext={pagination.canGoNext}
                      canGoPrev={pagination.canGoPrev}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Page {pagination.currentPage} of {pagination.totalPages} • {pagination.pageSize} per page
                      </div>
                      <PageSizeSelector
                        pageSize={pagination.pageSize}
                        onPageSizeChange={pagination.setPageSize}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

function AppContent() {
  const { isLoading: authLoading, error: authError, clearError, isAuthenticated, user } = useAuth();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const authedRef = useRef<boolean>(false);

  // Fetch people from API, fallback to dummy data
  const { people: apiPeople, isLoading: apiLoading, error: apiError, refetch } = usePeopleFromAPI();

  // Use API data if available, otherwise fallback to dummy data
  const people = apiPeople.length > 0 ? apiPeople : PEOPLE;
  const isLoading = authLoading || apiLoading;

  const pushToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  useEffect(() => {
    if (apiError) {
      pushToast({ type: 'error', message: apiError });
    }
  }, [apiError]);

  useEffect(() => {
    if (authError) {
      pushToast({ type: 'error', message: authError });
      clearError();
    }
  }, [authError, clearError]);

  useEffect(() => {
    if (isAuthenticated && !authedRef.current) {
      pushToast({ type: 'success', message: `Welcome${user?.name ? `, ${user.name}` : ''}!` });
    }
    authedRef.current = isAuthenticated;
  }, [isAuthenticated, user?.name]);

  return (
    <AppDataProvider value={{ people, isLoading, apiError, refetch, pushToast }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard/:id" element={<UserDetailPage />} />
        </Routes>
      </Router>
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </AppDataProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <AppProvider initialPeople={PEOPLE}>
            <ModalProvider>
              <AppContent />
            </ModalProvider>
          </AppProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
