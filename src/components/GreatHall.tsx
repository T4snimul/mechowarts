import type { SortBy } from '@/types';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface GreatHallProps {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  totalCount: number;
  filteredCount: number;
  houseFilter: string;
  setHouseFilter: (house: string) => void;
  bloodGroupFilter: string;
  setBloodGroupFilter: (bloodGroup: string) => void;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  startIndex?: number;
  endIndex?: number;
  onPageSizeChange?: (size: number) => void;
}

export function GreatHall({
  sortBy,
  setSortBy,
  totalCount,
  filteredCount,
  houseFilter,
  setHouseFilter,
  bloodGroupFilter,
  setBloodGroupFilter,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
}: GreatHallProps) {

  const sortOptions = [
    { value: 'roll', label: 'Roll Number' },
    { value: 'name', label: 'Name' },
    { value: 'bloodGroup', label: 'Blood Status' },
    { value: 'hometown', label: 'Hometown' },
  ];

  const houseOptions = [
    { value: '', label: 'All Houses' },
    { value: 'Gryffindor', label: 'Gryffindor' },
    { value: 'Hufflepuff', label: 'Hufflepuff' },
    { value: 'Ravenclaw', label: 'Ravenclaw' },
    { value: 'Slytherin', label: 'Slytherin' },
  ];

  const bloodGroupOptions = [
    { value: '', label: 'All Blood Status' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const clearAllFilters = () => {
    setHouseFilter('');
    setBloodGroupFilter('');
    setSortBy('roll');
  };

  const hasActiveFilters = houseFilter || bloodGroupFilter || sortBy !== 'roll';
  const activeFilters = [
    houseFilter ? { label: 'House', value: houseFilter, clear: () => setHouseFilter('') } : null,
    bloodGroupFilter ? { label: 'Blood', value: bloodGroupFilter, clear: () => setBloodGroupFilter('') } : null,
    sortBy !== 'roll' ? { label: 'Sort', value: sortOptions.find((o) => o.value === sortBy)?.label ?? sortBy, clear: () => setSortBy('roll') } : null,
  ].filter(Boolean) as { label: string; value: string; clear: () => void }[];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
      {/* Hero Section */}
      <div className="text-center mb-3">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1.5">
          The Great Hall
        </h1>
        <p className="font-sans text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-1">
          Welcome to the heart of MechoWarts, where students from all four houses gather.
          Here you'll find our brilliant wizards and witches, each with their unique talents and magical heritage.
        </p>
        <p className="font-sans text-xs italic text-gray-500 dark:text-gray-400">
          "It is our choices that show what we truly are, far more than our abilities." - Albus Dumbledore
        </p>
      </div>

      {/* Flat Controls */}
      <div className="border-b border-gray-200/60 dark:border-gray-700/60 pb-2 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Stats */}
          <div className="font-display text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            <span className="text-amber-600 dark:text-amber-400">{filteredCount !== totalCount ? filteredCount : totalCount}</span>
            <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400 ml-2 font-sans">
              {filteredCount !== totalCount ? `of ${totalCount} wizards` : 'wizards enrolled'}
            </span>
            {currentPage && totalPages && startIndex !== undefined && endIndex !== undefined && filteredCount > 0 && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-3 font-sans">
                (Showing {startIndex + 1}-{endIndex})
              </span>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Clear Filters */}
            <button
              onClick={clearAllFilters}
              className={`text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700 dark:hover:text-red-300 underline underline-offset-2 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded px-1 ${hasActiveFilters
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
                }`}
              aria-hidden={!hasActiveFilters}
            >
              Clear All
            </button>

            {/* Sort */}
            <CustomSelect
              value={sortBy}
              onChange={(value) => setSortBy(value as SortBy)}
              options={sortOptions}
              placeholder="Sort by"
            />

            {/* House Filter */}
            <CustomSelect
              value={houseFilter}
              onChange={setHouseFilter}
              options={houseOptions}
              placeholder="Filter by house"
            />

            {/* Blood Group Filter */}
            <CustomSelect
              value={bloodGroupFilter}
              onChange={setBloodGroupFilter}
              options={bloodGroupOptions}
              placeholder="Filter by blood status"
            />
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.map((chip) => (
              <button
                key={`${chip.label}-${chip.value}`}
                onClick={chip.clear}
                className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200 shadow-sm hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-purple-900/40 dark:text-purple-100 dark:ring-purple-700/60 dark:hover:bg-purple-800/50 dark:focus:ring-purple-400 dark:focus:ring-offset-gray-900"
                aria-label={`Remove ${chip.label} filter ${chip.value}`}
              >
                <span className="uppercase tracking-wide text-[11px] text-purple-500 dark:text-purple-200">{chip.label}</span>
                <span className="font-semibold">{chip.value}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GreatHall;
