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
  pageSize,
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

  return (
    <section className="mx-auto max-w-5xl px-6 py-4">
      {/* Hero Section */}
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          The Great Hall
        </h1>
        <p className="font-sans text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
          Welcome to the heart of MechoWarts, where students from all four houses gather.
          Here you'll find our brilliant wizards and witches, each with their unique talents and magical heritage.
        </p>
        <p className="font-sans text-sm italic text-gray-500 dark:text-gray-400">
          "It is our choices that show what we truly are, far more than our abilities." - Albus Dumbledore
        </p>
      </div>

      {/* Flat Controls */}
      <div className="border-b border-gray-200/60 dark:border-gray-700/60 pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Stats */}
          <div className="font-display text-xl font-bold text-gray-900 dark:text-white">
            <span className="text-amber-600 dark:text-amber-400">{filteredCount !== totalCount ? filteredCount : totalCount}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2 font-sans">
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
              className={`text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700 dark:hover:text-red-300 underline underline-offset-2 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded px-1 ${
                hasActiveFilters
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
      </div>
    </section>
  );
}

export default GreatHall;
